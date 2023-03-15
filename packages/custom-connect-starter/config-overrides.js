const webpack = require('webpack');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        string_decoder: require.resolve('string_decoder/'),
        buffer: require.resolve('buffer'),
    };

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    );

    return config;
};
