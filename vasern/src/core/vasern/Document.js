//= ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//= ===============================================================

import { NativeModules } from "react-native";
import { Parser, EventSubscriber, Queryable } from "..";
import _ from "lodash";
import { Reporter } from "../vasern-utils";
import DefaultConfigs from "../../config";

import ObjectID, { OBJECTID_LEN } from "../../plugins/vasern-objectid";

const { VasernManager } = NativeModules;

export default class Document {
  // record list
  // _data: Array<Object>;

  // record schema
  // props: Object;

  // record id handler
  // oid: ObjectID;

  // Flag data is available
  available = false;

  // Flag data has completely converted to objects
  loaded = false;

  constructor(args) {
    // Initiate Document using a schema class
    if (typeof args === "function") {
      // TODO: validate schema (i.e require "name" and "props")
      this.inject(args);
    } else {
      this.props = args.props;
      this.version = args.version;
      this.name = args.name;
    }

    if (!this.version) {
      this.version = DefaultConfigs.version;
    }

    this.storeOptions = DefaultConfigs.storeOptions;

    // Event triggers
    this.eventManager = new EventSubscriber();

    // this.request = new ServerRequest(host, ePath);
    this.oid = new ObjectID();

    // initate _data
    this._data = [];

    this.bindEvents.bind(this)(); // Question: Is there a reason for the double ()?
  }

  bindEvents() {
    // Events binding
    this.on = this.on.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInsert = this.onInsert.bind(this);
    this.onUpdate = this.onInsert.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.onAvailable = this.onAvailable.bind(this);
    this.rollbackCommittedRecords = this.rollbackCommittedRecords.bind(this);
  }

  object(input) {
    let object =
      typeof input === "number" ? this._data[input] : this.get(input);

    if (!this.loaded) {
      object = Parser.strToObject(this.props, object);
    }

    return object;
  }

  // Converting raw data (unformated large string) to a 'Doc' style data
  // When data complete formating (mean data is loaded),
  // call all the callback has been subscribed (see function 'loaded')
  // @rawData: raw data string
  populate({ data }) {
    // Convert raw data
    if (data && data.length > 0) {
      const records = new Array(data.length);
      const ids = new Array(data.length);
      let objCount = 0;
      let currentIdIndex = -1;
      let key;
      let value;

      data.forEach(raw => {
        if (raw.length) {
          key = raw.substr(0, OBJECTID_LEN);
          value = raw.substr(OBJECTID_LEN + 2);
          currentIdIndex = ids.indexOf(key);

          if (currentIdIndex !== -1) {
            records[currentIdIndex].raw = value;
          } else {
            records[objCount] = {
              id: key,
              raw: value,
            };
            ids[objCount] = key;
            objCount += 1;
          }
        }
      });

      // Clean up duplicate
      records.splice(objCount);

      // Remove deleted record;
      this._data = records.filter(item => item.raw.length);

      setTimeout(() => {
        this.formatData();
      });
    } else {
      this.loaded = true;
      this.eventManager.fire("loaded");
    }

    // Update Doc loaded status
    this.available = true;

    // Fire all callback functions have been subscribed earlier (at 'loaded' function)
    this.eventManager.fire("available");
  }

  async formatData() {
    let obj;
    this._data.forEach((d, i) => {
      obj = Parser.strToObject(this.props, d);
      if (obj) {
        this._data[i] = obj;
      }
    });

    this.loaded = true;
    this.eventManager.fire("loaded");
  }

  // Remove a record that match given query
  // @query: id or key value (i.e { name: 'Jonas' }) that match the object that will be remove
  // @save: save/persist data, defaut is true
  remove(query, save = true) {
    const found = this.get(query);
    if (found) {
      this._commitChange("remove", found, save);
      return true;
    }

    // Not found record to be deleted
    return false;
  }

  // Create a new content record which return an object with generated UUID
  // Input will be validated using given schema of when initiate Doc
  // @input: a valid record
  insert(records, save = true) {
    if (!records) {
      throw Error(`Unable to insert, record must not be empty`);
    }

    const inputs = Array.isArray(records) ? records : [records];

    let propKeys;
    const validObjects = inputs.map(input => {
      propKeys = Object.keys(input);

      if (!this.validateProps(propKeys)) {
        Reporter.warn(
          `Invalid input for ${
            this.name
          }. Record will not be added into database`
        );

        Reporter.warn(propKeys, Object.keys(this.props));
        return null;
      }

      const content = this.oid.new();

      propKeys.forEach(k => {
        // content[k] = Parser.parseValue(this.props[k], input[k]);
        content[k] = input[k];
      });

      this._commitChange("insert", content, save);

      // Avoid id being washed using save
      // content.id = uuid;

      return content;
    });

    // Invalid data type or content not match with schema
    return validObjects;
  }

  update(lookupQuery, newValues, save = true) {
    let found = this.get(lookupQuery); // eslint-disable-line
    if (found) {
      const { id, ...rest } = newValues;

      let tempObj;
      Object.keys(rest).forEach(key => {
        tempObj = rest[key];
        if (this.props[key].indexOf("#") === 0) {
          if (typeof tempObj === "object" && tempObj.id) {
            found[`${key}_id`] = tempObj.id;
          } else if (typeof tempObj === "string") {
            found[`${key}_id`] = tempObj;
          }
        } else {
          found[key] = tempObj;
        }
      });

      this._commitChange("update", found, save);

      return found;
    }

    return false;
  }

  // Update, write or remove item all together
  perform(callback) {
    callback({
      remove: query => this.remove(query, false),
      insert: input => this.insert(input, false),
      update: (query, newValues) => this.update(query, newValues, false),
      get: query => this.get(query),
    });

    this.save();
  }

  // Create a prototype content record (not saved into ) which return an object with generated UUID
  // Input will be validated using given schema of when initiate Doc
  // @input: a valid record
  createPrototype(input) {
    const propKeys = Object.keys(input);

    if (!this.validateProps(propKeys)) {
      Reporter.warn(
        `Invalid input for ${this.name}. Record will not be added into database`
      );
      return null;
    }

    const content = {};
    propKeys.forEach(k => {
      content[k] = Parser.parseValue(this.props[k], input[k]);
    });

    return this.oid.new(content);
  }

  // Loading data from the backend-side
  // then populate
  async load() {
    let rawData;

    try {
      rawData = await VasernManager.Request(this.docName());
    } catch (e) {
      // TODO: handle failed Request
    }

    this.populate(rawData);
  }

  // Send current data to backend to save/persist
  async save() {
    // Check if records is being written to file
    // If it is, delay until write process is completed,
    // then process write request (see 1)
    if (!this.isWriting) {
      const currentCommitItems = this._commitedItems;
      this._commitedItems = {
        insert: [],
        update: [],
        remove: [],
      };
      const logRecords = Parser.convertToLog(this.props, currentCommitItems);
      this.isWriting = true;
      try {
        await VasernManager.Insert(
          this.docName(),
          logRecords,
          this.storeOptions
        );

        // Trigger subscribed events
        this._executeCommitedEvents(currentCommitItems);
        this.isWriting = false;

        // Check and process queueing commits
        if (this._isCommitOnQueue) {
          this.save();
          this._isCommitOnQueue = false;
        }
      } catch (e) {
        this.isWriting = false;
        this.rollbackCommittedRecords(currentCommitItems);
      }
    } else {
      this._isCommitOnQueue = true;
    }
  }

  // !!! Remove all records of the document
  // Warning: Records are unable to cover after removed, use with causion
  async removeAllRecords() {
    await VasernManager.ClearDocument(this.docName());
    this._data = [];
    this.eventManager.fire("remove");
  }

  // Merge previous commited items to the current commited item list
  // then write to database.
  // Used as rollback mechanism when commited items failed to write to database
  rollbackCommittedRecords(previousCommitedItems) {
    Object.keys(previousCommitedItems).forEach(key => {
      if (previousCommitedItems[key].length > 0) {
        this._commitedItems[key] = previousCommitedItems.concat(
          this._commitedItems[key]
        );
      }
    });
    this.save();
  }

  async createSnapshot() {
    const logRecords = new Array(this._data.length);
    this._data.forEach(i => {
      logRecords.push(Parser.objToStr(this.props, i));
    });

    try {
      await VasernManager.Insert(this.docName(), logRecords, [
        "enable_clean_mode",
      ]);
    } catch (e) {
      // TODO: handle Insert fail
    }
  }

  // Return a legit document name
  docName() {
    return `${this.name}_${this.version}`;
  }

  // Execute callback while ensuring data is loaded completely. If data is loaded, execute it.
  // Else push into sub"_"ibers list to execute when data is loaded (see 'populate' function)
  // @callback: a callback function, given reference of this Doc object
  // Example usage: doc.loaded(doc => { Reporter.err(doc.toArray()) })
  onLoaded(callback) {
    if (this.loaded) {
      callback(this);
    } else {
      this.eventManager.subscribe("loaded", { callback });
    }
  }

  // Execute callback while ensuring data is loaded completely. If data is loaded, execute it.
  // Else push into subscribers list to execute when data is loaded (see 'populate' function)
  // @callback: a callback function, given reference of this Doc object
  // Example usage: doc.loaded(doc => { Reporter.err(doc.toArray()) })
  onAvailable(callback) {
    if (this.available) {
      callback(this);
    } else {
      this.eventManager.subscribe("available", { callback });
    }
  }

  /** ====================//
  //====   TRIGGERS   ====//
  /====================== */

  on(eventType, callback) {
    this.eventManager.subscribe(eventType, { callback });
  }

  onInsert(callback) {
    this.eventManager.subscribe("insert", { callback });
  }

  onRemove(callback) {
    this.eventManager.subscribe("remove", { callback });
  }

  onUpdate(callback) {
    this.eventManager.subscribe("update", { callback });
  }

  onChange(callback) {
    this.eventManager.onChange({ callback });
  }

  /** ===================//
  //=====   UTILS   =====//
  //==================== */

  // Return the length of children data
  length() {
    return this._data.length;
  }

  // Comparing given keys with schema props
  // Return boolean value
  // @key: Array of object key of new record
  validateProps = keys => {
    const schemaProps = Object.keys(this.props);
    const objectProps = keys;
    let isValid = true;
    let correctProps = 0;
    schemaProps.forEach(k => {
      // Optional props
      if (this.props[k].indexOf("?") > -1) {
        correctProps += 1;
      } else if (objectProps.indexOf(k) === -1 && k !== "id") {
        // prop not exists
        isValid = false;
      } else {
        // invalid error found => I think it's the opposite?
        correctProps += 1;
      }
    });

    if (correctProps !== schemaProps.length) {
      Reporter.warn(
        "Doc.validateProps: Input has more props than schema. Non-exists props will be removed"
      );
      Reporter.warn(schemaProps, objectProps);
    }

    return isValid;
  };

  /* ======================//
  //=====   COMMITS   =====//
  //===================== */
  // These function and variables should not be used directly

  _commitedItems = {
    insert: [],
    update: [],
    remove: [],
  };

  // Flag writing procsses is executing
  // (not available to write right away)
  _isCommitOnQueue = false;

  _commitChange = (type, item, save = false) => {
    // Check if commit status is available
    if (this._commitedItems[type]) {
      this._commitedItems[type].push(item);

      if (save) {
        this.save();
      }
    } else {
      // TODO: handle invalid commit type
      throw Error("Unable to commit change of type: ", type, "\n", item);
    }
  };

  // Trigger events for each of commited records
  // then clear commitedItems
  _executeCommitedEvents = items => {
    Object.keys(items).forEach(key => {
      if (items[key].length) {
        // TODO: merge changed records to data
        this._mergeRecords(key, items[key]);
        this.eventManager.fire(key, items[key]);
      }
    });
  };

  // Merging commited records to the main record list
  // after data processes (insert/update/remove) are completed
  // TODO: Make sure records passed through is valid
  _mergeRecords = (event, records) => {
    let index;
    switch (event) {
      case "update":
        records.forEach(r => {
          index = _.findIndex(this._data, { id: r.id });
          if (index !== -1) {
            this._data[index] = r;
          }
        });
        break;
      case "insert":
        this._data = this._data.concat(records);
        break;

      case "remove":
        records.forEach(record => {
          _.remove(this._data, { id: record.id });
        });
        break;
      default:
        // Should not going through here
        break;
    }
  };

  /* =============================//
  //=====   STATIC METHODS   =====//
  //============================= */

  /**
   * Import a plugin class into Document class
   * Plugin requires a static "methods" property
   * which contains an array of function name that will be assign into Document prototype
   * @param {class function or object} plugin
   */
  static import(plugin) {
    if (plugin.methods) {
      plugin.methods.forEach(k => {
        Document.prototype[k] = plugin.prototype[k];
      });
    } else {
      throw Error(
        `Unable to import "${plugin.name}". "${
          plugin.name
        }.methods" does not exist`
      );
    }
  }

  /**
   * Merge properties and functions from a class to Document object
   * Use to initate Document with model class
   * @param {class function or object} model
   */
  inject(Model) {
    const tempOb = new Model();

    // Merge properties
    Object.keys(tempOb).forEach(f => {
      this[f] = tempOb[f];
    });

    // Merge functions
    const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(tempOb));
    functions.splice(functions.indexOf("constructor"), 1);
    functions.forEach(f => {
      this[f] = Model.prototype[f];
    });
  }
}

// Default imports
Document.import(Queryable);
