var Config = require('../node_modules/testem/lib/config.js');
var App = require('../node_modules/testem/lib/app.js');

function Testem() {};

Testem.prototype.start = function (options, finalizer) {
  this.options = options || {};
  this.config = new Config('dev', this.options);
  this.app = new App(this.config, finalizer);
  this.app.start();
};

Testem.prototype.restart = function () {
  this.app.triggerRun('Api: restart');
};

module.exports = Testem;
