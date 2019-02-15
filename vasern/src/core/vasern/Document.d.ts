import EventSubscriber, { Event } from "../vasern-subscriber/EventSubscriber.d";
import RawObject from "../vasern-parser/Parser";
import ObjectID, { NewObject } from "../../plugins/vasern-objectid";
import ConfigProps from "../../config";

export type Args = {
    props: any;
    name: string;
    version?: number;
    assignTo?: string;
    callbackFunction?: () => any;
}

export type NewValue = {
    id: string;
    rest: Object;
}

export type UpdateFunc = {
    remove: (query: string | Object) => boolean;
    insert: (input: Object | Object[]) => false | NewObject;
    update: (query: string | Object, newValues: NewValue) => false | NewObject;
    get: (query: string | Object) => NewObject;
}

export type CommitedItems = {
    insert: NewObject[];
    update: NewObject[];
    remove: NewObject[];
}

export type Plugin = {
    methods: Function[];
    name: string;
}

// TODO: I'm not sure about all the query types as get isn't implemented
// TODO: Also in the example data() gets called but there's no such function here?
export default class Document {
    available: boolean;

    loaded: boolean;

    name: string;

    oid: ObjectID;

    props: Args;

    version: number;

    storeOptions: ConfigProps["storeOptions"];

    eventManager: EventSubscriber;

    constructor(args: NewableFunction | Args);

    bindEvents(): void;

    object(input: number | string | Object): RawObject; // TODO: What is the other type? There's no get method so I assume string?

    populate(data: string[]): void;

    formatData(): Promise<void>;

    remove(query: string | Object, save?: boolean): boolean;

    insert(query: Object | Object[], save?: boolean): false | NewObject[];

    update(lookupQuery: string| Object, newValues: Object, save?: boolean): false | NewObject;

    perform(callback: (updateFuncs: UpdateFunc) => void): void;

    createPrototype(input: Object): NewObject;

    load(): Promise<void>;

    save(): Promise<void>;

    removeAllRecords(): Promise<void>;

    rollbackCommittedRecords(previousCommitedItems: NewObject): void;

    createSnapshot(): Promise<void>;

    docName(): string;

    onLoaded(callback: (callbackObj: Event) => void): void;

    onAvailable(callback: (callbackObj: Event) => void): void;

    on(eventType: string, callback: Event): void;

    onInsert(callback: Event): void;

    onRemove(callback: Event): void;

    onUpdate(callback: Event): void;

    onChange(callback: Event): void;

    length(): number;

    validateProps: (keys: string[]) => boolean;

    static import(plugin: Plugin[]): void;

    inject(Model: NewableFunction): void;

    get(lookupQuery: string | Object): NewObject;

    private _data: NewObject[];

    private _commitedItems: CommitedItems;

    private _isCommitOnQueue: boolean;

    private _commitChange: (type: string, item: NewObject, save?: boolean) => void;

    private _executeCommitedEvents: (items: NewObject) => void;

    private _mergeRecords: (event: string, records: NewObject | NewObject[]) => void;
}