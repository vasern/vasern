//= ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//= ===============================================================


import { NativeModules } from "react-native";
import { Parser, EventSubscriber } from "..";
import { Reporter } from "../vasern-utils";
import ObjectID, { OBJECTID_LEN } from "../../plugins/vasern-objectid";

import { formatNativeQuery, formatNativeSchema } from "./utils";
import QueryBuilder from "./QueryBuilder";

// @flow
const { VasernManager } = NativeModules;

type NativePropType = {
  type: "string" | "number" | "boolean" | "ref",
  size: number,
  relate?: string,
  primary?: boolean,
  indexed?: boolean
 };
 
type NativePropTypeList = { [key: string]: NativePropType };
type Props = {
  name: string
};
type Schema = {
  key: NativePropType, 
  indexes: NativePropTypeList,
  body: NativePropTypeList
};
 
export default class Collection<Props> {
  // record list
  _data: Array<Object>;

  // record schema
  props: NativePropTypeList;

  _nativeSchema: Schema;

  // record id handler
  oid: ObjectID;

  // Flag data is available
  available = false;

  // Flag data has completely converted to objects
  loaded = false;

  version: number = 1;
  name: string;
  storeOptions: Object;
  eventManager: EventSubscriber;

  constructor( args: Function | Object ) {

    // Initiate Collection using a schema class
    if (typeof args === "function") {

      // TODO: validate schema (i.e require "name" and "props")
      this.inject(args);

    } else {
      this.props = args.props;
      this.name = args.name;
    }

    // Event triggers
    this.eventManager = new EventSubscriber();

    // this.request = new ServerRequest(host, ePath);
    this.oid = new ObjectID();

    this.bindEvents.bind(this)();
  }

  /*:: bindEvents: () => void; */
  bindEvents() {
    // Events binding
    this.on = this.on.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInsert = this.onInsert.bind(this);
    this.onUpdate = this.onInsert.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onAvailable = this.onAvailable.bind(this);
  }

  nFilter(query: Object) {

    return VasernManager.Query(this.name, query);
  }

  filter(query: Object): QueryBuilder {
    return new QueryBuilder(query, this);
  }

  nCount(query: Object) {
    
    var result = new Proxy({ count: 0 }, {});

    (async () => {
      
      let queryResults = await VasernManager.Count(this.name, formatNativeQuery(this.props, query));
      result.count = queryResults.data.count;
    })();

    return result;
  }

  rRemove(ids: Array<string>) {
    var result = new Proxy({ status: 0 }, {});

    (async () => {
      
      let queryResults = await VasernManager.Delete(this.name, ids);
      result.status = queryResults.status;
      console.log(result)
    })();

    return result;
  }
  
  /*:: assignNativeSchema: () => void; */
  assignNativeSchema() {
    this._nativeSchema = formatNativeSchema(this.props);
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
      return false;
    }

    const inputs = Array.isArray(records) ? records : [records];

    let propKeys;
    const validObjects = inputs.map(input => {
      propKeys = Object.keys(input);

      // if (!this.validateProps(propKeys)) {
      //   Reporter.warn(
      //     `Invalid input for ${
      //       this.name
      //     }. Record will not be added into database`
      //   );

      //   Reporter.warn(propKeys, Object.keys(this.props));
      //   return null;
      // }

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
    const found = this.get(lookupQuery);
    if (found) {
      const { id, ...rest } = newValues;

      Object.assign(found, { ...rest });

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

  // Send current data to backend to save/persist
  async save() {
    // Check if records is being written to file
    // If it is, delay until write process is completed,
    // then process write request (see 1)
    if (!this.isWriting) {
      // const logRecords = Parser.convertToLog(this._nativeSchema, this._commitedItems);
      const logRecords = this._commitedItems.insert;
      this.isWriting = true;
      
      try {
        const success = await VasernManager.Insert(
          this.name,
          logRecords
          // this.storeOptions
        );

        if (success) {
          // Trigger subscribed events
          this._executeCommitedEvents();
          this.isWriting = false;
        }

        // TODO: handle unsuccess request (i.e retry, throw exception)

        // Check and process queueing commits
        if (this._isCommitOnQueue) {
          this.save();
          this._isCommitOnQueue = false;
        }
      } catch (e) {
        // TODO: handle Insert failed
      }
    } else {
      this._isCommitOnQueue = true;
    }
  }

  // Return a legit document name
  docName() {
    return `${this.name}_${this.version}`;
  }

  // Execute callback while ensuring data is loaded completely. If data is loaded, execute it.
  // Else push into subscribers list to execute when data is loaded (see 'populate' function)
  // @callback: a callback function, given reference of this Doc object
  // Example usage: doc.loaded(doc => { Reporter.err(doc.toArray()) })
  /*:: onAvailable: (callback: Function) => void; */
  onAvailable(callback: Function) {
    if (this.available) {
      callback(this);
    } else {
      this.eventManager.subscribe("available", { callback });
    }
  }

  /** ====================//
  //====   TRIGGERS   ====//
  /====================== */
  /*:: on: (callback: Function) => void; */
  on(eventType: string, callback: Function) {
    this.eventManager.subscribe(eventType, { callback });
  }

  /*:: onInsert: (callback: Function) => void; */
  onInsert(callback: Function) {
    this.eventManager.subscribe("insert", { callback });
  }

  /*:: onRemove: (callback: Function) => void; */
  onRemove(callback: Function) {
    this.eventManager.subscribe("remove", { callback });
  }

  /*:: onUpdate: (callback: Function) => void; */
  onUpdate(callback: Function) {
    this.eventManager.subscribe("update", { callback });
  }

  /*:: onChange: (callback: Function) => void; */
  onChange(callback: Function) {
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
    return true;
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
        // invalid error found
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
  _executeCommitedEvents = () => {
    Object.keys(this._commitedItems).forEach(k => {
      if (this._commitedItems[k].length) {
        // TODO: merge changed records to data
        this._mergeRecords(k, this._commitedItems[k]);
        this.eventManager.fire(k, this._commitedItems[k]);
        this._commitedItems[k] = [];
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
   * Import a plugin class into Collection class
   * Plugin requires a static "methods" property
   * which contains an array of function name that will be assign into Collection prototype
   * @param {class function or object} plugin
   */
  static import(plugin) {
    if (plugin.methods) {
      plugin.methods.forEach(k => {
        Collection.prototype[k] = plugin.prototype[k];
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
   * Merge properties and functions from a class to Collection object
   * Use to initate Collection with model class
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
// Collection.import(Queryable);
