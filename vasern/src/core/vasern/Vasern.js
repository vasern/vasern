/* ================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================== */

import { NativeModules } from 'react-native';
import { EventSubscriber } from "..";
import Collection from "./Collection";

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
  constructor({ models }) {

    let nativeModels = {};

    for (let model of models) {

      let collection: Collection = new Collection(model);

      Object.defineProperty(this.collections, collection.name, {
        value: collection,
        writeable: false
      });

      nativeModels[collection.name] = collection.props;
    }
    
    VasernManager.Startup(nativeModels);
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
