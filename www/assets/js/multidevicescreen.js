(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MultiDeviceScreen = (function(_super) {
    __extends(MultiDeviceScreen, _super);

    MultiDeviceScreen.prototype.__textInput = {};

    function MultiDeviceScreen(domNode) {
      this.__onProfileOkClick = __bind(this.__onProfileOkClick, this);
      MultiDeviceScreen.__super__.constructor.call(this, domNode);
    }

    MultiDeviceScreen.prototype.__init = function() {
      return MultiDeviceScreen.__super__.__init.apply(this, arguments);
    };

    MultiDeviceScreen.prototype.__build = function() {
      MultiDeviceScreen.__super__.__build.apply(this, arguments);
      this.__textInput = this.__domNode.getElementsByTagName('input')[0];
      $(this.__textInput).val(this.__g.localStorageManager.getName());
      return this.__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onProfileOkClick);
    };

    MultiDeviceScreen.prototype.__onProfileOkClick = function(e) {
      if (e.data.label === "validation") {
        e = new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "profile"
        });
        return this.dispatchEvent(e);
      }
    };

    MultiDeviceScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button, e;
      MultiDeviceScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-profile")) {
        e = new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "profile"
        });
        this.dispatchEvent(e);
        return this.__removeInteractivity();
      } else if ($(button).hasClass("button-create")) {
        if (this.__g.localStorageManager.isProfileValid() === false) {
          return this.__g.rootViewController.alert({
            message: "Please complete your player profile to play!",
            label: "validation"
          });
        } else {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "game-options"
          }));
          return this.__removeInteractivity();
        }
      } else if ($(button).hasClass("button-join")) {
        if (this.__g.localStorageManager.isProfileValid() === false) {
          return this.__g.rootViewController.alert({
            message: "Please complete your player profile to play!",
            label: "validation"
          });
        } else {
          this.__g.mdGameManager.reset();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "md-join-game"
          }));
          return this.__removeInteractivity();
        }
      }
    };

    MultiDeviceScreen.prototype.__setInitStyle = function() {
      var element, elements, index, peelOffsetY, _i, _len, _results;
      $(this.__domNode).css("opacity", "0");
      peelOffsetY = -50;
      if (this.__g.rootViewController.isAnimatingForward() === false) {
        peelOffsetY *= -1;
      }
      index = 0;
      elements = $(this.__domNode).find(".animation-peel");
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        TweenMax.set(element, {
          y: peelOffsetY,
          opacity: 0,
          force3D: true
        });
        _results.push(index++);
      }
      return _results;
    };

    MultiDeviceScreen.prototype.__cueIntroAnimation = function() {
      var element, elements, index, length, _i, _len, _results;
      TweenMax.to(this.__domNode, 1, {
        opacity: 1,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd,
        ease: Expo.easeOut
      });
      index = 0;
      elements = $(this.__domNode).find(".animation-peel");
      length = elements.length;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        TweenMax.to(element, 0.75, {
          y: 0,
          opacity: 1,
          delay: index * 0.05,
          ease: Expo.easeOut
        });
        _results.push(index++);
      }
      return _results;
    };

    MultiDeviceScreen.prototype.__cueOutroAnimation = function() {
      var element, elements, index, length, peelOffsetX, _i, _len, _results;
      TweenMax.to(this.__domNode, 0.5, {
        opacity: 0,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd,
        ease: Expo.easeIn
      });
      peelOffsetX = 50;
      if (this.__g.rootViewController.isAnimatingForward() === false) {
        peelOffsetX *= -1;
      }
      index = 0;
      elements = $(this.__domNode).find(".animation-peel");
      length = elements.length;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        TweenMax.to(element, 0.375, {
          y: peelOffsetX,
          opacity: 0,
          delay: ((length - 1) - index) * 0.025,
          ease: Expo.easeIn
        });
        _results.push(index++);
      }
      return _results;
    };

    MultiDeviceScreen.prototype.screenStart = function() {
      return MultiDeviceScreen.__super__.screenStart.apply(this, arguments);
    };

    MultiDeviceScreen.prototype.introStart = function() {
      var timeout;
      MultiDeviceScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.BLUE ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.BLUE);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MultiDeviceScreen.prototype.outroStart = function() {
      MultiDeviceScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MultiDeviceScreen.prototype.screenEnd = function() {
      MultiDeviceScreen.__super__.screenEnd.apply(this, arguments);
      return this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, this.__onProfileOkClick);
    };

    return MultiDeviceScreen;

  })(masquerade.Screen);

}).call(this);
