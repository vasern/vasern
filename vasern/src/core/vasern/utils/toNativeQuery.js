
function formatQueryValue(value, explicit = false) {

    if (Array.isArray(value)) {
      return {
        start: formatQueryValue(value[0], true),
        end: formatQueryValue(value[1], true)
      };
    }
  
    if (value.constructor.name === "Date") {
      value = value.getTime();
    }
  
    return explicit ? value : { equal: value };
}

function toNativeQuery(props, query) {
    let rs = {};
    for (let key in query) {
        if (props[key] && props[key].relate) {

            if ("$prefetch" in rs === false) {
                rs.$prefetch = {};
            }

            if (key in rs.$prefetch === false) {
                rs.$prefetch[key] = {}
            }

            rs.$prefetch[key][scm.relate] = formatQueryValue(props[key], query[key]);
        } else {
            rs[key] = formatQueryValue(query[key]);
        }
    }
    return rs;
}

export default toNativeQuery;