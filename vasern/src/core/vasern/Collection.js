//= ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//= ===============================================================


import { NativeModules } from 'react-native';

import EventSubscriber from '../vasern-subscriber';
import ObjectID from '../vasern-objectid';

import QueryBuilder, { toNativeQuery } from '../vasern-querybuilder';
import createResultInterface from './utils/ResultInterface';

// @flow
type ResultInterface = {
  asProxy: Object,
  asPromise: Promise,
  run: void
}

const { VasernManager } = NativeModules;

type NativePropType = {
  type: "string" | "number" | "boolean" | "ref",
  size: number,
  relate?: string,
  primary?: boolean,
  indexed?: boolean
 };
 
type NativePropTypeList = { [key: string]: NativePropType };
 
export default class Collection {
  // record list
  _data: Array<Object>;

  // record schema
  props: NativePropTypeList;

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

    this.eventManager = new EventSubscriber();
    this.oid = new ObjectID();
    this.bindEvents.bind(this)();
    
    let refProps = [];
    for (let key in this.props) {
      if (this.props[key].relate) {
        this.props[`${key}_id`] = this.props[key];
        refProps.push({
          representProp: key,
          actualProp: `${key}_id`
        });
      }
    }
    this.refProps = refProps;
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
    return VasernManager.GetRecordsByQuery(this.name, query);
  }

  filter(query: Object): QueryBuilder {
    return new QueryBuilder(query, this);
  }

  count(query: Object): ResultInterface {
    let nativeQuery = toNativeQuery(this.props, query);
    return createResultInterface(
      () => VasernManager.CountRecordsByQuery(this.name, nativeQuery),
      { asArray: false }
    );
  }

  records(): ResultInterface {
    return createResultInterface(
      () => VasernManager.AllRecords(this.name),
      { asArray: true }
    );
  }

  // Remove a record that match given query
  // @query: id or key value (i.e { name: 'Jonas' }) that match the object that will be remove
  // @save: save/persist data, defaut is true
  remove(ids: Array<string | Object> | Object | string): ResultInterface {

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    if (typeof ids[0] === "object") {
      let strIds = new Array(ids.length);
      ids.forEach((obj, i) => {
        strIds[i] = obj.id
      });
      ids = strIds;
    }
    console.log(ids);
    return createResultInterface(
      () => VasernManager.DeleteRecords(this.name, ids),
      { 
        asArray: true, 
        callbackEvent: (changes) => {
          this.eventManager.fire("remove", { ids, ...changes });
        }
      }
    );
  }

  // Create a new content record which return an object with generated UUID
  // Input will be validated using given schema of when initiate Doc
  // @input: a valid record
  insert(records: Array<Object> | Object) {
  
    if (!Array.isArray(records)) {
      records = [records];
    }

    records.forEach(record => {

      if (!record.id) {
        record.id = this.oid.createID();
      }

      for (let ref in this.refProps) {
        // Replace reference object with its id 
        // if a reference property is passed in using an object
        if (record[ref.representProp]) {
          record[ref.actualProp] = record[ref.representProp];
          delete record[ref.representProp];
        }
      }

      // TODO: validate keys
    })

    return createResultInterface(
      () => VasernManager.InsertRecords(this.name, records),
      { 
        asArray: true, 
        callbackEvent: (changes) => {
          this.eventManager.fire("insert", changes);
        }
      }
    );
  }

  update(formatedRecords) : ResultInterface {

    return createResultInterface(
      () => VasernManager.UpdateRecords(this.name, formatedRecords),
      { 
        asArray: true, 
        callbackEvent: (changes) => {
          this.eventManager.fire("update", changes);
        }
      }
    );
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
        const success = await VasernManager.InsertRecords(
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

  async removeAllRecords() {
    return VasernManager.ClearDocument(this.name);
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
    if (type in this._commitedItems) {
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
        this.eventManager.fire(k, this._commitedItems[k]);
        this._commitedItems[k] = [];
      }
    });
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
