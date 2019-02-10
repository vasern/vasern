export type Event = {
    id: string,
    callback: (changedObject: { changed: Object[] }) => void
}

export default class EventSubscriber {
    getEvents(): Event;

    subscribe(eventName: string, trigger: Event, override: boolean): void;

    fire(eventName: string, changed: Object[]): void;

    triggerOnChangeEvent(eventMeta: () => void): void;

    onChange(callback: () => void): void;
}