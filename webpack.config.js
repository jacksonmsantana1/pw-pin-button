var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.resolve('src'),
  entry: {
    app: './app',
    vendor: ['webcomponents.js', 'typesafety', 'rx', 'data.either', 'data.maybe', 'ramda', 'debug'],
  },
  output: {
    path: path.resolve('build/js/'),
    publicPath: 'public/assets/js/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  ],
  config: {
    devtool: 'eval-source-map',
  },
  devServer: {
    contentBase: 'public',
  },
  module: {
    loaders: [
      {
        test: [/\.es6$/, /\.js$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!autoprefixer-loader',
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!autoprefixer-loader!less-loader',
      },

    ],
  },
  resolve: {
    extensions: ['', '.js', '.es6'],
  },
};
