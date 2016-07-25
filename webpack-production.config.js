var WebpackStrip = require('strip-loader');
var join = require('path').join;
var WebpackStrip = require('strip-loader');
var include = join(__dirname, 'src');
var stripLoader = {
  test: [/\.js$/, /\.es6$/],
  exclude: /node_modules/,
  loader: WebpackStrip.loader('console.log'), //Will remove all console.log from the code
};

module.exports = {
  entry: './src/pw-pin-button/pw-pin-button',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'pwpinbutton',
  },
  devtool: 'source-map',
  module: {
    loaders: [{ test: /\.js$/, loader: 'babel', include }, stripLoader]
  },
}
