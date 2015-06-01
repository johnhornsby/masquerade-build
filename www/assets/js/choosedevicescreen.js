(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ChooseDeviceScreen = (function(_super) {
    __extends(ChooseDeviceScreen, _super);

    ChooseDeviceScreen.prototype.__isNavigatingBack = false;

    function ChooseDeviceScreen(domNode) {
      ChooseDeviceScreen.__super__.constructor.call(this, domNode);
    }

    ChooseDeviceScreen.prototype.__init = function() {
      return ChooseDeviceScreen.__super__.__init.apply(this, arguments);
    };

    ChooseDeviceScreen.prototype.__build = function() {
      return ChooseDeviceScreen.__super__.__build.apply(this, arguments);
    };

    ChooseDeviceScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ChooseDeviceScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-single-device")) {
        this.__g.mdGameManager.reset();
        this.__g.isMultiDevice = false;
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "game-options"
        }));
      }
      if ($(button).hasClass("button-multi-device")) {
        this.__g.isMultiDevice = true;
        if (this.__g.mdGameManager.shouldTryToRecconect()) {
          this.__g.mdGameManager.reconnect();
        } else {
          this.__removeAllServerActiveAnimation();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "multi-device"
          }));
        }
      }
      return this.__removeInteractivity();
    };

    ChooseDeviceScreen.prototype.__setInitStyle = function() {
      var element, elements, index, peelOffsetX, _i, _len, _results;
      $(this.__domNode).css("opacity", "0");
      peelOffsetX = -50;
      if (this.__g.rootViewController.isAnimatingForward() === false) {
        peelOffsetX *= -1;
      }
      index = 0;
      elements = $(this.__domNode).find(".animation-peel");
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        TweenMax.set(element, {
          y: peelOffsetX,
          opacity: 0,
          force3D: true
        });
        _results.push(index++);
      }
      return _results;
    };

    ChooseDeviceScreen.prototype.__cueIntroAnimation = function() {
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

    ChooseDeviceScreen.prototype.__cueOutroAnimation = function() {
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

    ChooseDeviceScreen.prototype.introStart = function() {
      var timeout;
      ChooseDeviceScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.GREEN ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.GREEN);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    ChooseDeviceScreen.prototype.outroStart = function() {
      ChooseDeviceScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ChooseDeviceScreen.prototype.screenEnd = function() {
      return ChooseDeviceScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ChooseDeviceScreen;

  })(masquerade.MDScreen);

}).call(this);
