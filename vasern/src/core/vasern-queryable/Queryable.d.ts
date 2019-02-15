import { NewObject } from './../../plugins/vasern-objectid/ObjectID.d';

export default class Queryable {
    constructor(data: NewObject);

    data(): NewObject;

    get(query: Object | string): NewObject | undefined;

    find(query: Object | string): NewObject | undefined;

    filter(query: Object): Queryable;

    similarTo(props: string, value: string): NewObject[];

    exclude(query: Object): Queryable;

    group(key: string, transform?: (key: string, data: any) => any): NewObject[] | Queryable;

    order(key: string, order: "asc" | "desc"): Queryable;

    count(): number;

    private _removeRecord(query: Object | string): any[];
}