# <img src="https://unpkg.com/vasern@0.2.4/vasern-logo.svg" alt="Vasern Logo" width="200"> 

Vasern is a data storage for React Native, focus on performance, and consistency (previous npm package located at [vase-dev](https://www.npmjs.com/package/vase-dev)).
With a goal is to develop an open source, developer friendly end-to-end database sync solution. Subscribe to [vasern-server](https://github.com/ambistudio/vasern-server) to follow vasern's server releases.

Important note: Vasern is currently **available on iOS** under **alpha version**, which expects breaking changes and improvements.

## Table of contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Example](#example)
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

Vasern's design and structures are inspired by various open source databases (mentionable are Realm and PouchDB for code structures), 
which aims for optimizing for ease of development, performance and friendly to developers.

### Supported Data Types
- Basic data types: string, int, double, datetime
- reference "#", optional "?", list "[]"

_(to be updated)_

## Examples

Examples available at "./examples", includes:

- [Vasern Todo](./examples/vasern-todo)

_(to be updated)_

## Contribute, Help and Feedback

Your contribution and feedback are highly welcome and appreciated.

Please [file an issue](https://github.com/ambistudio/vasern/issues) if you need help, found a bug/an improvement or anything we can help. Best to include (1) Goal, (2) Issue, (3) Example code if needed. The more concise and informative, the better it helps us to understand your concern. 