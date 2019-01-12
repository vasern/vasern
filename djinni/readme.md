# Generate types binding interface with Djinni React Native

[Djinni React Native](https://github.com/sulewicz/djinni-react-native) is a fork of [Djinni](https://github.com/dropbox/djinni), a tool used for generating cross-language type binding interface from C++. Djinni React Native also support types that works on React Native (for example JavascriptMap, JavascriptArray).

## Using Djinni

Ideally, djinni is used for Vasern "internal development" purpose. 
If you are using an official version of Vasern, you should not worry about using Djinni.

**Before you start**:

- Make sure Djinni React Native is installed. Install Djinni React Native from Github:
    ```sh
    $ yarn install sulewicz/djinni-react-native --dev
    ```
- Make sure `djinni` folder is placed under `vasern/djinni`
- Make sure directory configurations within `vasern/djinni/run.sh` is correctly configured


**Generate type binding**:

1. (optional) Chmod `vasern/djinni/run.sh` to be executable
2. Navigate to `vasern/djinni`
3. Run command below to generate type binding
    ```ssh
    $ ./run.sh
    ```

**Post-installation**:

Replace the whole `Startup` @ReactMethod located at `vasern/android/src/main/jni/java/vasern/VasernManager.java` with:

```java
@ReactMethod
public void Startup(ReadableMap schema, Promise promise) {
    mModule.Startup(
        getReactApplicationContext().getFilesDir().getPath(),
        ReactDjinni.wrap(schema), 
        ReactDjinni.wrap(promise));
}
```


More details about Djinni React Native: https://github.com/sulewicz/djinni-react-native