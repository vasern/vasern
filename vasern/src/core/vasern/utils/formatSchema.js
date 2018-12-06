const allowedSchemaTypes = ["string", "boolean", "double", "int", "datetime", "[]string", "[]boolean", "[]double", "[]int"];
const allowedSchemaProps = ["size", "type", "relate", "indexed", "asList"];
const defaultStringSize = 255;

function parseSchemaPropValue(value) {

  let rs = {};

  switch (typeof value) {

    case "object":

      if ("type" in value === false) {
        console.error("Schema properties required `type`")
      } else {

        // Always set indexed to true
        // if type is a single reference object
        if (value.type === "ref") {
          value.indexed = true;
        } else if (value.type.indexOf("[]") != -1) {
          rs.asList = true;
        }

        if (value.type === "string" && value.indexed && "size" in value === false) {
          value.size = defaultStringSize;
          console.warn("Unable to specify `string` size, set", defaultStringSize, "as default");
        }
      }

      rs = value;

      break;

    case "string":

      // as type or value
      if (allowedSchemaTypes.indexOf(value) !== -1) {

        rs.type = value.replace(/[\#|\[\]]/g, "");
        
        if (value.indexOf("[]") != -1) {
          rs.asList = true;
        }

      } else {

        if (value.indexOf("#") != -1) {
          rs = {
            type: "ref"
          }

          if (value.indexOf("[]") === -1) {
            rs.indexed = true;
          }
        }

        if (value.indexOf("[]") != -1) {
          rs.asList = true;
        }

        rs.relate = value.replace(/[\#|\[\]]/g, "");

      }
      break;

    case "boolean":

      // default value
      rs = {
        type: "boolean",
        defaultValue: value
      }
      break;

    case "number":

      // double, int
      rs = {
        type: value % 1 !== 0 ? "double" : "int",
        defaultValue: value
      }

      break;

    default:

      if (value === Date.now) {
        rs = {
          type: "datetime",
          indexed: true,
          defaultValue: value
        }
      } else {
        console.error("Unable to format schema value", value);
      }
  }

  return rs;
}

function formatSchema(schema) {
  let rs = {};

  for (let prop in schema) {
    rs[prop] = parseSchemaPropValue(schema[prop]);
  }

  return rs;
}

function formatModel(schemas) {

  schemas.forEach(s => {

    s.props = formatSchema(s.props);

  })

  return schemas;
}

export default formatSchema;
export {
  formatModel
}