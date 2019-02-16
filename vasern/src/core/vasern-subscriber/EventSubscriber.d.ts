import { NewObject } from './../../plugins/vasern-objectid';

export type EventCallback = (changedObject: { changed: Object[] }) => void;

export type Event = {
    callback: EventCallback;
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

    onChange(callback: EventCallback): void;
}
