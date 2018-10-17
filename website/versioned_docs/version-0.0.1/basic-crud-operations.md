---
id: version-0.0.1-basic-crud-operation
title: Basic CRUD operations
original_id: basic-crud-operation
---

CRUD shorts for create (insert), read (get), update, delete (remove) - basic database operations.
The following contents will explain how to use CRUD on Vasern.

Note: Use [`perform`](#perform-multiple-operations) for multiple operations

Let's use `VasernDB` in `Todo use case` example created in [Write Schema, Setup Vasern](write-schema-setup-vasern.md).

```javascript
const { Todos } = VasernDB;
```

## Insert method

---

Inserting new records into `Document`

```javascript
Todos.insert(newRecords, save = true)
```

#### Arguments

- **_newRecord (Object | Array\<Object>)_**: new record/records data
- **_save (boolean)_**: allow Document to write record to disk right away. If set to `false`, Document won't write record to disk right away and add to commited transaction list.

#### Return

- **_Array\<Object>_**: a list of created records (indicate executing insert process)

#### Example

```javascript
var item1 = Todos.insert({
    name: "Setup database for React Native",
    note: "Using Vasern",
    completed: false
})[0];
```

## Get method

---

Document use [Queryable](queries#Queryable) object to work with records. Which use `lodash` to provide other queries such as `include`, `find`, `filter`, `exclude`, etc.

```javascript
Todos.get(lookupQuery)
```

#### Arguments

- **_lookupQuery ( string, Object )_**
  - (string): match record id with `string` value
  - (Object): match record properties and values with `Object` properties and values

#### Return

- **_Object_**: object that match with **_lookupQuery_**
- **_undefined_** if not found

#### Example

```javascript
var todoItem = Todos.get({ name: "Setup database for React Native" });
```

## Update method

---

Update existing record with new valuse

```javascript
Todos.update(lookupQuery, newValues, save = true);
```

#### Arguments

- **_lookupQuery ( string | Object )_**
  - (string): record id
  - (Object): record object _that contains `id`_
- **_save (boolean)_**: allow Document to write record to disk right away. If set to `false`, Document won't write record to disk right away and add to commited transaction list.

#### Return

- **_Object_**: indicates record is found, and execute update process
- **_false_** if item not found

#### Example

```javascript
var item1 = Todos.get({ name: "Setup database for React Native" });
Todos.update(item1.id, { completed: true });
```


## Remove method

---

Remove an existing record from Document's records

```javascript
Todos.remove(lookupQuery, save = true);
```

#### Arguments

- **_lookupQuery ( string | Object )_**
  - (string): record id
  - (Object): record object _that contains `id`_
- **_save (boolean)_**: allow Document to write record to disk right away. If set to `false`, Document won't write record to disk right away and add to commited transaction list.

#### Return

- **_boolean_**: indicate record is found, and execute remove process

#### Example

```javascript
var item1 = Todos.get({ name: "Setup database for React Native" });
Todos.remove(item1);
```

## Perform multiple operations

---

This method commits multiple operations and write all at once. Which optimize for performance.

Note: Don't use `Todos.insert`, `Todos.remove` or `Todos.update` in **_callback_** block as it will
create a separate write process.

```javascript
function callback(db: { insert, update, remove, get }) {
    // Execute operations
}

Todos.perform(callback);
```

#### Arguments

- **_callback ( Function ): ({ insert, update, remove, get })_**: execution **_callback_** block.
  - **_insert_** is a version of [Insert method](#insert-method) with `save = false`
  - **_get_** is a version of [Get method](#get-method)
  - **_remove_** is a version of [Remove method](#remove-method) with `save = false`
  - **_update_** is a version of [Update method](#update-method) with `save = false`

#### Return

- No returning value

#### Example

```javascript
Todos.perform(function(db) {

    // Remove all completed items 
    // and update incompleted item to completed
    Todos.data().forEach(function(item) {
        if (item.completed) {
            db.remove(item)
        } else {
            db.update(item, { completed: true })
        }
    })
})
```



# What's next?

Learn about [Queries](queries.md) 
or [see examples](examples.md)
