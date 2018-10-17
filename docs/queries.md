---
id: queries
title: Queries
---

Queries are used to get and filter records through a `Queryable` object. Which uses `lodash` to work with `Array` records. The following contents are a list of available query methods.


## Work with Queryable
---

`Queryable` contains a set of immutable records and separated from the Document records. The following code demonstrates how to create a `Queryable` object.

```javascript
import { Queryable } from 'vasern';

const queryObj = new Queryable(data);
```


## Get record
---

Find and return a record that match with `lookupQuery`.

```javascript
Queryable.get(lookupQuery)
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
var foundRecord = Queryable.get({ id: "5bc592cacdAsassfs000ddddBBdbcdfb" });
```

## Filter records
---

Find and return a list of records that match with `lookupQuery`.

```javascript
Queryable.filter(lookupQuery)
```

#### Arguments

- **_lookupQuery ( Object )_**: match record properties and values with `Object` properties and values

#### Return

- **_Array\<Object>_**: a list of records that match with **_lookupQuery_**

#### Example

```javascript
var records = Queryable.filter({ completed: true });
```

## Exclude records

---

Excludes records that match with `lookupQuery` from current Queryable dataset.

```javascript
Queryable.exclude(lookupQuery)
```

#### Arguments

- **_lookupQuery ( Object )_**: match record properties and values with `Object` properties and values

#### Return

- **_Array\<Object>_**: a list of records that match with **_lookupQuery_**

#### Example

```javascript
var records = Queryable.exclude({ completed: true });
```

## Order records

---

Re-order records list by `key`.

```javascript
Queryable.order(key, asc = true)
```

#### Arguments

- **_key ( string )_**: property name
- **_asc (boolean)_**: allow order ascending, set to `false` for decending order.

#### Return

- **_Array\<Object>_**: a list of reorderd records

#### Example

```javascript
var records = Queryable.filter({ completed: true });
```

# What's next?

Visit [Support and Feedback](support-and-feedback.md) for contribution, ask for help or give us feedback. 

If you have gone this far, and have read information provided, we'd like to thank you for your intests in Vasern. We have some [examples](todo-example.md) in case you want some more. 

P/s: Don't wait to start building your dream app!