// @ts-ignore
import { Reporter } from "vasern/vasern/src/core/vasern-utils";
import Parser from "vasern/vasern/src/core/vasern-parser";
import ObjectID from "vasern/vasern/src/plugins/vasern-objectid";

export default class AsyncDocument {

    // @ts-ignore
    props: any;

    // @ts-ignore
    name: string;

    // @ts-ignore
    oid: ObjectID;

    // @ts-ignore
    get: (query: Object) => Object;

    // @ts-ignore
    _commitChange: (type: string, target: Object) => void;

    // @ts-ignore
    save: () => Promise<void>;

    // @ts-ignore
    validateProps: (keys: string[]) => boolean;

    /**
     * Remove a record that match given query
     * @param query: id or key value (i.e { name: 'Jonas' }) that match the object that will be remove
     * @param save: write data to disk
     */
    async remove(query: Object | Function, save = true) {
        const found = this.get(query);
        if (found) {
            this._commitChange("remove", found);
            if (save) {
                await this.save();
            }
            return true;
        }

        // Not found record to be deleted
        return false;
    }

    /**
     * Create a new content record which return an object with generated UUID
     * Input will be validated using given schema of when initiate Doc
     * @param input: a valid record
     */
    async insert(records: Object[], save = true) {
        
        if (!records) {
            throw Error(`Unable to insert, record must not be empty`);
        }

        const inputs = Array.isArray(records) ? records : [records];

        let propKeys;
        const validObjects = inputs.map(input => {
            propKeys = Object.keys(input);

            if (!this.validateProps(propKeys)) {
                Reporter.warn(
                    `Invalid input for ${this.name
                    }. Record will not be added into database`
                );

                Reporter.warn(propKeys, Object.keys(this.props));
                return null;
            }

            const content = this.oid.new();

            propKeys.forEach(k => {
                let kValue = input[k];
                if (kValue === null || kValue === undefined) {
                    kValue = ""
                }
                if (this.props[k].indexOf("#") !== -1) {
                    content[`${k}_id`] = Parser.valueTypeToStr(this.props[k], kValue);
                } else {
                    content[k] = Parser.valueTypeToStr(this.props[k], kValue);
                }
            });

            this._commitChange("insert", content);

            // Avoid id being washed using save
            // content.id = uuid;

            return content;
        });

        if (save) {
            await this.save();
        }

        // Invalid data type or content not match with schema
        return validObjects;
    }

}