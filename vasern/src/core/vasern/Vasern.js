/* ================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================== */

// import { NativeModules } from 'react-native';
import { Queryable, EventSubscriber } from "..";
import Document from "./Document";
// import { AuthModel } from "../../plugins/auth";

// const VasernManager = NativeModules.VasernManager;

export default class Vasern {
  // Documents
  docs = [];

  // Vasern load status
  loaded = false;

  // Number of ready Documents
  readyDocs = 0;

  // Manage event subscriber
  eventManager = new EventSubscriber();

  // Vasern's constructor will initiate all Document
  // then call "Document.load" function to fetch data from the native side.
  // Each Document created will be pushed into "Vasern.docs", also assigned as
  // a property of Vasern under its "Document.name"
  constructor({ schemas }) {
    schemas.forEach(schema => {
      const docObject = new Document(schema);

      docObject.load();
      this.docs.push(docObject);

      Object.defineProperty(this, docObject.name, {
        value: docObject,
        writable: false,
      });

      // When each Document is loaded and readyDocs
      // Run a check to see if all other Documents are ready
      // Then update ready status for Vasern
      docObject.onLoaded(() => {
        this.readyDocs += 1;
        if (this.readyDocs === schemas.length) {
          this.loaded = true;
          this.eventManager.fire("loaded");
        }
      });
    });
  }

  // Subscribe a callback to "ready" event
  // Callbacks will be called when all Documents completely loaded data
  onLoaded(callback) {
    if (this.loaded) {
      callback();
    } else {
      this.eventManager.subscribe("loaded", { callback });
    }
  }

  // Get Document by its name
  get(docName) {
    return this.docs.find(d => d.name === docName);
  }

  // Get object's references
  // @props<object>: Document schema or "Document.props"
  // @record<object>: a data record that contains reference object ids
  refs(props, record) {
    let type;
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

  // List will return all Document records included records' references
  // @docName<string>: name of Document
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
   * Import a plugin class into Document
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
}
