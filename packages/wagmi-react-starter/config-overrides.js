const webpack = require('webpack');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        string_decoder: require.resolve('string_decoder/'),
    };

    const plugin = new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    });

    config.plugins.unshift(plugin);

    return config;
};
