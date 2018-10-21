---
id: install-vasern
title: Installation
---

Vasern is available on Android and iOS. The following steps will help you install Vasern into your 
React Native project.

## Install Vasern

---

Make sure you have [created React Native app](https://facebook.github.io/react-native/docs/getting-started.html). Navigate to React Native directory, and be ready to run commands on Terminal (MacOS) or Command Promp (Window).

#### 1. Install using NPM:

```ssh
$ npm install --save vasern
```

#### 2. Link Vasern library to your project:

- **Automatic linking - for iOS and Android, run command**:

    ```ssh
    $ react-native link vasern
    ```

- **Manually - for iOS**:

    - Browse to _"node_packages/vasern/vasern/ios"_, and drag "_Vasern.xcodeproj_" to "_Libraries_" directory on your project in XCode.

    - Add "_libVasern.a_" to "_Build Phase_" > "_Link Binary with Libraries_"

- **Manual linking - for Android**:

    1. Open file ``android/app/build.gradle`` from your android main app directory, add ``vasern`` dependency:

        ```diff
        dependencies {
        +   compile project(':vasern')

            implementation fileTree(dir: "libs", include: ["*.jar"])
            implementation "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
            implementation "com.facebook.react:react-native:+"  // From node_modules
        }
        ```
    2. Open file ``android/setting.gradle``

        ```diff
        include ':app'

        + include ':vasern'
        + project(':vasern').projectDir = new File(rootProject.projectDir, '../node_modules/vasern/android')
        ```

    3. Open `android/app/src/main/java/com/your-app-name/MainApplication.java`, add the `RNVasernPackage` dependency.

        ```diff

        // Add this line after "import android.app.Application;"
        + import com.ambistudio.vasern.RNVasernPackage;

        // Add "new RNVasernPackage()" in "getPackages()" method
        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            +    new RNVasernPackage()
            );
        }
        ```

#### 3. Close Metro Bundle, rebuild and restart project.

# What's next?

Learn about [Supported Data Types](supported-data-types.md) or start [Writing Schema](write-schema.md).
