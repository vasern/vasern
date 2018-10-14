//================================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//================================================================


// Note: Event format is { id: string, callback: function({ changed: Array<object> }) }

import _ from "lodash";

export class EventSubscriber {

    constructor() {
        this.events = {
            change: []
        }
    }

    getEvents() {
        return this.events;
    }

    // Subscribe a trigger to an event
    subscribe(eventName, trigger, override = false) {
        
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }
        
        if (override) {
            if (( index = _.findIndex(this.events, { id: trigger.id })) != -1) {
                this.events[eventName].splice(index, 1);
            } 
        }

        this.events[eventName].push(trigger);
    }

    // Trigger all subscribers of an event
    fire(eventName, changed) {
        
        if ((e = this.events[eventName]) && e.length) {

            e.forEach(trigger => {

                if (trigger.callback) {
                    trigger.callback({ changed });
                }
            })
        }
        
        // Trigger a event fire subscriber
        this.triggerOnChangeEvent({
            event: eventName,
            changed
        });
        
    }

    // Trigger all the subscribers in "anyEventFiredSubscribers"
    triggerOnChangeEvent = (eventMeta) => {
        
        this.events.change.forEach(s => {
            s.callback(eventMeta)
        });
    }

    // Subscribe to "anyEventFiredSubscribers" subscriber
    // Explain: 
    //   Let say we subscribed using this func, and trigger a "itemCreated" event
    //   - "event": event name that was fired ("itemCreated")
    //   - "changed": any item that was passed through the "itemCreated" event trigger
    onChange(callback: Function) {
        this.events.change.push(callback);
    }
}