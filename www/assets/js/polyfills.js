(function() {
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
      "use strict";
      var i, len, _results;
      i = void 0;
      len = void 0;
      i = 0;
      len = this.length;
      _results = [];
      while (i < len) {
        if (i in this) {
          fn.call(scope, this[i], i, this);
        }
        _results.push(++i);
      }
      return _results;
    };
  }


  /*
  Converts the target object to an array.
   */

  window.toArray = function(o) {
    return Array.prototype.slice.call(o);
  };

  Element.prototype.prependChild = function(child) {
    return this.insertBefore(child, this.firstChild);
  };

}).call(this);
