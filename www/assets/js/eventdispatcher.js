(function() {
  "use strict";
  var display, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  display = Namespace('SEQ.display');

  masquerade = Namespace('SEQ.masquerade');

  display.EventDispatcher = (function() {
    EventDispatcher.prototype.__eventHashTable = {};

    function EventDispatcher() {
      this.dispatchEvent = __bind(this.dispatchEvent, this);
      this.removeEventListener = __bind(this.removeEventListener, this);
      this.addEventListener = __bind(this.addEventListener, this);
      this.__eventHashTable = {};
    }

    EventDispatcher.prototype.__isFunction = function(functionToCheck) {
      var getType;
      getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
    };

    EventDispatcher.prototype.addEventListener = function(eventType, func) {
      if (this.__eventHashTable[eventType] === undefined) {
        this.__eventHashTable[eventType] = [];
      }
      if (this.__eventHashTable[eventType].indexOf(func) === -1) {
        return this.__eventHashTable[eventType].push(func);
      }
    };

    EventDispatcher.prototype.removeEventListener = function(eventType, func) {
      if (this.__eventHashTable[eventType] === undefined) {
        return false;
      }
      if (this.__eventHashTable[eventType].indexOf(func) > -1) {
        this.__eventHashTable[eventType].splice(this.__eventHashTable[eventType].indexOf(func), 1);
      }
      return true;
    };

    EventDispatcher.prototype.dispatchEvent = function(eventObject) {
      var a, i, targetObject, _results;
      a = this.__eventHashTable[eventObject.eventType];
      if (a === undefined || a.constructor !== Array) {
        return false;
      }
      i = 0;
      targetObject = null;
      _results = [];
      while (i < a.length) {
        targetObject = a[i];
        if (this.__isFunction(targetObject) === false) {
          window.log("EventDispatcher Error this is not a function:" + a[i]);
        }
        if (targetObject !== void 0) {
          targetObject(eventObject);
        }
        _results.push(i++);
      }
      return _results;
    };

    return EventDispatcher;

  })();

  window.EventDispatcher = display.EventDispatcher;

}).call(this);
