// @flow

/**
 * Restructure query value
 * @param {string} type: value type
 * @param {any} value: value
 */
function toNativeQueryValue(type: string, value: any) {

    if (typeof value != "object") {
        return { equal: value };
    } else if ("equal" in value) {
        return value;
    } else if ("id" in value) {
        return { equal: value.id };
    }

    var rs = {}, key: string;
    for (key in value) {
        rs[key] = toNativeQueryValue(type, value[key]);
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

    let scm, key: string, includeKey: string;
    
    for (key in query) {
        scm = schema[key];

        if (key == "$include") {

            let inclueQ = {};
            
            for (includeKey in query[key]) {
                inclueQ[includeKey] = query[key][includeKey];

                if ("filter" in query[key][includeKey]) {
                    inclueQ[includeKey].filter = toNativeQueryValue(null, inclueQ[includeKey].filter);
                }
            }
            rs[key] = inclueQ;

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
    }
    , prop = {};

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