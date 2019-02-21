---
id: version-0.3.0-beta-event-listeners
title: Event Listeners
original_id: event-listeners
---
 
Event listeners are callback functions that subscribe to a `Document`'s event
(including loaded, insert, update, delete). Each time an event happen,
it will automatically execute callback functions that was subsribed to that event

The following content are event listeners that available to Vasern.

- [onAvailable](#onavailable-event)
- [onLoaded](#onloaded-event)
- [onInsert](#oninsert-event)
- [onUpdate](#onupdate-event)
- [onRemove](#onremove-event)
- [onChange](#onchange-event)

## onAvailable event

`onAvailable` is triggered when the app started, and raw records is loaded from Vasern's native module.

_Note: raw records are in the raw form, which has **id** and **raw** properties. 
Use [`onLoaded`](#onloaded-event) if you need normal records_

```javascript
Document.onAvailable(callback)
```

#### Arguments

- **_callback ( Function )_**: callback function when data is available in raw form

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onAvailable(() => {
    
    // Notify user number of records
    alert(`Loading ${Todos.count()} items`)
})
```

## onLoaded event

`onLoaded` is triggered when raw records are converted to normal record objects.

```javascript
Document.onLoaded(callback)
```
#### Arguments

- **_callback ( Function )_**: callback function when data is loaded completely

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onLoaded(() => {
    
    // Display incompleted items to users
    this.setState({ 
        items: Todos.filter({ completed: false }).data(),
    });
})
```

## onInsert event

`onInsert` is triggered after a record or muliple records are inserted and saved to the `Document`.
Callback function will receive a list of new records.

```javascript
Document.onLoaded(callback)
```
#### Arguments

- **_callback ( Function: { changed } )_**: callback function when records are inserted
    - _changed ( Array[object] )_: a list of records has just inserted

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onInsert(({ changed }) => {
    
    // Log number of inserted records
    console.log(changed.length);
})
```

## onUpdate event

`onUpdate` is triggered after a record or muliple records are updated and saved to the `Document`.
Callback function will receive a list of updated records.

```javascript
Document.onUpdate(callback)
```
#### Arguments

- **_callback ( Function: { changed } )_**: callback function when records are updated
    - _changed ( Array[object] )_: a list of records has been updated

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onUpdate(({ changed }) => {
    
    // Log number of updated records
    console.log(changed.length);
})
```

## onRemove event

`onRemove` is triggered after a record or muliple records are removed from the `Document`.
Callback function will receive a list of removed records.

```javascript
Document.onRemove(callback)
```
#### Arguments

- **_callback ( Function: { changed } )_**: callback function when records are removed
    - _changed ( Array[object] )_: a list of removed records has been removed

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onRemove(({ changed }) => {
    
    // Log number of removed records
    console.log(changed.length);
})
```

## onChange event

`onChange` is triggered after any of the above event is triggered from the `Document`. In other words,
it captured all events. Callback function will receive an event name and a list of affected records.

```javascript
Document.onChange(callback)
```
#### Arguments

- **_callback ( Function: { event, changed } )_**: callback function when an event is triggered
    - _event ( string )_: name of the event that was triggered
    - _changed ( Array[object] )_: a list of affected records

#### Example

```javascript
// Assuming Todos is a Document instance
Todos.onChange(({ changed }) => {
    
    // Log triggered event and number of records that was affected
    console.log(event, "was triggered that affects", changed.length, "records");
})
```

# What's next?

Visit [Support and Feedback](support-and-feedback.md) for contribution, ask for help or give us feedback. 

If you have gone this far, and have read information provided, we'd like to thank you for your intests in Vasern. We have some [examples](todo-example.md) in case you want some more. 

P/s: Don't hesitate to start to build your dream app!