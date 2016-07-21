var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve('tests'),
  entry: {
    app: './pw-pin-button.spec.js',
  },
  output: {
    path: path.resolve('build/tests/'),
    filename: 'test.js',
  },
  config: {
    devtool: 'eval-source-map',
  },
  module: {
    loaders: [
      {
        test: [/\.es6$/, /\.js$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, 
    ],
    noParse: [
      /node_modules\/sinon\//,
    ],
  },
  plugins: [],
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon'
    },
    extensions: ['', '.js', '.es6'],
  },
};
