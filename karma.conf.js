// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
  config.set({
    frameworks: [
      'mocha', 'chai', 'sinon', 'sinon-chai',
    ],

    reporters: [
      'nyan',
    ],

    files: [
      'tests/index.js',
    ],

    preprocessors: {
      'tests/index.js': ['webpack'],
    },

    browsers: [
      'PhantomJS',
    ],

    singleRun: true,

    // Test webpack config
    webpack: require('./webpack.test.js'),

    // Hide webpack build information from output
    webpackMiddleware: {
      noInfo: true,
    },

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-sinon-chai'),
      require('karma-webpack'),
      require('karma-nyan-reporter'),
      require('karma-phantomjs-launcher'),
    ],

  });
};

