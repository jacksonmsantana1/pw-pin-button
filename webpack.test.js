var path = require('path');

module.exports = {
  context: path.resolve('tests'),
  entry: {
    app: './index',
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
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.es6'],
  },
};
