//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

// import { NativeModules } from 'react-native';
import { Queryable, EventSubscriber } from '..';
// import { AuthModel } from "../../plugins/auth";

// const VasernManager = NativeModules.VasernManager;

export class Vasern {

    docs = [];
    loaded = false;
    readyDocs = 0;
    eventManager = new EventSubscriber();

    // Vasern's constructor will initiate all Document
    // then call "Document.load" function to fetch data from the native side.
    // Each Document created will be pushed into "Vasern.docs", also assigned as
    // a property of Vasern under its "Document.name"
    constructor({ schemas }) {

        // TODO: constructor with vasern server
        // host, authEnabled, authModel = AuthModel 
        // if (authEnabled) {
        //     schemas.unshift(authModel);
        // }

        // if (host) {
        //     VasernManager.RequestUID().then(({ data }) => {
        //         console.log(data);
        //     })
        // }

        schemas.forEach(schema => {

            // initiate document using schema extended from Document 
            // or schema object
            var docObject = 
                typeof(schema) == "function" ? 
                new schema() :
                new Document(schema);

            docObject.load();
            this.docs.push(docObject)

            Object.defineProperty(this, docObject.name, {
                value: docObject,
                writable: false
            })

            docObject.onLoaded(() => {
                this.readyDocs++;
                if (this.readyDocs == schemas.length) { 
                    this.loaded = true;
                    this.eventManager.fire("loaded");
                }
                
            })
        })
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
        return this.docs.find(d => d.name == docName);
    }

    // Get object's references
    // @props<object>: Document schema or "Document.props"
    // @record<object>: a data record that contains reference object ids
    refs(props, record) {
        
        var type;

        Object.keys(props).forEach(key => {

            // Check exsisting references, find them and assign to the reference properties
            if ((type = props[key]) && type.indexOf('#') == 0 && record[key + "_id"]) {

                // Trimp optional property sigh
                if (type.indexOf('?') > -1) { type = type.replace('?', '')}

                if (( ref = this[type.replace("#", "")] )) {

                    // Get doc, then get object match with reference id 
                    // then replace current value (id) with actual object
                    record[key] = ref.get(record[key+"_id"]);

                }
            }
        }); 
        return record;
    }

    // List will return all Document records included records' references
    // @docName<string>: name of Document
    // Return a Queryable object
    list(docName, filter) { 
        
        var contents = filter ? this[docName].filter(filter) : this[docName];

        let results = new Queryable()
        , convertedContents = contents.data().map(content => {
            return this.refs(this[docName].props, content);
        })
        
        Object.defineProperty(results, '_data', {
            value: convertedContents,
            writable: false
        })

        return results;
    }


    //==============================//
    //=====   STATIC METHODS   =====//
    //==============================//
   
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
          })
        } else {
          console.warn(`Unable to import "${plugin.name}". "${plugin.name}.methods" does not exist`)
        }
    }
}