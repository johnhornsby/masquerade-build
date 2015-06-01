(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.InteractiveElement = (function(_super) {
    __extends(InteractiveElement, _super);

    InteractiveElement.prototype.__g = masquerade.Globals;

    InteractiveElement.prototype.__fastClickInstances = [];

    InteractiveElement.prototype.__buttonInstances = [];

    InteractiveElement.prototype.__domNode = {};

    InteractiveElement.prototype.__animationMode = "";

    InteractiveElement.prototype.__name = "";

    function InteractiveElement(domNode) {
      this.__animationEnd = __bind(this.__animationEnd, this);
      this.__animationIteration = __bind(this.__animationIteration, this);
      this.__animationStart = __bind(this.__animationStart, this);
      this.__onButtonClick = __bind(this.__onButtonClick, this);
      InteractiveElement.__super__.constructor.apply(this, arguments);
      this.__domNode = domNode;
      this.__fastClickInstances = [];
      this.__buttonInstances = [];
      this.__animationMode = "";
      this.__name = "";
      this.__init();
    }

    InteractiveElement.prototype.__init = function() {
      this.__name = this.__domNode.className.substring(this.__domNode.className.indexOf("-") + 1);
      this.__name = this.__name.substring(0, this.__name.indexOf(" "));
      this.__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE;
      if (this.__g.useTweenMax === false) {
        this.__domNode.addEventListener("webkitAnimationStart", this.__animationStart, false);
        this.__domNode.addEventListener("webkitAnimationIteration", this.__animationIteration, false);
        this.__domNode.addEventListener("webkitAnimationEnd", this.__animationEnd, false);
        this.__domNode.addEventListener("webkitTransitionStart", this.__animationStart, false);
        this.__domNode.addEventListener("webkitTransitionEnd", this.__animationEnd, false);
      }
      return this.__build();
    };

    InteractiveElement.prototype.__build = function() {
      var button, buttons, _i, _len;
      this.__g.debug("" + this.__name + " build()");
      this.__fastClickInstances = [];
      this.__buttonInstances = [];
      buttons = this.__domNode.getElementsByClassName("button");
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        button = buttons[_i];
        button.name = button.className.substring(button.className.indexOf("-") + 1).split(" ")[0];
        this.__buttonInstances.push(button);
        this.__fastClickInstances.push(new FastClick(button));
      }
      this.__g.translationManager.translateDomNode(this.__domNode);
      return null;
    };

    InteractiveElement.prototype.__onButtonClick = function(mouseEvent) {
      var buttonNode, className, name;
      buttonNode = mouseEvent.currentTarget;
      className = buttonNode.className;
      name = className.substring(className.indexOf("-") + 1).split(" ")[0];
      this.__g.debug("interactiveelement __onButtonClick() Button Clicked:" + name);
      return this.__handleButtonEvent(mouseEvent);
    };

    InteractiveElement.prototype.__handleButtonEvent = function(mouseEvent) {};

    InteractiveElement.prototype.__animationStart = function(e) {
      if (this.__g.useTweenMax === false) {
        if (e.currentTarget !== e.target) {
          e.stopPropagation();
          return 0;
        }
      }
      if (this.__animationMode === masquerade.InteractiveElement.ANIMATION_MODE_IN) {
        return this.dispatchEvent(new events.Event(masquerade.InteractiveElement.INTRO_START));
      } else if (this.__animationMode === masquerade.InteractiveElement.ANIMATION_MODE_OUT) {
        return this.dispatchEvent(new events.Event(masquerade.InteractiveElement.OUTRO_START));
      }
    };

    InteractiveElement.prototype.__animationIteration = function(e) {};

    InteractiveElement.prototype.__animationEnd = function(e) {
      if (this.__g.useTweenMax === false) {
        if (e.currentTarget !== e.target) {
          e.stopPropagation();
          return 0;
        }
      }
      if (this.__animationMode === masquerade.InteractiveElement.ANIMATION_MODE_IN) {
        this.__introComplete();
      } else {
        this.__outroComtplete();
      }
      return this.__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE;
    };

    InteractiveElement.prototype.__introComplete = function() {
      this.dispatchEvent(new events.Event(masquerade.InteractiveElement.INTRO_COMPLETE));
      $(this.__domNode).removeClass("fadeInEnable");
      $(this.__domNode).removeClass("pullInEnable");
      $(this.__domNode).removeClass("slideInRightEnable");
      $(this.__domNode).removeClass("slideUpEnable");
      return this.__addInteractivity();
    };

    InteractiveElement.prototype.__outroComtplete = function() {
      return this.dispatchEvent(new events.Event(masquerade.InteractiveElement.OUTRO_COMPLETE));
    };

    InteractiveElement.prototype.__getButtonWithName = function(name) {
      var button, _i, _len, _ref;
      _ref = this.__buttonInstances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        if (button.name === name) {
          return button;
        }
      }
      return void 0;
    };

    InteractiveElement.prototype.__removeInteractivity = function(debug) {
      var buttonInstance, fastClickInstance, _i, _j, _len, _len1, _ref, _ref1;
      if (debug == null) {
        debug = true;
      }
      _ref = this.__fastClickInstances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fastClickInstance = _ref[_i];
        fastClickInstance.destroy();
      }
      this.__fastClickInstances = [];
      _ref1 = this.__buttonInstances;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        buttonInstance = _ref1[_j];
        buttonInstance.removeEventListener("click", this.__onButtonClick, false);
      }
      return this.__buttonInstances = [];
    };

    InteractiveElement.prototype.__addInteractivity = function() {
      var button, buttonInstance, buttons, _i, _j, _len, _len1, _ref, _results;
      this.__removeInteractivity(false);
      buttons = this.__domNode.getElementsByClassName("button");
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        button = buttons[_i];
        button.name = button.className.substring(button.className.indexOf("-") + 1).split(" ")[0];
        this.__buttonInstances.push(button);
        this.__fastClickInstances.push(new FastClick(button));
      }
      _ref = this.__buttonInstances;
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        buttonInstance = _ref[_j];
        _results.push(buttonInstance.addEventListener("click", this.__onButtonClick, false));
      }
      return _results;
    };

    InteractiveElement.prototype.getDomNode = function() {
      return this.__domNode;
    };

    InteractiveElement.prototype.getName = function() {
      return this.__name;
    };

    InteractiveElement.prototype.introStart = function() {
      this.__g.debug("" + this.__name + " introStart()");
      return this.__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_IN;
    };

    InteractiveElement.prototype.screenStart = function() {
      return this.__g.debug("" + this.__name + " screenStart()");
    };

    InteractiveElement.prototype.outroStart = function() {
      this.__g.debug("" + this.__name + " outroStart()");
      this.__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_OUT;
      $(this.__domNode).removeClass("fadeOutEnable");
      $(this.__domNode).removeClass("pullOutEnable");
      return $(this.__domNode).removeClass("slideOutLeftEnable");
    };

    InteractiveElement.prototype.screenEnd = function() {
      var e, hasParent, message, parent;
      this.__g.debug("" + this.__name + " screenEnd()");
      this.__removeInteractivity();
      this.__domNode.removeEventListener("webkitAnimationStart", this.__animationStart, false);
      this.__domNode.removeEventListener("webkitAnimationIteration", this.__animationIteration, false);
      this.__domNode.removeEventListener("webkitAnimationEnd", this.__animationEnd, false);
      this.__domNode.removeEventListener("webkitTransitionStart", this.__animationStart, false);
      this.__domNode.removeEventListener("webkitTransitionEnd", this.__animationEnd, false);
      try {
        hasParent = true;
        if (this.__domNode.parentNode === void 0) {
          hasParent = false;
        }
        this.__g.debug("" + this.__name + " screenEnd() @__domNode.className:" + this.__domNode.className + " hasParent:" + hasParent);
        parent = $(this.__domNode).parent();
        if (parent.length !== 0) {
          $(this.__domNode).remove();
        }
      } catch (_error) {
        e = _error;
        message = "" + this.__name + " " + e + " screenEnd() unable to removeChild domeNode:" + this.__domNode;
        console.warn(message);
        this.__g.debug(message);
      }
      return this.__domNode = null;
    };

    return InteractiveElement;

  })(display.EventDispatcher);

  masquerade.InteractiveElement.INTRO_START = "introStart";

  masquerade.InteractiveElement.INTRO_COMPLETE = "introComplete";

  masquerade.InteractiveElement.OUTRO_START = "outroStart";

  masquerade.InteractiveElement.OUTRO_COMPLETE = "outroComplete";

  masquerade.InteractiveElement.BUTTON_CLICK = "buttonClick";

  masquerade.InteractiveElement.NAVIGATE_TO = "navigateTo";

  masquerade.InteractiveElement.ANIMATION_MODE_IN = "animationIn";

  masquerade.InteractiveElement.ANIMATION_MODE_OUT = "animationOut";

  masquerade.InteractiveElement.ANIMATION_MODE_NONE = "animationNone";

}).call(this);
