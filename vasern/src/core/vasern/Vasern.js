/* ================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================== */

import { NativeModules } from 'react-native';
import Collection from "./Collection";
import ResultInterface from './utils/ResultInterface';

// @flow
type NativeModuleFunctions = {
  Startup: Function,
  InsertRecords: Function,
  DeleteRecords: Function,
  UpdateRecords: Function,
  RemoveAllCollections: Function,
  RemoveAllRecords: Function,
  GetRecordsByQuery: Function,
  CountRecordsByQuery: Function,
  AllRecords: Function
}

type CollectionList = {
  [key: string]: Collection
}

type Schema = Array<{
  name: string, 
  props: Object, 
  validation: 'none' | 'easy' | 'strict'
}>;

const VasernManager : NativeModuleFunctions = NativeModules.VasernManager;

export default class Vasern {

  // Collections
  collections: CollectionList = {};

  constructor(opts: { schema: Schema }) {

    let nativeModels = {};

    opts.schema.forEach(model => {

      let collection = new Collection(model);

      Object.defineProperty(this.collections, collection.name, {
        value: collection,
        writeable: false
      });

      nativeModels[collection.name] = collection.props;
    })
    
    
    VasernManager.Startup(nativeModels)
    .then(rs => {
      Object.keys(nativeModels).forEach(key => {
        this.collections[key].triggerCollectionStarted();
      })
    });
  }

  collect( name: string ) : Collection {
    return this.collections[name];
  }

  /**
   * Remove all records of all collections
   * Note: schemas will not being cleared
   */
  clearAllCollections() {
    return ResultInterface(VasernManager.ClearAllCollections());
  }

  /* =============================//
  //=====   STATIC METHODS   =====//
  //============================= */

  /**
   * Import a plugin class into Collection
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
