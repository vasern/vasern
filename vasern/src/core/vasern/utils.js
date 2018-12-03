// @flow

function toNativeQueryValue(type, value: any) {

    if (typeof value != "object") {
        return { equal: value };

    } else if ("equal" in value) {

        return value;
    }
    var rs = {};
    Object.keys(value).forEach(key => {
        rs[key] = toNativeQueryValue(type, value[key]);
    })
    return rs;
}

// Convert user's query into fsm understandable query
function toNativeQuery(schema, query: Object) {
    let rs = {};

    let scm;

    Object.keys(query).forEach(key => {
        scm = schema[key];

        if (key == "$include") {

            let inclueQ = {};
            Object.keys(query[key]).forEach( includeKey => {
                inclueQ[includeKey] = query[key][includeKey];

                if ("filter" in query[key][includeKey]) {
                    inclueQ[includeKey].filter = toNativeQueryValue(null, inclueQ[includeKey].filter);
                }
            })
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
    })
    return rs;
}

function toNativeSchema(props: Object) {
    var nativeSchema = {
        key: {},
        indexes: {},
        body: {}
    }
        , prop = {};

    Object.keys(props).forEach((name: string) => {

        prop = props[name];

        if (prop.primary) {
            nativeSchema.key = prop;
        } else if (prop.indexed) {
            nativeSchema.indexes[name] = prop;
        } else if (prop.type.indexOf("#") == 0) {
            prop.size = 32;
            nativeSchema.indexes[name] = prop;
        } else {
            nativeSchema.body[name] = prop;
        }

    });
    return nativeSchema;
}

export {
    toNativeQuery,
    toNativeSchema
}