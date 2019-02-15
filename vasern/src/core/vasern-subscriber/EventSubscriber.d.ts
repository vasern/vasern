import { NewObject } from './../../plugins/vasern-objectid';

export type Event = {
    callback: (changedObject: { changed: Object[] }) => void;
    id?: string;
    event?: string;
}

export type ChangeEvent = {
    change: Event[];
}

export type EventMeta = {
    changed: NewObject[];
    event: string;
}

export default class EventSubscriber {
    events: ChangeEvent;

    getEvents(): ChangeEvent;

    subscribe(eventName: string, trigger: Event, override?: boolean): void;

    fire(eventName: string, changed?: NewObject | NewObject[]): void;

    triggerOnChangeEvent(triggerFunction: (evenMeta: EventMeta) => void): void;

    onChange(callback: Event): void;
}