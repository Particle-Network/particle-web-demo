const webpack = require('webpack');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        querystring: require.resolve('querystring-es3'),
        zlib: require.resolve('browserify-zlib'),
    };
    const plugin = new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    });

    config.plugins.unshift(plugin);

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    );

    if (process.env.REACT_APP_PARTICLE_ENV === 'production') {
        config.optimization.minimizer[0].options.minimizer.options.compress = {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.table'],
        };
    }

    config.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    });

    return config;
};
