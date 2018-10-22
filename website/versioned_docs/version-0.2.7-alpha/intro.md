---
id: version-0.2.7-alpha-intro
title: Getting Started
original_id: intro
---

# <img src="https://unpkg.com/vasern@0.2.4/vasern-logo.svg" alt="Vasern Logo" width="200"> 

![](https://badge.fury.io/js/vasern.svg)

Vasern is a data storage for React Native, focus on performance, and consistency (previous npm package located at [vase-dev](https://www.npmjs.com/package/vase-dev)).
With a goal is to develop an open source, developer friendly end-to-end database sync solution. Subscribe to [vasern-server](https://github.com/ambistudio/vasern-server) to follow vasern's server releases.

Important note: Vasern is currently **available on iOS** under **alpha version**, which expects breaking changes and improvements.

## Table of contents

- [Installation](#installation)
- [Getting started](#getting-started)
    - [Writing schema](#writing-schema)
    - [CRUD operations](#crud-operations)
    - [Supported data types](#supported-data-types)
- [Examples](#examples)
- [Contribute, Help and Feedback](#contribute-help-and-feedback)

A more details documentation available at https://vasern.com/docs

## Installation

1. Install using NPM:
    ```ssh
    $ npm install --save vasern
    ```

2. Link Vasern library to your project:

    - **Using rnpm - for iOS, run command**:
        ```ssh
        $ rnpm link vasern
        ```

    - **Manually - for iOS**:

        1. Browse to "**node_packages/vasern/vasern/ios**", and drag "**Vasern.xcodeproj**" to "**Libraries**" directory on your project in XCode.

        2. Add "**libVasern.a**" to "**Build Phase**" > "**Link Binary with Libraries**"
        

3. Close Metro Bundle, rebuild and restart project.

## Getting started

Vasern's design and structures are inspired by various open source databases (mentionable is PouchDB for code structures), which aims for ease of development, performance and friendly to developers.

### Supported Data Types
- Basic data types: string, int, double, datetime
- reference "#", optional "?", list "[]"

### Writing schema

```javascript
import Document, { Vasern } from 'vasern';

class UserModel extends Document {
    name = "Users";
    props = {
        fname: "string",
        lname: "string",
        email: "string"
    }
}

class TodoModel extends Document {
    name = "Todos";
    props = {
        name: "string",
        completed: "boolean",
        parent: "#Todos",
        note: "?string",
        notify: "?datetime",
        assignTo: "#Users"
    }
}

const VasernDB = new Vasern({ schemas: [TodoModel, UserModel] });
const { Users, Todos } = VasernDB;
```

### CRUD operations

- Insert
    ```javascript
    let stewie = Users.insert({
        fname: "Stewie",
        lname: "Griffin",
        email: "stewie@mail.com"
    })[0]

    let tomorrow = new Date();
    tomorrow.setDate(theNextDay.getDate() + 1);

    let tasks = Todos.insert([{
        name: "Meet Louis",
        completed: false,
        assignTo: stewie
    }, {
        name: "Argue with Brain",
        completed: false,
        assignTo: stewie,
        note: "Brain forgot to return the money",
        notify: tomorrow
    }])

    ```
- Get

    ```javascript
    let stewieObject = Users.get({ fname: "Stewie" });
    ```

- Update
    ```javascript
    Users.update(stewie, { email: "" })
    ```

- Delete
    ```javascript
    Users.remove(stewie);
    ```

_(to be updated)_

## Examples

Examples available at "./examples", includes:

- [Vasern Todo](./examples/vasern-todo)

_(to be updated)_

## Contribute, Help and Feedback

Your contribution and feedback are highly welcome and appreciated.

Please [file an issue](https://github.com/ambistudio/vasern/issues) if you need help, found a bug/an improvement or anything we can help. Best to include (1) Goal, (2) Issue, (3) Example code if needed. The more concise and informative, the better it helps us to understand your concern. 