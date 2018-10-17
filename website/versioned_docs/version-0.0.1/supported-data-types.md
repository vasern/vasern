---
id: version-0.0.1-supported-data-types
title: Supported Data Types
original_id: supported-data-types
---

Data types are used to define property's type when writting Document schema.
Currently, Vasern supports:

- Basic data types includes `string`, `int`, `double`, `datetime`, and `reference` using `#` followed by schema's `name`.
- Each type also has its characteristic `optional using "?"`, and `list using "[]"`

To help you better understand about using data types in the schema, we will use `Todo use case` as an example. Then explains about data types used.

## Todo use case

---

For now, we will only focus about the schema definition `props` in this example.

```javascript
const TodoSchema = {
    name: "Todos",
    props: {
        name: "string",
        note: "?string",
        notifyOn: "?datetime",
        completed: "boolean",
        parent: "#Todos",
        assignedTo: "[]#User"
    }
}
```

## Basic data types

---

In the above example, basic data types are:

- `string`, used by `name`, `note`
- `datetime`, used by `notifyOn`
- `boolean`, used by `completed`
- `#` indicate `reference`, used by `parent` and `assignedTo`.

## Type characteristic

---

- `?` indicates `optional`, which allow value to be `undefined`, used by `note`, and `notifyOn`.
- `[]` indicates `list`, which contains a list of basic types, used by `assignedTo`

Note: Do not provide `optional` for `list`, as a `list` length starts from `0`

# What's next

Learn how to [write schema and create Vasern instance](write-schema.md)