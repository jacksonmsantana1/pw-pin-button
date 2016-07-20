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
      'tests/pw-pin-button.spec.js',
    ],

    preprocessors: {
      'tests/pw-pin-button.spec.js': ['webpack'],
    },

    browsers: [
      //'PhantomJS',
      'Chrome',
    ],

    singleRun: true,

    // Test webpack config
    webpack: require('./webpack.test.js'),

    // Hide webpack build information from output
    webpackMiddleware: {
      noInfo: false,
    },

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-sinon-chai'),
      require('karma-webpack'),
      require('karma-nyan-reporter'),
      //require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
    ],

  });
};

