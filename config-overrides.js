const webpack = require("webpack");

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    process: require.resolve("process/browser"),
  };

  const plugin = new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
  });

  config.plugins.unshift(plugin);

  config.plugins.unshift(
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
