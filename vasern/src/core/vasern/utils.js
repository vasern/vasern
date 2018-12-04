// @flow

type RType = "datetime" | "string" | "int" | "double" | "float" | "boolean";

function toValue(value: any) {
    if (value.constructor.name == "Date") {
        return value.getTime();
    }

    return value;
};

/**
 * Restructure query value
 * @param layout: value type
 * @param {any} value: value
 */
function toNativeQueryValue(layout: { type: RType, indexed: boolean }, value: any) {

    // Range
    if (Array.isArray(value)) {
        return {
            start: toValue(value[0]),
            end: toValue(value[1]),
        };
    } else if (typeof value != "object") {

        return {
            equal: toValue(value)
        };

    } else if ("equal" in value) {

        return {
            equal: toValue(value.equal)
        };

    } else if ("start" in value || "end" in value) {
        let obj = {};

        if ("start" in value) {
            obj.start = toValue(value.start);
        }

        if ("end" in value) {
            obj.end = toValue(value.end);
        }

        return obj;

    } else if ("id" in value) {

        return {
            equal: value.id
        };

    } else if (value.constructor.name == "Date") {

        return {
            equal: value.getTime()
        }
    }

    var rs = {},
        key;
    for (key in value) {
        rs[key] = toNativeQueryValue(layout, value[key]);
    }
    return rs;
}


/**
 * Convert user defined query to native fsm query structure
 * @param {*} schema: native fsm schema
 * @param {*} query : user defined query
 */
function toNativeQuery(schema, query: Object) {
    let rs = {};

    let scm, key, includeKey;

    for (key in query) {
        scm = schema[key];

        if (key == "$include") {

            let inclueQ = {};

            for (includeKey in query[key]) {
                inclueQ[includeKey] = query[key][includeKey];

                if ("filter" in query[key][includeKey]) {
                    inclueQ[includeKey].filter = toNativeQueryValue(scm, query[key][includeKey].filter);
                }
            }
            rs[key] = inclueQ;

        } else if(key.indexOf("$") == 0) {
            rs[key] = query[key];
        } else if (scm.type == "ref" && "equal" in query[key] === false) {

            // Query with prefetched reference

            if ("$prefetch" in rs === false) {
                rs.$prefetch = {};
            }

            if (key in rs.$prefetch === false) {
                rs.$prefetch[key] = {}
            }

            rs.$prefetch[key][scm.relate] = toNativeQueryValue(scm, query[key]);

        } else {
            rs[key] = toNativeQueryValue(scm, query[key]);
        }
    };
    return rs;
}

/**
 * Convert user defined schema to fsm schema
 * @param props: User defined data schema 
 */
function toNativeSchema(props: Object) {
    var nativeSchema = {
        key: {},
        indexes: {},
        body: {}
    },  prop = {};

    let name: string;

    for (name in props) {
        prop = props[name];

        if (prop.primary) {
            nativeSchema.key = prop;
        } else if (prop.indexed) {
            nativeSchema.indexes[name] = prop;
        } else if (prop.type == "ref" || prop.type.indexOf("#") == 0) {
            prop.size = 32;
            nativeSchema.indexes[name] = prop;
        } else {
            nativeSchema.body[name] = prop;
        }
    };
    return nativeSchema;
}

export {
    toNativeQuery,
    toNativeSchema
}