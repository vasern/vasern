//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================

// @flow 

import { NativeModules } from 'react-native';
import { Parser, EventSubscriber, Queryable } from '..';
import { Reporter } from '../vasern-utils';
import ConfigProps from '../../config';
import _ from 'lodash';

import ObjectID, { OBJECTID_LEN } from '../../plugins/vasern-objectid';

// import { ServerRequest } from "../../plugins/server-sync";

const VasernManager = NativeModules.VasernManager;

export class Document {

    _data = []; // data objects
    props = {};
    oid;

    // Flag data is available
    available = false;

    // Flag data has completely converted to objects
    loaded = false;

    constructor(args) {
        let { 
            storeOptions, 
            version, 
            props,
            name
            // host,
            // ePath,
        } = Object.assign(ConfigProps, args);

        // Document properties

        this.eventManager = new EventSubscriber();
        this.storeOptions = storeOptions;
        this.version = version;

        // Add name and props when
        // initiate document using schema object
        if (name) { this.name = name; }
        if (props) { this.props = props; }

        // this.request = new ServerRequest(host, ePath);
        this.oid = new ObjectID();

        this.bindEvents.bind(this)();
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
    }

    object(input) {

        let object = typeof(input) == "number" 
            ? this._data[input] 
            : this.get(input);
        
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
            let records = new Array(data.length)
            , ids = new Array(data.length)
            , objCount = 0, aIndex = -1
            , key, value;
            
            data.forEach(raw => {

                if (raw.length) {
                    key = raw.substr(0, OBJECTID_LEN);
                    value = raw.substr(OBJECTID_LEN + 2);

                    if (( aIndex = ids.indexOf(key)) != -1) { 
                        records[aIndex].raw = value;
                    } else {
                        records[objCount] = {
                            id: key,
                            raw: value
                        }
                        ids[objCount] = key;
                        objCount++;
                    }
                }
            });
            
            // Clean up duplicate
            records.splice(objCount);

            // Remove deleted record;
            this._data = records.filter(item => item.raw.length);

            setTimeout(() => {
                this.formatData()
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
        this._data.forEach((d, i) => {
            if (( obj = Parser.strToObject(this.props, d) )) {
                this._data[i] = obj;
            }
        })
        
        this.loaded = true;
        this.eventManager.fire("loaded");
    }

    // Remove a record that match given query
    // @query: id or key value (i.e { name: 'Jonas' }) that match the object that will be remove
    // @save: save/persist data, defaut is true
    remove(query, save = true) {

        if ((found = this.get(query))) {
            this._commitChange("remove", found, save);
            return true;
        };

        // Not found record to be deleted 
        return false;
    }

    // Create a new content record which return an object with generated UUID
    // Input will be validated using given schema of when initiate Doc
    // @input: a valid record
    insert(inputs, save = true) {
        
        if (!inputs) { return false };
        if (!Array.isArray(inputs)) {
            inputs = [inputs];
        }

        var validObjects = inputs.map(input => {
            let propKeys = Object.keys(input);

            if (!this.validateProps(propKeys)) {
                Reporter.warn("Invalid input for "+ this.name +". Record will not be added into database");
                Reporter.warn(propKeys, Object.keys(this.props))
                return null;
            }
            debugger;
            var content = this.oid.new();

            propKeys.forEach(k => {
                // content[k] = Parser.parseValue(this.props[k], input[k]);
                content[k] = input[k];
            });
            
            this._commitChange("insert", content, save);

            // Avoid id being washed using save
            // content.id = uuid;

            return content;
        })

        // Invalid data type or content not match with schema
        return validObjects;
    }

    update(lookupQuery, newValues, save = true) {

        var found = this.get(lookupQuery);
        if (found) {

            let { id, ...rest } = newValues;

            Object.assign(found, { ...rest });

            this._commitChange("update", found, save);

            return found;
        } 

        return false;
    }

    // Update, write or remove item all together
    perform(callback) {

        callback({
            remove: (query) => {
                return this.remove(query, false);
            },
            insert: (input) => {
                return this.insert(input, false);
            },
            update: (query, newValues) => {
                return this.update(query, newValues, false);
            },
            get: (query) => {
                return this.get(query);
            }
        });
        this.save();
    }

    // Create a prototype content record (not saved into ) which return an object with generated UUID
    // Input will be validated using given schema of when initiate Doc
    // @input: a valid record
    createPrototype(input) {

        let propKeys = Object.keys(input);

        if (!this.validateProps(propKeys)) {
            Reporter.warn("Invalid input for "+ this.name +". Record will not be added into database");
            return null;
        }
        var uuid = this.createUUID();
        var content = {};

        propKeys.forEach(k => {
            content[k] = Parser.parseValue(this.props[k], input[k]);
        });

        // Avoid id being washed using save
        content.id = uuid;

        return content;
    }

    // Loading data from the backend-side
    // then populate 
    async load() {

        var rawData;
        
        try {
            rawData = await VasernManager.Request(this.docName()) //, this.storeOptions);
        } catch (e) {  console.log(e) };
        
        this.populate(rawData)
        
    }

    // Send current data to backend to save/persist
    async save() {
        let logRecords = Parser.convertToLog(this.props, this._commitedItems)
        
        try {
            let success = await VasernManager.Insert(this.docName(), logRecords, this.storeOptions);

            if (success) {
                // Trigger subscribed events
                this._executeCommitedEvents();
            }

        } catch(e) {
            console.log(e)
        }
        // TODO: handle returned results
    }

    async createSnapshot() {
        let logRecords = [];
        this._data.forEach(i => {
            logRecords.push(Parser.objToStr(this.props, i));
        })
        
        try {
            let success = await VasernManager.Insert(this.docName(), logRecords, ["enable_clean_mode"]);

        } catch(e) {
            console.log(e)
        }
    }

    // Return a legit document name
    docName() {
        return this.name + '_' + this.version;
    }

    // Execute callback while ensuring data is loaded completely. If data is loaded, execute it. 
    // Else push into subscribers list to execute when data is loaded (see 'populate' function)
    // @callback: a callback function, given reference of this Doc object
    // Example usage: doc.loaded(doc => { Reporter.err(doc.toArray()) })
    onLoaded(callback) {
        
        if (this.loaded) {
            callback(this);
        } else {
            this.eventManager
                .subscribe("loaded", { callback });
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
            this.eventManager
                .subscribe("available", { callback });
        }
    }


    //======================//
    //====   TRIGGERS   ====//
    //======================//

    on(eventType, callback) {
        this.eventManager.subscribe(eventType, { callback });
    }

    onInsert(callback) {
        this.eventManager.subscribe("insert", { callback });
    }

    onRemove(callback)  {
        this.eventManager.subscribe("remove", { callback });
    }

    onUpdate(callback) {
        this.eventManager.subscribe("update", { callback });
    }

    onChange(callback) {
        
        this.eventManager.onChange({ callback });
    }

    //=====================//
    //=====   UTILS   =====//
    //=====================//

    // Return the length of children data
    length() { 
        return this._data.length;
    }

    // Comparing given keys with schema props
    // Return boolean value
    // @key: Array of object key of new record
    validateProps = (keys) => {

        var schemaProps = Object.assign([], Object.keys(this.props));
        var objectProps = Object.assign([], keys);
        var result = true, correctProps = 0;
        schemaProps.forEach(k => {

            // Optional props
            if (this.props[k].indexOf("?") > -1) {
                correctProps++;
            } else 
            // Non optional keys
            {  
    
                if (objectProps.indexOf(k) == -1 && k != 'id') {
                    // prop not exists
                    result = false;
                } else {
                    correctProps++;
                }

            }
        });

        if (correctProps != schemaProps.length) {
            Reporter.warn("Doc.validateProps: Input has more props than schema. Non-exists props will be removed");
            Reporter.warn(schemaProps, objectProps);
        }
        
        return result;
    }

    //=======================//
    //=====   COMMITS   =====//
    //=======================//
    // These function and variables should not be used directly

    _commitedItems = {
        "insert": [],
        "update": [],
        "remove": []
    };

    _commitChange = (type, item, save = false) => {
        
        // Check if commit status is available
        if (this._commitedItems[type]) {

            this._commitedItems[type].push(item);

            if (save) {
                this.save();
            }
        } else {

            console.warn("Unable to commit change of type: ", type, "\n", item);
        }
    }

    // Trigger events for each of commited records
    // then clear commitedItems
    _executeCommitedEvents = () => {
        
        Object.keys(this._commitedItems).forEach(k => {

            if (this._commitedItems[k].length) {

                // TODO: merge changed records to data
                this._mergeRecords(k, this._commitedItems[k]);

                this.eventManager.fire(
                    k, this._commitedItems[k]
                );

                this._commitedItems[k] = []
            }
        })
    }

    // Merging commited records to the main record list
    // after data processes (insert/update/remove) are completed
    // TODO: Make sure records passed through is valid
    _mergeRecords = (event, records) => {
        switch(event) {
            case "update":
                let index;
                records.forEach(r => {
                    index = _.findIndex(this._data, { id: r.id });

                    if (index != -1) { this._data[index] = r; }
                    else console.log(r);
                })
                break;
            case "insert":
            
                this._data = this._data.concat(records);
                break;

            case "remove":
                records.forEach(record => {
                    _.remove(this._data, { id: record.id })
                })
                break;
        }
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