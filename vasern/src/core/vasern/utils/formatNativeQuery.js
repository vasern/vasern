// @flow

type RType = "datetime" | "string" | "int" | "double" | "float" | "boolean";

function toNativeSortQueryValue(value: any) {
    let rs = {};

    if (typeof value === "boolean") {
        return value;
    } else if (typeof value === "string") {

        rs[value] = true;
    } else if (typeof value === "object") {

        return value;
    }

    return rs;
}

function toValue(value: any) {
    if (value.constructor.name === "Date") {
        return value.getTime();
    }

    return value;
}

/**
 * Restructure query value
 * @param layout: value type
 * @param {any} value: value
 */
function formatNativeQueryValue(layout: { type: RType, indexed: boolean }, value: any) {

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

    } else if (value.constructor.name === "Date") {

        return {
            equal: value.getTime()
        }
    }

    var rs = {}, key: string;

    for (key in value) {
        if (key === "range") {
            rs = formatNativeQueryValue(layout, value[key]);
        } else {
            rs[key] = formatNativeQueryValue(layout, value[key]);
        }
    }
    return rs;
}


/**
 * Convert user defined query to native fsm query structure
 * @param {*} schema: native fsm schema
 * @param {*} query : user defined query
 */
function formatNativeQuery(schema, query: Object) {
    let rs = {};

    let scm;

    for (let key in query) {
        scm = schema[key];

        if (key === "$include") {

            let inclueQ = {};

            for (includeItem of query[key]) {
            
            	if (typeof includeItem === "string") {

                    inclueQ[includeItem] = {
                        relate: schema[includeItem].relate,
                        refField: includeItem
                    }
                } else {

                    for (let includeKey in includeItem) {
                        inclueQ[includeKey] = includeItem[includeKey];

                        if ("filter" in includeItem) {
                            inclueQ[includeKey].filter = formatNativeQueryValue(scm, includeItem[includeKey].filter);
                        }
                    }
              }
            };
            rs[key] = inclueQ;

        } else if (key ==="$sort") {
        	
            rs[key] = toNativeSortQueryValue(query[key]);
            
        } else if(key.indexOf("$") === 0) {

            rs[key] = query[key];
            
        } else if (scm.type === "ref" && "equal" in query[key] === false) {

            // Query with prefetched reference

            if ("$prefetch" in rs === false) {
                rs.$prefetch = {};
            }

            if (key in rs.$prefetch === false) {
                rs.$prefetch[key] = {}
            }

            rs.$prefetch[key][scm.relate] = formatNativeQueryValue(scm, query[key]);

        } else {
            rs[key] = formatNativeQueryValue(scm, query[key]);
        }
    }
    return rs;
}

export default formatNativeQuery;
export {
    formatNativeQueryValue
}