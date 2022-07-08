module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: "./",
          alias: {
            components: "./components",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        "react-native-reanimated/plugin",
      ],
    ],
  };
};
