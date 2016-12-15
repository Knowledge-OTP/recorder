const webpack = require('webpack');

module.exports = {
    entry: './app.js',
    output: {
        path: './dist',
        filename: 'main.js',
        libraryTarget: 'var',
        library: 'RaccoonRecorder'
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
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        })
    ]
}