# Vasern Development Roadmap

Vasern is in active development by [Ambi Studio](https://ambi.studio), aims to build a database system for React Native, and React ecosystem.

## Release candidate and earlier - versions <= 0.3.0 RC

- ✅ fsm - embedded storage engine used by Vasern (Native)
- ✅ Modular architecture (allow to create and use plugins) (JavaScript)
- 🔸 Work with flow type (JavaScript)
- 🔸 Support query records with multiple properties and value (Native and JavaScript) 

## Version 0.4

- Full transactional (ACID) support (Native)
- Input sanitizers (avoid invalid inputs that might cause exploits) (Native or JavaScript)

## Version 0.5 

- Migration (Native and JavaScript) 
- Query Observation (keep track of changes and automatically update) (JavaScript)

## Before version 1.0

- Optimize speed and memory for `index_set` (indexing feature) in [fsm](https://github.com/vasern/fsm) (Native)
- Introduce Vasern Playground - A Vasern test server
- Reactjs compatibility
- 🔸 Eliminate critical bugs (on going task)

## Beyond version 1.0

- [vasern-server](https://github.com/vasern/vasern-server), server-client data synchronization
- Authentication
- Consider native and other platforms (Flutter, Ionic, native ios, native android)
- and more...


_Note:_ 

- ✅ task completed, 🔸 task in progress
- **Native** are features implement in native side (C++ / Objective-C / Java)
- **JavaScript** are features implement in JavaScript side.
- This roadmap give a high level of project development and can be updated at any time.
