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
import Validator from '../vasern-validator';

import ResultInterface from './utils/ResultInterface';

const { VasernManager } = NativeModules;

// @flow

import type ResultInterfaceType from './utils/ResultInterface';

type ValidationOption = 'none' | 'easy' | 'strict';
// type ResultInterface = {
//   asProxy: Object,
//   asPromise: Promise,
//   run: void
// }

type NativePropType = {|
  type: "string" | "number" | "boolean" | "ref",
  size: number,
  relate ?: string,
  primary ?: boolean,
  indexed ?: boolean
|};

type NativePropTypeList = { [key: string]: NativePropType };
type CollectionProps = {|
  name: 'string',
  props: NativePropTypeList,
  validation?: ValidationOption
|};
 
export default class Collection {

  name: string;
  props: NativePropTypeList;
  validation: ValidationOption = 'none';

  objectID: ObjectID;
  eventManager: EventSubscriber;
  refProps: Array<string>; // List of property with ref type

  constructor(options: CollectionProps | Function) {

    if (typeof options === "function") {
      // Initiate collection with user defined class
      this.inject(options);
    } else {
      Object.assign(this, options);
    }
    this.eventManager = new EventSubscriber();
    this.setup.bind(this)();
  }

  setup() {
    
    this._setupObjectID.bind(this)();
    this._structureProps.bind(this)();
    this._bindEvents.bind(this)();
    this._setupValidator.bind(this)();
  }

  triggerCollectionStarted() {
    this.eventManager.fire("started");
  }

  /**
   * Enable ObjectID if user did not provide a id
   */
  /*:: _setupObjectID: () => void; */
  _setupObjectID() {
    if (this.props.id) {
      this.formatObjects = this._formatObjects.bind(this);
    } else {
      this.objectID = new ObjectID();
      this.formatObjects = this._formatObjectsWithObjectID.bind(this);
    }
  }

  /**
   * Restructure property schema and create refProps
   */
  /*:: _structureProps: () => void; */
  _structureProps() {
    let refProps = [];
    Object.keys(this.props).forEach(key => {
      if (this.props[key].relate) {
        this.props[`${key}_id`] = this.props[key];
        refProps.push({
          representProp: key,
          actualProp: `${key}_id`
        });
      }
    })

    this.refProps = refProps;
  }

  /**
   * Binding event listener functions
   */
  /*:: _bindEvents: () => void; */
  _bindEvents() {
    this.on = this.on.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onInsert = this.onInsert.bind(this);
    this.onUpdate = this.onInsert.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  /**
   * Check and enable validator for insertion
   * TODO: enable validate for update???
   */
  /*:: _setupValidator: () => void; */
  _setupValidator() {
    if (this.validation != 'none') {
      this.validator = new Validator({
        mode: this.validation,
        layout: this.props
      });
      this.insert = this._insertWithValidation.bind(this);
    } else {
      this.insert = this._insertWithoutValidation.bind(this);
    }
  }

  nFilter(query: Object) {
    return VasernManager.GetRecordsByQuery(this.name, query);
  }

  filter(query: Object): QueryBuilder {
    return new QueryBuilder(query, this);
  }

  count(query: Object): ResultInterfaceType {
    let nativeQuery = toNativeQuery(this.props, query);
    return ResultInterface(
      () => VasernManager.CountRecordsByQuery(this.name, nativeQuery),
      { eventEmitter: this.on }
    );
  }

  records(): ResultInterfaceType {
    return ResultInterface(
      () => VasernManager.AllRecords(this.name),
      { eventEmitter: this.on }
    );
  }

  // Remove a record that match given query
  // @query: id or key value (i.e { name: 'Jonas' }) that match the object that will be remove
  // @save: save/persist data, defaut is true
  remove(ids: Array<string | Object> | Object | string): ResultInterfaceType {

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
    
    return ResultInterface(
      () => VasernManager.DeleteRecords(this.name, ids),
      {
        callback: (changes) => {
          this.eventManager.fire("remove", { ids, ...changes });
        },
        preResult: {
          status: 'removing',
          items: ids,
          changes: {
            unchanged: ids.length
          }
        }
      }
    );
  };

  /*:: insert: (records: Array<Object> | Object) => ResultInterface; */
  _formatObjectsWithObjectID(records: Array<Object>): Array<Object> {

    records.forEach(record => {
      record.id = this.objectID.createID();
    })

    return this._formatObjects(records);
  }

  _formatObjects(records: Array<Object>): Array<Object> {

    records.forEach(record => {
      Object.keys(this.refProps).forEach(ref => {
        // Replace reference object with its id 
        // if a reference property is passed in using an object
        if (record[ref.representProp]) {
          record[ref.actualProp] = record[ref.representProp];
          delete record[ref.representProp];
        }
      })
    });

    return records;
  }

  _insertWithValidation(records: Array<Object> | Object) {
    if (!Array.isArray(records)) {
      records = [records];
    }

    // If any invalid record/property found (based on validation mode)
    // Throw an error and stop the program
    records.forEach(this.validator.validate);

    return this._insertWithoutValidation(records);
  }

  // Create a new content record which return an object with generated UUID
  // Input will be validated using given schema of when initiate Doc
  // @input: a valid record
  _insertWithoutValidation(records: Array<Object> | Object) {
  
    if (!Array.isArray(records)) {
      records = [records];
    }

    records = this.formatObjects(records);

    return ResultInterface(
      () => VasernManager.InsertRecords(this.name, records),
      {
        callback: (changes) => {
          this.eventManager.fire("insert", changes);
        },
        preResult: {
          status: 'inserting',
          items: records,
          changes: {
            unchange: records.length
          }
        }
      }
    );
  }

  update(formatedRecords: Array<Object> | Object) : ResultInterfaceType {

    return ResultInterface(
      () => VasernManager.UpdateRecords(this.name, formatedRecords),
      { 
        asArray: true, 
        callback: (changes) => {
          this.eventManager.fire("update", changes);
        },
        preResult: {
          status: 'updating',
          items: formatedRecords,
          changes: {
            unchange: formatedRecords.length
          }
        }
      }
    );
  }

  removeAllRecords() : ResultInterfaceType {
    return ResultInterface(
      VasernManager.RemoveAllRecords(this.name)
    );
  }

  /** ===========================//
  //====   Event Listeners   ====//
  /==============================*/
  
  /*:: on: (callback: Function) => void; */
  on(eventType: string, callback: Function, { immediateTrigger }) {
    let opts = { type: eventType, callback };
    if (immediateTrigger) {
      opts.immediateTrigger = true;
    }
    this.eventManager.subscribe(opts);
  }

  /*:: onInsert: (callback: Function) => void; */
  onInsert(callback: Function) {
    this.eventManager.subscribe({ type: "insert",  callback });
  }

  /*:: onRemove: (callback: Function) => void; */
  onRemove(callback: Function) {
    this.eventManager.subscribe({ type: "remove", callback });
  }

  /*:: onUpdate: (callback: Function) => void; */
  onUpdate(callback: Function) {
    this.eventManager.subscribe({ type: "update", callback });
  }

  /*:: onChange: (callback: Function) => void; */
  onChange(callback: Function) {
    this.eventManager.onChange({ callback });
  }

  /* ====================//
  //=====   Utils   =====//
  //==================== */

  /**
   * Merge properties and functions from a class to Collection object
   * Use to initate Collection with model class
   * @param {Object | Function} model
   */
  inject(Model: Object | Function) {
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

  /**
   * Import a plugin class into Collection class
   * Plugin requires a static "methods" property
   * which contains an array of function name that will be assign into Collection prototype
   * @param {Object | Function} plugin
   */
  static import(plugin: Object | Function) {
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
}