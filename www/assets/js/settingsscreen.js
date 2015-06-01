(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.SettingsScreen = (function(_super) {
    __extends(SettingsScreen, _super);

    SettingsScreen.prototype.__isCharacterLimitShort = true;

    SettingsScreen.prototype.__activeFrame = void 0;

    SettingsScreen.prototype.__previousFrame = void 0;

    SettingsScreen.prototype.__frames = [];

    SettingsScreen.prototype.__frameAnimationTime = 0.25;

    function SettingsScreen(domNode) {
      this.__onBackClick = __bind(this.__onBackClick, this);
      this.__onAlertOkClick = __bind(this.__onAlertOkClick, this);
      SettingsScreen.__super__.constructor.call(this, domNode);
      this.__isCharacterLimitShort = true;
    }

    SettingsScreen.prototype.__init = function() {
      return SettingsScreen.__super__.__init.apply(this, arguments);
    };

    SettingsScreen.prototype.__build = function() {
      SettingsScreen.__super__.__build.apply(this, arguments);
      this.__frames = $("frame");
      return this.__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
    };

    SettingsScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      SettingsScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-character-short")) {
        this.__toggleCharacterLimitButtons(150);
      }
      if ($(button).hasClass("button-character-long")) {
        this.__toggleCharacterLimitButtons(400);
      }
      if ($(button).hasClass("button-reset-scores")) {
        setTimeout((function(_this) {
          return function() {
            return _this.__g.rootViewController.alert({
              message: "Are you sure?",
              ok: "Yes",
              cancel: "No",
              label: "reset-scores"
            });
          };
        })(this), 33);
      }
      if ($(button).hasClass("button-language")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "language"
        }));
      }
      if ($(button).hasClass("button-profile")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "profile"
        }));
      }
      if ($(button).hasClass("button-log")) {
        this.__showFrame2();
      }
      if ($(button).hasClass("button-reset-log")) {
        return setTimeout((function(_this) {
          return function() {
            return _this.__g.rootViewController.alert({
              message: "Are you sure?",
              ok: "Yes",
              cancel: "No",
              label: "reset-log"
            });
          };
        })(this), 33);
      }
    };

    SettingsScreen.prototype.__toggleCharacterLimitButtons = function(isShort) {
      var longBackColour, longTextColour, shortBackColour, shortTextColour;
      shortBackColour = this.__g.colourManager.getInvertBaseColour();
      shortTextColour = this.__g.colourManager.getCurrentColour();
      longBackColour = this.__g.colourManager.getCurrentColour();
      longTextColour = this.__g.colourManager.getInvertBaseColour();
      if (isShort !== 150) {
        this.__isCharacterLimitShort = false;
        this.__g.localStorageManager.setCharacterLimit(400);
        shortBackColour = this.__g.colourManager.getCurrentColour();
        shortTextColour = this.__g.colourManager.getInvertBaseColour();
        longBackColour = this.__g.colourManager.getInvertBaseColour();
        longTextColour = this.__g.colourManager.getCurrentColour();
      } else {
        this.__g.localStorageManager.setCharacterLimit(150);
      }
      $(this.__domNode).find(".button-character-short").css("background-color", shortBackColour);
      $(this.__domNode).find(".button-character-short").css("color", shortTextColour);
      $(this.__domNode).find(".button-character-long").css("background-color", longBackColour);
      return $(this.__domNode).find(".button-character-long").css("color", longTextColour);
    };

    SettingsScreen.prototype.__onAlertOkClick = function(e) {
      if (e.data.label === "reset-scores") {
        this.__g.localStorageManager.clearHighScores();
        this.__g.localStorageManager.resetLog();
        this.__g.mdGameManager.reset();
        this.__g.localStorageManager.setGender(void 0);
        this.__g.localStorageManager.setName("");
        this.__g.localStorageManager.setAge(0);
        this.__g.localStorageManager.setIsInActiveGame(false);
        this.__g.localStorageManager.clearActivePin();
        this.__g.localStorageManager.setPrivacy("true");
        this.__g.localStorageManager.setCharacterLimit(150);
        this.__toggleCharacterLimitButtons(150);
      }
      if (e.data.label === "reset-log") {
        return this.__g.localStorageManager.resetLog();
      }
    };

    SettingsScreen.prototype.__showFrame1 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-1").get(0);
      if (this.__previousFrame === $(".frame-2").get(0)) {
        TweenMax.set(this.__activeFrame, {
          scaleX: 1.3,
          scaleY: 1.3,
          opacity: 0,
          display: "block"
        });
        TweenMax.to(this.__previousFrame, 0.25, {
          scaleX: 0.8,
          scaleY: 0.8,
          opacity: 0,
          force3D: true,
          onComplete: this.__hidePreviousFrame,
          ease: Sine.easeIn
        });
        TweenMax.to(this.__activeFrame, 0.25, {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          force3D: true,
          delay: 0.1,
          ease: Sine.easeOut
        });
      } else {
        TweenMax.set(this.__activeFrame, {
          scaleX: 1.3,
          scaleY: 1.3,
          opacity: 0,
          display: "block"
        });
        TweenMax.to(this.__activeFrame, 0.25, {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          force3D: true,
          delay: 0.1,
          ease: Sine.easeOut
        });
      }
      this.__releaseNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["back"]);
    };

    SettingsScreen.prototype.__showFrame2 = function() {
      var log;
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-2").get(0);
      log = this.__g.localStorageManager.getLog();
      $(this.__activeFrame).find("textarea").val(log);
      TweenMax.set(this.__activeFrame, {
        scaleX: 0.8,
        scaleY: 0.8,
        opacity: 0,
        display: "block"
      });
      TweenMax.to(this.__previousFrame, 0.25, {
        scaleX: 1.3,
        scaleY: 1.3,
        opacity: 0,
        force3D: true,
        onComplete: this.__hidePreviousFrame,
        ease: Sine.easeIn
      });
      TweenMax.to(this.__activeFrame, 0.25, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        delay: 0.1,
        force3D: true,
        ease: Sine.easeOut
      });
      this.__hijackNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["back"]);
    };

    SettingsScreen.prototype.__initialiseFrame = function() {
      var paddingTopString, style, width;
      paddingTopString = $(this.__domNode).css("padding-top");
      width = $(this.__domNode).width();
      style = {
        x: "0px",
        scaleX: 1,
        scaleY: 1,
        opacity: 0,
        display: "none",
        position: "absolute",
        top: paddingTopString,
        width: width + "px"
      };
      TweenMax.set($(".frame-1")[0], style);
      TweenMax.set($(".frame-2")[0], style);
      return this.__showFrame1();
    };

    SettingsScreen.prototype.__killTweenMax = function() {
      return $(".frame").each(function() {
        return TweenMax.killTweensOf(this);
      });
    };

    SettingsScreen.prototype.__onBackClick = function() {
      return this.__showFrame1();
    };

    SettingsScreen.prototype.__hijackNavigation = function() {
      this.__g.rootViewController.setListenToNavigationEvents(false);
      return this.__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
    };

    SettingsScreen.prototype.__releaseNavigation = function() {
      this.__g.rootViewController.setListenToNavigationEvents(true);
      return this.__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
    };

    SettingsScreen.prototype.screenStart = function() {
      return SettingsScreen.__super__.screenStart.apply(this, arguments);
    };

    SettingsScreen.prototype.introStart = function() {
      var cl, timeout;
      SettingsScreen.__super__.introStart.apply(this, arguments);
      if (masquerade.Globals.isDebugging === true) {
        $(this.__domNode).find(".button-log").show();
        $(this.__domNode).find(".button-reset-log").show();
      } else {
        $(this.__domNode).find(".button-log").hide();
        $(this.__domNode).find(".button-reset-log").hide();
      }
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.GREEN ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.GREEN);
      cl = this.__g.localStorageManager.getCharacterLimit();
      this.__toggleCharacterLimitButtons(cl);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    SettingsScreen.prototype.outroStart = function() {
      SettingsScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    SettingsScreen.prototype.screenEnd = function() {
      SettingsScreen.__super__.screenEnd.apply(this, arguments);
      return this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
    };

    return SettingsScreen;

  })(masquerade.MDScreen);

}).call(this);
