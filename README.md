<p align="center"> 
<img src="./banner.svg" alt="Vasern Logo" height="250">
</p>

<p align="center">
  
  <a href="https://github.com/vasern/vasern">
    <img src="https://img.shields.io/travis/vasern/vasern.svg?logo=travis" alt="CI Status">
  </a>
  
  <a href="https://npmjs.com/package/vasern">
    <img src="https://img.shields.io/npm/v/vasern.svg" alt="NPM">
  </a>
  
  <a href="https://github.com/vasern/vasern/issues">
    <img src="https://img.shields.io/github/issues/vasern/vasern.svg" alt="GitHub Issues">
  </a>
  
  <a href="https://github.com/vasern/vasern">
    <img src="https://img.shields.io/badge/React%20Native-iOS%20%2B%20Android-brightgreen.svg" alt="Supported Platforms ">
  </a>
  
  <a href="https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM">
    <img src="https://img.shields.io/badge/chat-on%20Slack-%23e21357.svg?logo=slack" alt="Join Slack">
  </a>
</p>

<h2 align="center">
Vasern is a fast and open source data storage for React Native.
</h2>

<p align="center">
  <a href="https://form.jotform.co/82917565387876">Subscribe for updates</a>. Read about <a href="https://medium.com/vasern/vasern-a-fast-lightweight-and-open-source-data-storage-for-react-native-7fccff7506a1">beta release announcement</a>
</p>


---

__Table of Contents:__

- [What is Vasern?](#what-is-vasern)
- [Status](#status)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Help and Feedback](#help-and-feedback)
- [Contribute to Vasern](#contribute-to-vasern)


For more details, visit [Vasern Documentation](https://vasern.com/docs/overview)

## What is Vasern?

Vasern is a data storage for React Native that underneath is linked-consistent key-value stores. Its data engine is built natively to achieve native performance. Our goal is to develop an open source, developer friendly end-to-end database solution. Sync server - [vasern-server](https://github.com/vasern/vasern-server) is under development.

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

Vasern beta is **available on iOS and Android**. It is being heavily tested to ensure its functionality, data quality and consistency.

Most of APIs won’t be changed in the near future. A stable release of Vasern will be announced within a month from now unless there are major issues. After the stable release, Vasern will continue to be maintained and improved.

[Join us on Slack](https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM) for any quick update and discusion.


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
- For bugs, suggest improvements, or feature requests, feel free to [file an issue](https://github.com/vasern/vasern/issues).

The more concise and informative, the better it helps us to understand your concern.

## Contribute to Vasern

Your contributions are welcome and highly appreciated. At the moment, you can [create an issue](https://github.com/vasern/vasern/issues) with (1) Goal and (2) Details of your code.
