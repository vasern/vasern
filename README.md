
<p align="center">  
<img align="center" src="https://unpkg.com/vasern@0.2.4/vasern-logo.svg" alt="Vasern Logo" width="300" height="120">
</p>

<p align="center">
  <a href="https://npmjs.com/package/vasern">
    <img src="https://img.shields.io/npm/v/vasern.svg" alt="NPM">
  </a>
  
  <a href="https://travis-ci.org/vasern/vasern">
    <img src="https://img.shields.io/travis/vasern/vasern.svg?logo=travis" alt="CI Status">
  </a>
  
  <a href="https://github.com/vasern/vasern/issues">
    <img src="https://img.shields.io/github/issues/vasern/vasern.svg" alt="GitHub Issues">
  </a>
  
  <a href="https://github.com/vasern/vasern">
    <img src="https://img.shields.io/badge/React%20Native-iOS%20%2B%20Android-brightgreen.svg" alt="Supported Platforms ">
  </a>
  
  <a href="https://join.slack.com/t/vasern/shared_invite/zt-5uoc8hec-Y~b9PjQfN0n2PbCTJH7exA">
    <img src="https://img.shields.io/badge/chat-on%20Slack-%23e21357.svg?logo=slack" alt="Join Slack">
  </a>
</p>

<h4 align="center">
Vasern is a fast and open source data storage for React Native.
</h4>

<p align="center">
  View <a href="https://github.com/vasern/vasern/blob/master/roadmap.md">Development Roadmap</a>. Read about <a href="https://medium.com/vasern/vasern-a-fast-lightweight-and-open-source-data-storage-for-react-native-7fccff7506a1">beta release announcement</a>
</p>


---

__Table of Contents:__

- [What is Vasern?](#what-is-vasern)
- [Development Status](#development-status)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Help and Feedback](#help-and-feedback)
- [Contribute to Vasern](#contribute-to-vasern)


For more details, visit [Vasern Documentation](docs/overview)

Updated 08/10/2019: Due to personal schedule and a small number of active users, vasern-server and news features won't be release anytime soon. Though I'll be happy to help with current issues. Any changes in the future will be updated in the slack channel

## What is Vasern?

Vasern is a data storage for React Native that underneath is linked-consistent key-value stores. Its data engine is built natively to achieve native performance. Our goal is to develop an open source, developer friendly end-to-end database solution. <s>Sync server - [vasern-server](https://github.com/vasern/vasern-server) is under development.</s>

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

## Development Status

Vasern beta is **available on iOS and Android**. It is being tested to ensure its functionality, data quality and consistency. View [Development Roadmap](roadmap.md)

[Join us on Slack](https://join.slack.com/t/vasern/shared_invite/zt-5uoc8hec-Y~b9PjQfN0n2PbCTJH7exA) for any quick update and discusion.


## Getting Started

- [Install Vasern](docs/install-vasern.md)
- [Supported Data Types](docs/supported-data-types.md)
- [Write Schema, Setup Vasern](docs/write-schema-setup-vasern.md)
- [Basic CRUD operations](docs/basic-crud-operation.md)
- [Queries](docs/queries.md)


## Examples

- [Vasern Todo](docs/todo-example.md) - Simple todo app

## Help and Feedback

- For quick questions, chat and discussion, [join us on Slack](https://join.slack.com/t/vasern/shared_invite/zt-5uoc8hec-Y~b9PjQfN0n2PbCTJH7exA).
- For bugs, suggest improvements, or feature requests, feel free to [file an issue](https://github.com/vasern/vasern/issues).

The more concise and informative, the better it helps us to understand your concern.

## Contributors

Vasern is lucky to have support from our contributors, thanks to:

- [Aditya Sonel](https://github.com/adityasonel)
- [Alex](https://github.com/curtisy1) (adding support for typescript)
- [Noal](https://github.com/apppro123)
- [Tuan Anh Nguyen](https://github.com/anhtuank7c)
- [Kai](https://github.com/kailashvele)

## Contribute to Vasern

Your contributions are welcome and highly appreciated. At the moment, you can [create an issue](https://github.com/vasern/vasern/issues) with (1) Goal and (2) Details of your code.
