/* ================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================== */

import { NativeModules } from 'react-native';
import { Queryable, EventSubscriber } from "..";
import Collection from "./Collection";
// import { AuthModel } from "../../plugins/auth";

// @flow

const VasernManager : {
  Startup: Function
} = NativeModules.VasernManager;


export default class Vasern {
  // Collections
  collections: {
    [key: string]: Collection
  } = {};

  // Vasern load status
  loaded = false;

  // Number of ready Collections
  readyCollections = 0;

  // Manage event subscriber
  eventManager = new EventSubscriber();

  // Vasern's constructor will initiate all Collection
  // then call "Collection.load" function to fetch data from the native side.
  // Each Collection created will be pushed into "Vasern.collections", also assigned as
  // a property of Vasern under its "Collection.name"
  constructor({ schemas }) {

    let DbSchema = {};
    schemas.forEach(schema => {
      const collection = new Collection(schema);

      this.collections[collection.name] = collection;

      Object.defineProperty(this.collections, collection.name, {
        value: collection,
        writeable: false
      });
      
      // When each Collection is loaded and readyCollections
      // Run a check to see if all other Collections are ready
      // Then update ready status for Vasern
      DbSchema[collection.name] = collection.getNativeSchema();

      collection.onLoaded(() => {
        this.readyCollections += 1;
        if (this.readyCollections === schemas.length) {
          this.loaded = true;
          this.eventManager.fire("loaded");
        }
      });
    });
    
    // debugger;
    // TODO: send DBSchema to native side and check
    VasernManager.Startup(DbSchema);
  }

  collect( name: string ) : Collection {
    return this.collections[name];
  }

  // Subscribe a callback to "ready" event
  // Callbacks will be called when all Collections completely loaded data
  onLoaded(callback) {
    if (this.loaded) {
      callback();
    } else {
      this.eventManager.subscribe("loaded", { callback });
    }
  }

  // Get Collection by its name
  get(docName) {
    return this.collections.find(d => d.name === docName);
  }

  // Get object's references
  // @props<object>: Collection schema or "Collection.props"
  // @record<object>: a data record that contains reference object ids
  refs(props: Object, record: Object) {
    let type : string;
    let ref;
    const refRecord = record;

    Object.keys(props).forEach(key => {
      type = props[key];
      // Check exsisting references, find them and assign to the reference properties
      if (type && type.indexOf("#") === 0 && record[`${key}_id`]) {
        // Trimp optional property sigh
        if (type.indexOf("?") > -1) {
          type = type.replace("?", "");
        }

        // Get doc, then get object match with reference id
        // then replace current value (id) with actual object
        ref = this[type.replace("#", "")];
        if (ref) {
          refRecord[key] = ref.get(record[`${key}_id`]);
        }
      }
    });
    return refRecord;
  }

  // List will return all Collection records included records' references
  // @docName<string>: name of Collection
  // Return a Queryable object
  list(docName, filter) {
    const contents = filter ? this[docName].filter(filter) : this[docName];
    const results = new Queryable();
    const convertedContents = contents
      .data()
      .map(content => this.refs(this[docName].props, content));

    Object.defineProperty(results, "_data", {
      value: convertedContents,
      writable: false,
    });

    return results;
  }

  /* =============================//
  //=====   STATIC METHODS   =====//
  //============================= */

  /**
   * Import a plugin class into Collection
   * Plugin requires a static "methods" property
   * which contains an array of function name that will be assign into Collection prototype
   * @param {class function or object} plugin
   */
  static import(plugin: Function) {
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
