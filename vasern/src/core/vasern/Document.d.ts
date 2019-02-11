import { Event } from "../vasern-subscriber/EventSubscriber.d";
import RawObject from "../vasern-parser/Parser";
import { NewObject } from "../../plugins/vasern-objectid";

export type Args = {
    props: any;
    version: string;
    name: string;
}

export type NewValue = {
    id: string;
    rest: Object;
}

export type UpdateFunc = {
    remove: (query: string) => void;
    insert: (input: Object | Object[]) => void;
    update: (query: string, newValues: NewValue) => void;
    get: (query: string) => void;
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
export default class Document {
    available: boolean;

    loaded: boolean;

    constructor(args: NewableFunction | Args);

    bindEvents(): void;

    object(input: number | string): RawObject; // TODO: What is the other type? There's no get method so I assume string?

    populate(data: string[]): void;

    formatData(): Promise<void>;

    remove(query: string, save?: boolean): boolean;

    insert(query: Object | Object[], save?: boolean): false | NewObject;

    update(lookupQuery: string, newValues: NewValue, save?: boolean): false | NewObject;

    perform(callback: (updateFuncs: UpdateFunc) => void): void;

    createPrototype(input: Object): NewObject;

    load(): Promise<void>;

    save(): Promise<void>;

    removeAllRecords(): Promise<void>;

    rollbackCommittedRecords(previousCommitedItems: Object): void;

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

    _commitedItems: CommitedItems;

    _isCommitOnQueue: boolean;

    _commitChange: (type: string, item: NewObject, save?: boolean) => void;

    _executeCommitedEvents: (items: NewObject) => void;

    _mergeRecords: (event: string, records: NewObject | NewObject[]) => void;

    static import(plugin: Plugin[]): void;

    inject(Model: NewableFunction): void;
}