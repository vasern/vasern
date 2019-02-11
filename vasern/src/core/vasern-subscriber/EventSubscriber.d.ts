import { NewObject } from './../../plugins/vasern-objectid';

export type Event = {
    callback: (changedObject: { changed: Object[] }) => void;
    id?: string;
    event?: string;
}

export type ChangeEvent = {
    change: any[];
}

export default class EventSubscriber {
    events: ChangeEvent;

    getEvents(): Event;

    subscribe(eventName: string, trigger: Event, override: boolean): void;

    fire(eventName: string, changed: NewObject | NewObject[]): void;

    triggerOnChangeEvent(eventMeta: () => void): void;

    onChange(callback: Event): void;
}