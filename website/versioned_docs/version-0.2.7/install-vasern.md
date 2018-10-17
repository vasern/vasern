---
id: version-0.2.7-install-vasern
title: Installation
original_id: install-vasern
---

Vasern design's goal is to enable easy installation and help you quickly set up your database.


## Install Vasern

---

(Currently, Vasern only available on iOS)

Make sure you have [created React Native app](https://facebook.github.io/react-native/docs/getting-started.html). Navigate to React Native directory, and be ready to run commands on Terminal (MacOS) or Command Promp (Window).

#### 1. Install using NPM:

```ssh
$ npm install --save vasern
```

#### 2. Link Vasern library to your project:

- **Using rnpm - for iOS, run command**:

    ```ssh
    $ rnpm link vasern
    ```

- **Manually - for iOS**:

    - Browse to _"node_packages/vasern/vasern/ios"_, and drag "_Vasern.xcodeproj_" to "_Libraries_" directory on your project in XCode.

    - Add "_libVasern.a_" to "_Build Phase_" > "_Link Binary with Libraries_"


#### 3. Close Metro Bundle, rebuild and restart project.

# What's next?

Learn about [Supported Data Types](supported-data-types.md) or start [Writing Schema](write-schema.md).
