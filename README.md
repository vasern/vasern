# <img src="https://unpkg.com/vasern@0.2.4/vasern-logo.svg" alt="Vasern Logo" width="200"> 

Vasern is a fast and open source data storage for React Native. [Join us on Slack](https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM).

![](https://badge.fury.io/js/vasern.svg)

- [What is Vasern?](#what-is-vasern)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Help and Feedback](#help-and-feedback)
- [Contribute to Vasern](#contribute-to-vasern)

## What is Vasern?

Vasern is a data storage for React Native that underneath is linked-consistent key-value stores. Its data engine is built natively to achieve native performance. Our goal is to develop an open source, developer friendly end-to-end database solution. Sync server - [vasern-server](https://github.com/ambistudio/vasern-server) is under development.

#### A snipped code shows how Vasern works

```javascript
import { Vasern } from 'vasern';

const VasernDB = new Vasern({ 
  schemas: [{
    name: "Users",
    props: {
      fname: "string",
      lname: "string"
    }
  },{
    name: "Todos",
    props: {
      name: "string",
      completed: "boolean",
      assignTo: "#Users"
    }
  }]
});

const todoList = VasernDB.Todos.filter({ completed: false }).data();
```

## Status

Vasern (alpha) is **available on iOS**, which expects breaking changes and improvements.

## Documentation

A detailed user documentation available at https://vasern.com/docs/overview

## Getting Started

- [Install Vasern](https://vasern.com/docs/install-vasern)
- [Supported Data Types](https://vasern.com/docs/supported-data-types)
- [Write Schema, Setup Vasern](https://vasern.com/docs/write-schema-setup-vasern)
- [Basic CRUD operations](https://vasern.com/docs/basic-crud-operation)
- [Queries](https://vasern.com/docs/queries)


## Examples

- [Vasern Todo](https://vasern.com/docs/todo-example) - Simple todo app

## Help and Feedback

- For quick questions, chat and discussion, [join us on Slack](https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM).
- For bugs, suggest improvements, or feature requests, feel free to [file an issue](https://github.com/ambistudio/vasern/issues).

The more concise and informative, the better it helps us to understand your concern.

## Contribute to Vasern

Your contributions are welcome and highly appreciated. At the moment, you can [create an issue](https://github.com/ambistudio/vasern/issues) with (1) Goal and (2) Details of your code.