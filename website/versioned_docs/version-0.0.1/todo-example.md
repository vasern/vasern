---
id: version-0.0.1-todo-example
title: Example - Vasern Todo
original_id: todo-example
---

This sample implements a simple todo list app using [Vasern](https://github.com/ambistudio/vasern)  as data storage and React Native.
It demonstrate basic CRUD operations of Vasern (get, insert, update, delete data).

## Features

---

- Add, delete todo item
- Add, delete sub todo item

## Demo

---

![](https://media.giphy.com/media/3MdQ2n83c565RuHRlI/giphy.gif)


## Installation

---

1. Clone or download [Vasern from Github repository](https://github.com/ambistudio/vasern) into your computer.
2. Navigate to `examples/vasern-todo` and run command from :

    - Install npm dependencies, (1-3 mins)
        ```ssh
        $ npm install
        ```

    - Link Vasern using rnpm, or follow instruction on our main "README.md" file
        ```ssh
        $ rnpm link vasern
        ```

3. Signing certificate then run the app on your simulator using xCode Project locate at "examples/vasern-todo/ios" or using command `react-native run-ios`

## Other libraries used in this example

---

- [react-native-spacer](https://github.com/ambistudio/react-native-spacer) - a keyboard avoding wrapper.