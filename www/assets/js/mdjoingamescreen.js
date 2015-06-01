(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDJoinGameScreen = (function(_super) {
    var __isValid;

    __extends(MDJoinGameScreen, _super);

    MDJoinGameScreen.prototype.__pin = "";

    __isValid = false;

    function MDJoinGameScreen(domNode) {
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      MDJoinGameScreen.__super__.constructor.call(this, domNode);
    }

    MDJoinGameScreen.prototype.__init = function() {
      return MDJoinGameScreen.__super__.__init.apply(this, arguments);
    };

    MDJoinGameScreen.prototype.__build = function() {
      return MDJoinGameScreen.__super__.__build.apply(this, arguments);
    };

    MDJoinGameScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button, pin;
      MDJoinGameScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        this.__isValid = false;
        if ($("input").val() !== "") {
          pin = $.trim($("input").val()).toUpperCase();
          if (pin.length === 5 && isAlphaNumeric(pin)) {
            this.__pin = pin;
            this.__isValid = true;
          }
        }
        if (this.__isValid) {
          this.__removeInteractivity();
          return this.__g.mdGameManager.joinGame(this.__pin);
        } else {
          this.__removeAllServerActiveAnimation();
          return this.__g.rootViewController.alert({
            message: "Please enter your pin correctly!",
            label: "validation"
          });
        }
      }
    };

    MDJoinGameScreen.prototype.__checkWithGameManager = function() {
      MDJoinGameScreen.__super__.__checkWithGameManager.apply(this, arguments);
      this.__g.debug("MDJoinGame __checkWithGameManager()");
      if (this.__g.mdGameManager.hasJoined()) {
        if (this.__activeFrame !== $(".frame-2")[0]) {
          this.__showFrame2();
          this.__g.navigationBar.drawNavigationButtons(["pause"]);
          return $(this.__domNode).find(".frame-2 input").val(this.__g.mdGameManager.getPin());
        }
      } else {
        if (this.__activeFrame !== $(".frame-1")[0]) {
          this.__showFrame1();
          this.__g.navigationBar.drawNavigationButtons(["back"]);
        }
        return this.__addInteractivity();
      }
    };

    MDJoinGameScreen.prototype.__showFrame1 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-1").get(0);
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
      this.__isWaitingForServer = false;
      return this.__hideWaitingCircle();
    };

    MDJoinGameScreen.prototype.__showFrame2 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-2").get(0);
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
        delay: 0.2,
        force3D: true,
        ease: Sine.easeOut
      });
      return this.__showWaitingCircle();
    };

    MDJoinGameScreen.prototype.__initialiseFrame = function() {
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

    MDJoinGameScreen.prototype.introStart = function() {
      var timeout;
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.BLUE ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.BLUE);
      if (this.__g.mdGameManager.isCreator()) {
        $(".is-joiner").hide();
        this.__pin = this.__g.mdGameManager.getPin();
        $("input").val(this.__pin);
      } else {
        $(".is-creator").hide();
      }
      MDJoinGameScreen.__super__.introStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDJoinGameScreen.prototype.screenStart = function() {
      return MDJoinGameScreen.__super__.screenStart.apply(this, arguments);
    };

    MDJoinGameScreen.prototype.outroStart = function() {
      MDJoinGameScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDJoinGameScreen.prototype.screenEnd = function() {
      return MDJoinGameScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDJoinGameScreen;

  })(masquerade.MDScreen);

}).call(this);
