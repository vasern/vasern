import com.ambistudio.vasern.RNVasernPackage;

protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CustomToastPackage()); // <-- Add this line with your package name.
}