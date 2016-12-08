// Karma configuration
// info: https://karma-runner.github.io/0.8/config/configuration-file.html

var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
        'test/**/*.spec.js',
       { pattern: 'index.html', included: false, served: false },
    ],

    preprocessors: {
       'test/**/*.spec.js': ['webpack'],
    },
  
    webpack: webpackConfig, 

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
