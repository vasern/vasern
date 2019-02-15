import Document, { Args, Plugin } from "./Document";
import EventSubscriber from "../vasern-subscriber";
import Queryable from "../vasern-queryable";

export type VasernConstructorProp = {
    schema: Args[] | NewableFunction[];
    version: number;
}

export default class Vasern {
    docs: Document[];

    loaded: boolean;

    readyDocs: number;

    eventManager: EventSubscriber;

    constructor(schemas: VasernConstructorProp);

    onLoaded(callback: () => void): void;

    get(docName: string): Document;

    refs(props: Object, record: string[] | Object[]): string[] | Object[];

    list(docName: string, filter: (filterParam: any) => void): Queryable;

    import(plugin: Plugin): void;
}