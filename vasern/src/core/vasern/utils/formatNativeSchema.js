
/**
 * Convert user defined schema to fsm schema
 * @param props: User defined data schema 
 */
function formatNativeSchema(props: Object) {
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
        } else if (prop.type === "ref" || prop.type.indexOf("#") === 0) {
            prop.size = 32;
            nativeSchema.indexes[name] = prop;
        } else {
            nativeSchema.body[name] = prop;
        }
    };
    return nativeSchema;
}

export default formatNativeSchema;