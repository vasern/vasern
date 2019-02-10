export type Query = {
    id: string;
}

export default class Queryable {
    // TODO: Add a more descriptive type from usages
    constructor(data: ArrayLike<any>);

    data(): ArrayLike<any>;

    _removeRecord(query: Query | string): any[];

    get(query: Query | string): any | undefined;

    find(query: Query): any | undefined;

    filter(query: Query): Queryable;

    similarTo(props: string, value: string): any[];

    exclude(query: Query): Queryable;

    group(key: string, transform?: (key: string, data: any) => any): any[] | Queryable;

    order(key: string, order: "asc" | "desc"): Queryable;

    count(): number;
}