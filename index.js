'use strict';

var Context = require('./context');

var lastId = 0;
var all = {};
var isIE = /msie/gi.test(navigator.userAgent);
var noop = function () {};

exports.setup = function (callback, distance) {
  var is = new InfiniteScroll(distance, callback);
  all[is.id] = is;
  is.bind();
  return is.id;
};

exports.clear = function (id) {
  var is = all[id];
  if (is) {
    is.unbind();
  }
};

function InfiniteScroll(distance, callback) {
  this.id = ++lastId;
  this.callback = callback || noop;
  this.distance = (distance || 50) | 0;
  this.updated = true;
  this.context = new Context(this);
}

InfiniteScroll.prototype.bind = function () {
  this._handle = this.handle.bind(this);
  window.addEventListener('scroll', this._handle);
  window.addEventListener('touchmove', this._handle);
};

InfiniteScroll.prototype.unbind = function () {
  window.removeEventListener('scroll', this._handle);
  window.removeEventListener('touchmove', this._handle);
};

InfiniteScroll.prototype.handle = function (e) {
  if (!this.updated) {
    return;
  }

  var pos = getPosition();
  
  if (pos === this.prevPos) {
    return;
  }

  this.prevPos = pos;

  var pageHeight = docHeight();
  var clientHeight = winHeight();;

  if (pageHeight - (pos + clientHeight) < this.distance) {
    this.updated = false;
    this.callback(this.context);
  }
};

function getPosition() {
  var doc = document.documentElement;
  return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
}

function docHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight, 
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
}

// http://stackoverflow.com/a/11744120/2548809
function winHeight() {
  var w = window;
  var d = document;
  var e = d.documentElement;
  var g = d.getElementsByTagName('body')[0];
  return w.innerHeight|| e.clientHeight|| g.clientHeight;
}
