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
  // @val: raw value
  parseValue: (inputType, val) => {
    let dataType;
    let type = inputType;
    let results;
    let splitted;

    if (type.indexOf("[]") !== -1) {
      dataType = "list";
      type = type.replace("[]", "");
    } else if (type.indexOf("#") !== -1) {
      dataType = "ref";
      type = type.replace("#", "");
    } else {
      dataType = type;
    }

    switch (dataType) {
      case "string":
        return val && val.replace ? val.replace(/\u00A0n/g, "\n") : "";
      case "int":
        return parseInt(val, 10);
      case "double":
        return parseFloat(val);
      case "boolean":
        return val === "1";
      case "datetime":
        return new Date(parseInt(val, 10));
      case "ref":
        return val;
      case "list":
        splitted = val.split(LBreak);
        results = new Array(splitted.length);
        splitted.forEach((value, i) => {
          results[i] = Parser.parseValue(type, value);
        });
        return results;
      default:
        return val;
    }
  },

  parseToSave: (inputType: string, val: any) => {
    let dataType;
    let type = inputType;

    if (type.indexOf("#") !== -1) {
      dataType = "ref";
      type = type.replace("#", "");
    } else {
      dataType = type;
    }

    switch (dataType) {
      case "datetime":
        return val.getTime();

      case "ref":
        return val.id;

      default:
        return val;
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

        if (data && prop) {
          if (schema[prop].indexOf("#") > -1) {
            obj[`${prop}_id`] = Parser.parseValue(schema[prop], data);
          } else {
            obj[prop] = Parser.parseValue(schema[prop], data);
          }
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
    debugger;
    return output;
  },

  // Convert data objects into string, separated by line break (\n)
  // @schema: Vase schema (style object)
  // @obj: formated objects data
  objToStr: (props, obj) => {
    // remove id if exsits
    // delete obj.id;

    var rs = {
      id: obj.id,
      indexes: {},
      body: ""
    }
    
    Object.keys(props.indexes).forEach(( name: string ) => {
      rs.indexes[name] = Parser.parseToSave(props.indexes[name].type, obj[name]);
      // if (props.indexes[name].type == "datetime") {
      //   rs.indexes[name] = obj[name].getTime();
      // } else {
      //   rs.indexes[name] = obj[name];
      // }
    })

    // props.body.forEach(( name: string ) => {
    //   rs.body[name] = obj[name];
    // })

    // const keys = Object.keys(props);

    Object.keys(props.body).forEach(k => {
      
      if (k in obj) {
        rs.body += Parser.valueTypeToStr(props.body[k].type, obj[k]);
      } else {
        rs.body += "";
      }

      rs.body += ",\u00A0";
    });
    
    return rs; // .replace(',\u00A0','')
  },

  valueTypeToStr: (dataType: string, value) => {
    let type = dataType;
    if (dataType.indexOf("#") !== -1) {
      type = "ref";
    }

    if (dataType.indexOf("[]") !== -1) {
      type = "list";
    }

    let listType;
    let result;

    switch (type) {
      case "string":
        return value.replace(/\n/g, "\u00A0n");
      case "datetime":
        return value.getTime ? value.getTime() : value;
      case "boolean":
        return value ? 1 : 0;
      case "ref":
        return typeof value === "object" ? value.id : value;
      case "list":
        if (Array.isArray(value) && value.length) {
          listType = dataType.replace("[]", "");
          result = "";
          value.forEach((v, i) => {
            result += Parser.valueTypeToStr(listType, v);
            if (i !== value.length - 1) {
              result += LBreak;
            }
          });
          return result;
        }
        return value;
      default:
        return value;
    }
  },
};

export default Parser;
