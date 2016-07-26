var glob = require('glob');
var path = require('path');

var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('../webpack.test.js');

var Testem = require('./testem.js');

var port = 8080;
var host = 'localhost';

glob('./tests/*.spec.js', function (err, files) {
  config.entry = {
    a: [],
  };

  files.forEach(function (file) {
    config.entry[path.basename(file, '.js')] = path.join(__dirname, '../', file);
  });

  config.plugins.push(new webpack.optimize.CommonsChunkPlugin('a', 'a.js'));

  (process.env.NODE_ENV === 'tdd') ?
    startServer(config) :
    createCompiller(config);
});

var startTestem = function (stat) {
  var options = {
    framework: 'mocha',
    launch_in_dev: ['Chrome'],
    serve_files: stat.compilation.chunks.map(value => {
      return `http://${host}:${port}/${value.files[0]}`;
    }),
  };

  var Instance = new Testem;
  Instance.start(options, function () {});

  return Instance;
};

var createCompiller = function (endConfig) {
  return webpack(endConfig, function () {});
};

var startServer = function (endConfig) {
  var testemInstance = false;
  var compiler = webpack(endConfig);

  compiler.plugin('done', stat => {
    !testemInstance && typeof testemInstance === 'boolean' ?
      testemInstance = startTestem(stat) :
      testemInstance.restart();
  });

  return new WebpackDevServer(compiler, {
    noInfo: true,
  }).listen(port, host);
};
