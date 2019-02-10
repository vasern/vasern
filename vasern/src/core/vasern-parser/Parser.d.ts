declare module "Parser" {
    export interface RawObject {
        id: number;
        raw: string;
    }

    export interface Schema {
        name: string;
        props: any;
    }

    export interface ActionValues {
        input: any;
        update: any;
        remove: any;
    }

    namespace Parser {
        function parseValue(inputType: string, val: string): any;

        function parse(lines: string[], schema: any): {data: string};

        function strToObj(schema: any, rawObject: RawObject): RawObject;

        function schemify(line: string): Schema;

        function stringify(schema: Schema, data: any[]): string;

        function convertToSave(schema: Schema, data: any[]): string[];

        function convertToLog(schema: Schema, actions: ActionValues): string[];

        function objToStr(props: any, obj: any): string;

        function valueTypeToStr(dataType: string, value: any): string;
    }

    export default Parser;
}