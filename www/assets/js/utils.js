(function() {
  var _base;

  if (window.SEQ == null) {
    window.SEQ = {};
  }

  if ((_base = window.SEQ).utils == null) {
    _base.utils = {};
  }

  window.Namespace = function(ns_string) {
    var i, parent, parts;
    parts = ns_string.split(".");
    parent = SEQ;
    i = void 0;
    if (parts[0] === "SEQ") {
      parts = parts.slice(1);
    }
    i = 0;
    while (i < parts.length) {
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
      i += 1;
    }
    return parent;
  };

  window.log = function() {
    var newarr;
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
      arguments.callee = arguments.callee.caller;
      newarr = [].slice.call(arguments);
      if (typeof console.log === "object") {
        return log.apply.call(console.log, console, newarr);
      } else {
        return console.log.apply(console, newarr);
      }
    }
  };

  (function(b) {
    var a, c, d, _results;
    c = function() {};
    d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(",");
    a = void 0;
    _results = [];
    while (a = d.pop()) {
      _results.push(b[a] = b[a] || c);
    }
    return _results;
  })((function() {
    var err;
    try {
      console.log();
      return window.console;
    } catch (_error) {
      err = _error;
      return window.console = {};
    }
  })());

  window.isFunction = function(functionToCheck) {
    var getType;
    getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
  };

  window.isAlphaNumeric = function(str) {
    return str.match(/^[a-zA-Z0-9]*$/);
  };

  window.getUrlVars = function() {
    var anchorHash, hash, hashes, i, vars;
    i = void 0;
    vars = [];
    hash = void 0;
    anchorHash = void 0;
    hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    i = 0;
    while (i < hashes.length) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
      if (i === hashes.length - 1) {
        anchorHash = hash[1].split("#");
        vars[hash[0]] = anchorHash[0];
        if (anchorHash.length > 0) {
          vars["#"] = anchorHash[1];
        }
      }
      i = i + 1;
    }
    return vars;
  };

}).call(this);
