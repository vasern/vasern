---
id: version-0.2.7-alpha-write-schema-setup-vasern
title: Write Schema, Setup Vasern
original_id: write-schema-setup-vasern
---

Schemas are required to help `Document`s define its properties data type and validate records.
The following information will help you to start writing schema for `Document`s,
and create `Vasern` instance.

## Write schema

---

There are a quick method and a detailed method to write a schema. Use the detailed method if you need extra functions for your `Document`.

#### Quick method

```javascript
var TodoSchema = {
    name: "Todos",
    props: {
        name: "string",
        note: "?string",
        completed: "boolean"
    },
    assignTo: "#Users"
};

```

#### Detailed method

```javascript
class UserModel {
    name = "Users"
    props = {
        fname: "string",
        lname: "string",
        email: "?string"
    }

    getRandomUser() {

        // Get a random index within a range of 0 to length of records;
        var userIndex = Math.floor(Math.random() * this.length());

        // Document method that return a record
        // using index or record's id
        return this.object(userIndex);
    }
}
```

## Create Vasern instance

---

```javascript
new Vasern(props)
```

#### Props (Object) include

- **_props.schemas (Array\<Object>)_**: a list of `Document` schema in any order.
- **_props.version (int)_**: version of `Document`, `1` by default.

#### Example

We already created `TodoSchema` and `UserModel` above. Let's create a `Vasern` instance

```javascript
import Vasern from 'vasern';

const VasernDB = new Vasern({
    schemas: [UserModel, TodoSchema],
    version: 1
})
```

## Access Document

---

`Document`s are now initiated, and accessible through `VasernDB` using its `name`

```javascript
// Either
var todoList = VasernDB.Todos.data();

// or
const { Todos, Users } = VasernDB;
var userList = Users.data();
```

# What's next?

Learn about [basic CRUD operations](basic-crud-operations.md) or [see examples](todo-example.md)