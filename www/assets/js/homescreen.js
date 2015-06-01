(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.HomeScreen = (function(_super) {
    __extends(HomeScreen, _super);

    function HomeScreen(domNode) {
      HomeScreen.__super__.constructor.call(this, domNode);
      this.__scrollPanelViewController = {};
    }

    HomeScreen.prototype.__init = function() {
      HomeScreen.__super__.__init.apply(this, arguments);
      return this.__g.resetDebugger();
    };

    HomeScreen.prototype.__build = function() {
      return HomeScreen.__super__.__build.apply(this, arguments);
    };

    HomeScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      window.log("home __handleButtonEvent()");
      HomeScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-choose-device")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "choose-device"
        }));
      }
      if ($(button).hasClass("button-how-to-play")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "how-to-play"
        }));
      }
      if ($(button).hasClass("button-high-scores")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "high-scores"
        }));
      }
      if ($(button).hasClass("button-settings")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "settings"
        }));
      }
      return this.__removeInteractivity();
    };

    HomeScreen.prototype.__introComplete = function() {
      HomeScreen.__super__.__introComplete.apply(this, arguments);
      return window.log("home __introComplete()");
    };

    HomeScreen.prototype.__placeFooter = function() {
      var footer, footerHeight, footerTop, screenHeight;
      footer = this.__domNode.getElementsByTagName("footer")[0];
      footerHeight = footer.clientHeight;
      footerTop = footer.offsetTop;
      screenHeight = window.innerHeight;
      footer.style.marginTop = String(screenHeight - (footerHeight + footerTop + this.__g.statusBarOffset)) + "px";
      if ($(footer).offset().top > $(footer).prev().offset().top + $(footer).prev().height()) {
        return this.__domNode.getElementsByTagName("footer")[0].style.visibility = "visible";
      } else {
        return this.__domNode.getElementsByTagName("footer")[0].style.visibility = "hidden";
      }
    };

    HomeScreen.prototype.__sendCallToServerSuccess = function(data) {
      return $(".debug-output").html(JSON.stringify(data));
    };

    HomeScreen.prototype.__sendCallToServerError = function(data) {
      var key, _results;
      window.log("error " + data);
      _results = [];
      for (key in data) {
        _results.push(window.log(("" + key + " - ") + data[key]));
      }
      return _results;
    };

    HomeScreen.prototype.__setInitStyle = function() {
      var element, elements, index, peelOffsetX, _i, _len, _results;
      $(this.__domNode).css("opacity", "0");
      peelOffsetX = 50;
      index = 0;
      TweenMax.set($(this.__domNode).find(".image-home-header"), {
        scaleX: 1.2,
        scaleY: 1.2,
        force3D: true
      });
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

    HomeScreen.prototype.__cueIntroAnimation = function() {
      var element, elements, index, length, _i, _len, _results;
      TweenMax.to(this.__domNode, 1, {
        opacity: 1,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd,
        ease: Expo.easeOut
      });
      TweenMax.to($(this.__domNode).find(".image-home-header"), 1, {
        scaleX: 1,
        scaleY: 1,
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

    HomeScreen.prototype.__cueOutroAnimation = function() {
      var element, elements, index, length, peelOffsetX, _i, _len, _results;
      TweenMax.to(this.__domNode, 0.5, {
        opacity: 0,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd,
        ease: Expo.easeIn
      });
      TweenMax.to($(this.__domNode).find(".image-home-header"), 0.5, {
        scaleX: 1.2,
        scaleY: 1.2,
        ease: Expo.easeIn
      });
      peelOffsetX = 50;
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

    HomeScreen.prototype.screenStart = function() {
      return HomeScreen.__super__.screenStart.apply(this, arguments);
    };

    HomeScreen.prototype.introStart = function() {
      var timeout;
      HomeScreen.__super__.introStart.apply(this, arguments);
      this.__waitingCircle = new masquerade.WaitingCircle("waiting-for-server");
      this.__waitingCircle.start();
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.GREEN ? 100 : 1000;
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      setTimeout((function(_this) {
        return function() {
          return _this.__placeFooter();
        };
      })(this), timeout);
      this.__g.navigationBar.drawNavigationButtons([], false);
      return this.__fadeColorTo(masquerade.ColourManager.GREEN);
    };

    HomeScreen.prototype.outroStart = function() {
      HomeScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    HomeScreen.prototype.screenEnd = function() {
      return HomeScreen.__super__.screenEnd.apply(this, arguments);
    };

    return HomeScreen;

  })(masquerade.Screen);

}).call(this);
