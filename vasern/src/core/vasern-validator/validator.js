type Props = {|
    mode: 'none' | 'easy' | 'strict',
    layout: Object
|};

// A layout property
// prop = {
//     type: 'string' | 'number' | 'boolean',
//     isRequired: true,
//     isKey: true,
//     len: 20 // if type == 'string', len(val) must <= prop.len
// };

export default class Validator {

    constructor(props: Props) {
        this.mode = props.mode;
        this.layout = props.layout;
        this.props = Object.keys(props.layout);
        this.numberOfProps = this.props.length;

        this.strictValidate = this.strictValidate.bind(this);
        this.easyValidate = this.easyValidate.bind(this);
        this.partialEasyValidate = this.partialEasyValidate.bind(this);
        this.partialStrictValidate = this.partialStrictValidate.bind(this);

        if (this.mode == 'easy') {
            this.validate = this.easyValidate.bind(this);
        } else {
            this.validate = this.strictValidate.bind(this)
        }
    }

    /*:: validate: (record: Object) => void; */

    strictValidate(record: Object) {

        let i = 0;
        for (let prop in this.props) {

            // Check required property exists or not
            if ((prop in record == false 
                && this.layout[prop].isRequired)
            
            // Check if value type is matched
            || (typeof record[prop] != this.layout[prop].type)

            // If value type is string and is a key, check its len
            || (this.layout[prop].isKey 
                && this.layout[prop].type === 'string' 
                && record[prop].length > this.layout[prop].len)
            ) {
                throw new Error("Validation Error:", prop, ":", record[prop], "does not match with desired layout");
            }
            i++;
        }
        
        if (i !== this.numberOfProps) {
            throw new Error("Validation Error: record\"", record.id, "\"does not match with desired layout\n", "Record snapshot: ", record);
        }
    }

    easyValidate(record: Object) {

        for (let prop in this.props) {

            // Check property exists
            if ((prop in record == false 
                && this.layout[prop].isRequired)
            
            // Check value type is matched
            || (typeof record[prop] != this.layout[prop].type)
            ) {
                throw new Error("Validation Error:", prop, ":", record[prop], "does not match with desired layout")
            }
        }
    }

    partialValidate(record: Object) {

        if (this.mode == 'easy') {
            this.partialEasyValidate(record);
        } else if (this.mode == 'strict') {
            this.partialStrictValidate(record);
        }
    }

    partialStrictValidate(record: Object) {

        for (let prop in Object.keys(data)) {
            if ((prop in record == false 
                && this.layout[prop].isRequired)
            
            // Check if value type is matched
            || (typeof record[prop] != this.layout[prop].type)

            // If value type is string and is a key, check its len
            || (this.layout[prop].isKey 
                && this.layout[prop].type === 'string' 
                && record[prop].length > this.layout[prop].len)
            ) {
                throw new Error("Validation Error:", prop, ":", record[prop], "does not match with desired layout");
            }
        }
    }

    partialEasyValidate(record: Object) {

        for (let prop in Object.keys(data)) {

            // Check property exists
            if ((prop in record == false 
                && this.layout[prop].isRequired)
            
            // Check value type is matched
            || (typeof record[prop] != this.layout[prop].type)
            ) {
                throw new Error("Validation Error:", prop, ":", record[prop], "does not match with desired layout")
            }
        }
    }
}