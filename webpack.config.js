const webpack = require('webpack');

module.exports = {
    entry: {
       main: './app.js',
      'main.min': './app.js'
    },
    output: {
        path: './dist',
        filename: '[name].js',
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
            include: /\.min\.js$/,
            minimize: true
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        })
    ]
}