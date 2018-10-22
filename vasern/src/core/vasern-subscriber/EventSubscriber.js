/* ===============================================================
//
//  Copyright by Ambi Studio 2018
//  Licensed under the Apache License, Version 2.0 (the "License");
//  (Please find "LICENSE" file attached for license details)
//============================================================= */

// Note: Event format is { id: string, callback: function({ changed: Array<object> }) }

import _ from "lodash";

export default class EventSubscriber {
  events = {
    change: [],
  };

  getEvents() {
    return this.events;
  }

  // Subscribe a trigger to an event
  subscribe(eventName, trigger, override = false) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (override) {
      const index = _.findIndex(this.events, { id: trigger.id });
      if (index !== -1) {
        this.events[eventName].splice(index, 1);
      }
    }

    this.events[eventName].push(trigger);
  }

  // Trigger all subscribers of an event
  fire(eventName, changed) {
    const triggers = this.events[eventName];
    if (triggers && triggers.length) {
      triggers.forEach(trigger => {
        if (trigger.callback) {
          trigger.callback({ changed });
        }
      });
    }

    // Trigger a event fire subscriber
    this.triggerOnChangeEvent({
      event: eventName,
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
