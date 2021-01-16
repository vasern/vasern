/* ==============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================== */

const RBreak = /,\u00A0/;
const LBreak = ";";

// This parse is used to converting a string to data objects
// and converting data objects back to a string
const Parser = {
  // Parse unformated data value to js value, with its original type (string/int)
  // @schema: Vase schema object
  // @value: raw value
  parseValue: (inputType, value) => {
    let dataType;
    let isOptional = false;
    let type = inputType;

    if (type[0] === '?') {
      isOptional = true;
      type = type.substr(1);
    }
    
    if (isOptional && typeof value === `undefined`) {
      return undefined;
    }
	
    if (type.indexOf("[]") === 0) {
      dataType = "list";
      type = type.replace("[]", "");
    } else if (type.indexOf("#") === 0) {
      dataType = "ref";
      type = type.replace("#", "");
    } else {
      dataType = type;
    }
    
    switch (dataType) {
      case "string":
        return String(value).replace(/\u00A0n/g, "\n");
      case "int":
        return parseInt(value, 10);
      case "double":
        return parseFloat(value);
      case "boolean":
        return value === "1";
      case "datetime":
        return new Date(parseInt(value, 10));
      case "ref":
        if (typeof value === "object" && "id" in value) {
          return value.id;
        }
        return value;
      case "list":
        return value.split(LBreak).map(value => Parser.parseValue(type, value));
      default:
        return value;
    }
  },

  // Parse string to object, using a schema
  // @input: unformated data separated by line, with schema in the first line
  parse: (lines, schema) => {
    let i = 0;
    let rCount = 0;
    let obj = {};
    const data = new Array(lines.length);
    const ids = new Array(lines.length); // use for checking data position
    let prop;
    let splittedData;

    // Parse schema on the first line
    // var schema = Parser.schemify(lines.shift());

    // Parse records
    const propKeys = Object.keys(schema);
    let tempItemIndex;

    lines.forEach(line => {
      if (line) {
        i = 0;
        splittedData = line.split(/,\u00A0/);
        obj = {
          id: splittedData.shift(),
        };

        // Parse record, add to data according to its status (new, updated, removed)
        // Assume record always start with an ID
        tempItemIndex = ids.indexOf(obj.id);

        if (splittedData.length === 0) {
          // Record has been removed
          data.splice(tempItemIndex, 1);
        } else {
          splittedData.forEach(splittedItem => {
            prop = propKeys[i];

            if (splittedItem && prop) {
              obj[prop] = Parser.parseValue(schema[prop], splittedItem);
            }
            i += 1;
          });

          if (tempItemIndex && tempItemIndex !== -1) {
            // Record existed and has been updated
            data[tempItemIndex] = obj;
          } else {
            // Record has not existed yet
            data[rCount] = obj;
            ids[rCount] = obj.id;
            rCount += 1;
          }
        }
      }
    });

    // Remove empty array items
    data.splice(rCount, lines.length - rCount);

    return {
      data,
    };
  },

  // Convert a raw string data to an object
  // @props<Array[string]>: array of object (props need to have the same order of raw data)
  // @raw<string>: raw data as a string
  strToObject: (schema, rawObject) => {
    if (schema && rawObject && rawObject.raw) {
      const obj = { id: rawObject.id };
      const props = Object.keys(schema);
      let prop;

      rawObject.raw.split(RBreak).forEach((data, i) => {
        prop = props[i];

        if (schema[prop].indexOf("#") > -1) {
          // Parsing reference object
          obj[`${prop}_id`] = Parser.parseValue(schema[prop], data);
        } else {
          // Parsing numbers,string,list,boolean
          obj[prop] = Parser.parseValue(schema[prop], data);
        }
      });

      return obj;
    }

    return null;
  },

  // Convert a string of schema into a schema object
  // @line: input of schema under string format
  schemify: line => {
    // escape comma "," character
    const fields = line.split(",\u00A0");
    const name = fields.shift();
    const props = {};
    let splittedFields;

    fields.forEach(field => {
      splittedFields = field.split(":");
      props[splittedFields[0]] = splittedFields[1];
    });

    // TODO: make sure fields and data not mess up when parsing

    return { name, props };
  },

  // Convert object into schema and unformated data
  // @input: A Doc object
  // @opts: Converting settings
  stringify: ({ schema, data }) => {
    let result = schema.name.replace(/\s+/g, "");
    const propKeys = Object.keys(schema.props);

    // Convert data name + schema to string
    propKeys.forEach(s => {
      result += `,\u00A0${s}:${schema.props[s]}`;
    });

    data.forEach(content => {
      result += `\n${Parser.objToStr(schema, content)}`;
    });

    return result;
  },

  convertToSave: ({ schema, data }) => {
    const ouput = [];
    let schemaLine = schema.name.replace(/\s+/g, "");
    const propKeys = Object.keys(schema.props);

    // Convert data name + schema to string
    propKeys.forEach(s => {
      schemaLine += `,\u00A0${s}:${schema.props[s]}`;
    });

    ouput.push(schemaLine);
    data.forEach(content => {
      ouput.push(Parser.objToStr(schema, content));
    });
    return ouput;
  },

  convertToLog: (schema, { insert, update, remove }) => {
    // TODO: check if schema structure need to be inserted
    const output = [];

    insert.forEach(item => {
      output.push(Parser.objToStr(schema, item));
    });

    update.forEach(item => {
      output.push(Parser.objToStr(schema, item));
    });

    remove.forEach(item => {
      output.push(item.id);
    });

    return output;
  },

  // Convert data objects into string, separated by line break (\n)
  // @schema: Vase schema (style object)
  // @obj: formated objects data
  objToStr: (props, obj) => {
    // remove id if exsits
    // delete obj.id;

    const keys = Object.keys(props);
    let value;
    let result = obj.id;

    keys.forEach(k => {
      result += ",\u00A0";

      //changed next line here
      value = obj[k + "_id"] ? obj[k + "_id"] : obj[k];

      if (value === 0 || (value && value !== "undefined")) {
        value = Parser.valueTypeToStr(props[k], value);
      } else {
        value = "";
      }

      result += value;
    });
    return result; // .replace(',\u00A0','')
  },

  valueTypeToStr: (dataType, value) => {
    let isOptional = false;

    if (dataType.indexOf(`?`) === 0) {

      if (typeof value === `undefined`) {
        return `undefined`;
      }
      isOptional = true;
      dataType = dataType.substr(1);
    }
    // handle non-optional value
    else if (value === undefined) {
      throw Error(`Missing value`);
    }

    let type = dataType;

    if (dataType.indexOf(`#`) === 0) {
      type = "ref";
    } else if (dataType.indexOf(`[]`) === 0) {
      type = "list";
    }


    switch (type) {
      case "string":
        return String(value).replace(/\n/g, "\u00A0n");
      case "int":
        return parseInt(value, 10);
      case "double":
        return parseFloat(value); 
      case "datetime":
        return value.getTime ? value.getTime() : value;
      case "boolean":
        return value ? 1 : 0;
      case "ref":
        return typeof value === "object" ? value.id : value;
      case "list":
        if (Array.isArray(value)) {
          const listType = dataType.replace("[]", "");
          return value
            .map(v => Parser.valueTypeToStr(listType, v))
            .join(LBreak);
        }
        return value;
      default:
        return value;
    }
  },
};

export default Parser;
