const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: {
    leaflet: {
      commonjs: "leaflet",
      commonjs2: "leaflet",
      amd: "leaflet",
      root: "L",
    },
  },
  output: {
    filename: "leaflet.fullscreen2.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "leaflet.fullscreen2",
      type: "umd",
    },
  },
};
