const webpack = require('webpack');

module.exports = {
    entry: './app.js',
    output: {
        path: './dist',
        filename: 'main.js',
        publicPath: "https://cdn.temasys.com.sg/skylink/skylinkjs/0.6.x/skylink.complete.min.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules, vendor)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
}