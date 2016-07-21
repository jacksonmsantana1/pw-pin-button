// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
  config.set({
    frameworks: ['mocha'],

    reporters: [
      'nyan',
    ],

    files: [
      'tests/pw-pin-button.spec.js',
    ],

    preprocessors: {
      'tests/pw-pin-button.spec.js': ['webpack', 'sourcemap'],
    },

    browsers: [
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
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-nyan-reporter',
    ],

  });
};

