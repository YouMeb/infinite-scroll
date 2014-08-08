'use strict';

module.exports = Context;

function Context(is) {
  this.is = is;
}

Context.prototype.done = function () {
  this.is.updated = true;
};
