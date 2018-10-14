//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


import _ from "lodash";

var RBreak = /,\u00A0/, LBreak = ";";


// This parse is used to converting a string to data objects
// and converting data objects back to a string
var Parser = {

    // Parse unformated data value to js value, with its original type (string/int)
    // @schema: Vase schema object
    // @val: raw value
    parseValue: (type, val) => {
        let dataType;

        if (type.indexOf("[]") != -1) {
            dataType = "list";
            type = type.replace("[]", "");
        } else if (type.indexOf('#') != -1) {
            dataType = 'ref';
            type = type.replace("#", "");
        }

        switch (dataType) {
            case 'string':
                val = val && val.replace ? val.replace(/\u00A0n/g, '\n') : "";
                return val;
            case 'int':
                return parseInt(val);
            case 'double':
                return parseFloat(val);
            case 'boolean':
                return !!val;
            case 'datetime':
                return new Date(parseInt(val));
            case 'ref':
                return val;
            case 'list':
                let splited = val.split(LBreak);
                let results = new Array(splited.length);
                splited.forEach((value, i) => {
                    results[i] = Parser.parseValue(type, value);
                });
                return results;
        }

        // Left over 'ref' type
        return val;
    },

    // Parse string to object, using a schema
    // @input: unformated data separated by line, with schema in the first line
    parse: (lines, schema) => {
        var i = 0, rCount = 0
        ,   obj = {}
        ,   data = new Array(lines.length)
        ,   ids = new Array(lines.length) // use for checking data position
        ,   prop, splitedData;


        // Parse schema on the first line
        // var schema = Parser.schemify(lines.shift());

        // Parse records
        var propKeys = Object.keys(schema);
        var tempItemIndex;
        
        lines.forEach(line => {
            // line = line.replace(/\n/g, '')
            
            if (line) {
                i = 0;
                splitedData = line.split(/,\u00A0/);
                obj = {
                    id: splitedData.shift()
                };

                // Parse record, add to data according to its status (new, updated, removed)

                // Assume record always start with an ID
                tempItemIndex = ids.indexOf(obj.id);

                
                if (splitedData.length == 0) {
                    
                    // Record has been removed
                    data.splice(tempItemIndex, 1);

                } else {

                    splitedData.forEach(data => {
                        prop = propKeys[i];

                        if (data && prop) {
                            obj[prop] = Parser.parseValue(schema[prop], data);
                        }
                        i++;
                    })
                    
                    if (tempItemIndex && tempItemIndex != -1) {

                        // Record existed and has been updated
                        data[tempItemIndex] = obj;
                    } else {

                        // Record has not existed yet
                        data[rCount] = obj;
                        ids[rCount] = object.id;
                        ++rCount;
                    }
                        
                }
            }
        });
        
        // Remove empty array items
        data.splice(rCount, lines.length - rCoutn);

        return {
            data
        };
    },

    // Convert a raw string data to an object
    // @props<Array[string]>: array of object (props need to have the same order of raw data)
    // @raw<string>: raw data as a string
    strToObject: (schema, rawObject) => {

        if (schema && rawObject && rawObject.raw) {

            var obj = { id: rawObject.id };
            var props = Object.keys(schema);
            
            rawObject.raw.split(RBreak).forEach((data, i) => {
                prop = props[i];

                if (data && prop) {
                    if (schema[prop].indexOf("#") > -1 ) {
                        obj[prop + "_id"] = Parser.parseValue(schema[prop], data);
                    } else {
                        obj[prop] = Parser.parseValue(schema[prop], data);
                    }
                }
                i++;
            })

            return obj;
        }
        
        return null;
    },

    // Convert a string of schema into a schema object
    // @line: input of schema under string format
    schemify: (line) => {

        // escape comma "," character
        var fields = line.split(',\u00A0');
        var name = fields.shift();
        var props = {};
        fields.forEach(field => {
            var split = field.split(':');
            props[split[0]] = split[1];
        });

        // TODO: make sure fields and data not mess up when parsing

        return { name, props };
    },

    // Convert object into schema and unformated data
    // @input: A Doc object
    // @opts: Converting settings
    stringify: ({ schema , data }) => {

        let result = schema.name.replace(/\s+/g, '');
        let propKeys = Object.keys(schema.props);

        // Convert data name + schema to string
        propKeys.forEach(s => { result += `,\u00A0` + s + ":" + schema.props[s]; });

        data.forEach(content => {
            result += '\n' + Parser.objToStr(schema, content)
        })
        
        return result;
    },

    convertToSave: ({ schema , data }) => {
        let ouput = [];
        let schemaLine = schema.name.replace(/\s+/g, '');
        let propKeys = Object.keys(schema.props);

        // Convert data name + schema to string
        propKeys.forEach(s => { schemaLine += `,\u00A0` + s + ":" + schema.props[s]; });

        ouput.push(schemaLine);


        data.forEach(content => {
            ouput.push(Parser.objToStr(schema, content))
        })
        return ouput;
    },

    convertToLog: (schema, { insert, update, remove }) => {

        // TODO: check if schema structure need to be inserted
        let output = [];

        insert.forEach(item => {
            output.push(Parser.objToStr(schema, item))
        })

        update.forEach(item => {
            output.push(Parser.objToStr(schema, item))
        })

        remove.forEach(item => {
            output.push(item.id)
        })

        return output;
    },

    // Convert data objects into string, separated by line break (\n)
    // @schema: Vase schema (style object)
    // @obj: formated objects data
    objToStr: (props, obj) => {

        // remove id if exsits
        // delete obj.id;

        var result = obj.id, dataType, value
        , keys = Object.keys(props)
        , listType;

        keys.forEach(k => {

            result += ',\u00A0';
            
            value = obj[k];
            if (value == 0 || (value && value != "undefined")) {
                value = Parser.valueTypeToStr(props[k], value);
            } else { value = "" };

            result += value;
        })
        return result; // .replace(',\u00A0','')
    },

    valueTypeToStr: (dataType, value) => {
        
        var type = dataType;
        if (dataType.indexOf('#') != -1) {
            type = "ref"
        }

        if (dataType.indexOf("[]") != -1) {
            type = "list";
        }
        
        switch (type) {
            case 'string':
                value = String(value).replace(/\n/g, '\u00A0n');
                break;
            case 'datetime':
                value = value.getTime ? value.getTime() : value;
                break;
            case 'boolean':
            value = (typeof(value) == "string") ? !!(value == "true") : !!value;
                break;
            case 'ref':
            value = typeof(value) == "object" ? value.id : value;
                break;
            case 'list':

                if (Array.isArray(value) && value.length) {
                    let listType = dataType.replace("[]", "");
                    let result = "";
                    value.forEach((v, i) => {
                        result += Parser.valueTypeToStr(listType, v);
                        if (i != value.length - 1) {
                            result += LBreak;
                        }
                    });
                    value = result;
                }
                break;
        }
        return value;
    }
}

export {
    Parser
}