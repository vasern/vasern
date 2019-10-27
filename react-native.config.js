module.exports = {
    dependency: {
            platforms: {
                ios: {
                    project: './ios/Vasern.xcodeproj',
                    podspecPath: './vasern.podspec'
                },
                android: {
                    sourceDir: './android',
                    manifestPath: 'src/main/AndroidManifest.xml',
                    packageImportPath: 'com.reactlibrary.vasern'
                }
        }
    }
};