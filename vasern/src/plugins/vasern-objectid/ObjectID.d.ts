export type ConstructorProp = {
    mid?: string;
}

export type NewObject = Object & {
    id: string;
}

export type DateId = {
    _id: string;
}

export default class ObjectID {
    count: number;

    lastTimestamp: number;

    mid: string;

    constructor(prop?: ConstructorProp);

    new(props?: Object): NewObject;

    setMID(id: string): void;

    static RandStr(length: number): string;

    static GetDate(_id: DateId): Date;
}