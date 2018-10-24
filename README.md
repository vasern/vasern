<img src="https://unpkg.com/vasern@0.2.4/vasern-logo.svg" alt="Vasern Logo" width="300">

[![npm](https://img.shields.io/npm/v/vasern.svg)](https://npmjs.com/package/vasern) 
[![Travis (.org)](https://img.shields.io/travis/ambistudio/vasern.svg)](https://github.com/ambistudio/vasern)
[![GitHub issues](https://img.shields.io/github/issues/ambistudio/vasern.svg)](https://github.com/ambistudio/vasern)
![](https://img.shields.io/badge/Available-iOS%20%2B%20Android-brightgreen.svg)


Vasern is a fast and open source data storage for React Native. 
[Subscribe for updates](https://form.jotform.co/82917565387876) (+ 2 optional survey question)


- [What is Vasern?](#what-is-vasern)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Help and Feedback](#help-and-feedback)
- [Contribute to Vasern](#contribute-to-vasern)

## What is Vasern?

Vasern is a data storage for React Native that underneath is linked-consistent key-value stores. Its data engine is built natively to achieve native performance. Our goal is to develop an open source, developer friendly end-to-end database solution. Sync server - [vasern-server](https://github.com/ambistudio/vasern-server) is under development.

#### A snipped code shows how Vasern works

```javascript
import Vasern from 'vasern';

// Define Todos application schema
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

// Add listener whenever Todos has a change (loaded/insert/update/delete)
VasernDB.Todos.onChange(() => {

  // Get all todo items with "completed" is "false"
  const todoList = VasernDB.Todos.filter({ completed: false });
  
  // Update state
  this.setState({ data: todoList.data() });
})
```

## Status
Vasern (alpha) is **available on iOS and Android**, which expects breaking changes and improvements.

[Join us on Slack](https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM) for any quick update and discusion.


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