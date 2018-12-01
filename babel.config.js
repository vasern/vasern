// Temporary config file for Jest
// Issue: https://github.com/facebook/metro/issues/242

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["module:metro-react-native-babel-preset"]
  }
};
