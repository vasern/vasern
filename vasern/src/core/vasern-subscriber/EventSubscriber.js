/* ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================= */

export default class EventSubscriber {

  events = {
    change: [],
  };

  getEvents() {
    return this.events;
  }

  // Subscribe a trigger to an event
  subscribe({ type, eventId, callback, override = false, immediateTrigger = false }) {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    if (override) {
      this.events[type].some((event, i) => {
        if (event.eventId === eventId) {
          this.events[type].splice(i, 1);
          return;
        }
      });
    }
    
    this.events[type].push({ eventId, callback });
    if (immediateTrigger) {
      callback({ type: 'immediate' });
    }
  }

  // Trigger all subscribers of an event
  fire(type, changed) {
    const triggers = this.events[type];
    if (triggers && triggers.length) {
      triggers.forEach(trigger => {
        if (trigger.callback) {
          trigger.callback({ changed });
        }
      });
    }

    // Trigger a event fire subscriber
    this.triggerOnChangeEvent({
      event: type,
      changed,
    });
  }

  // Trigger all the subscribers in "anyEventFiredSubscribers"
  triggerOnChangeEvent = eventMeta => {
    this.events.change.forEach(trigger => {
      trigger.callback(eventMeta);
    });
  };

  // Subscribe to "anyEventFiredSubscribers" subscriber
  // Explain:
  //   Let say we subscribed using this func, and trigger a "itemCreated" event
  //   - "event": event name that was fired ("itemCreated")
  //   - "changed": any item that was passed through the "itemCreated" event trigger
  onChange(callback: Function) {
    this.events.change.push(callback);
  }
}
