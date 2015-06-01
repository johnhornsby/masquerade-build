(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.GameOptionsScreen = (function(_super) {
    __extends(GameOptionsScreen, _super);

    function GameOptionsScreen(domNode) {
      this.__onServerError = __bind(this.__onServerError, this);
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      this.__onBackClick = __bind(this.__onBackClick, this);
      GameOptionsScreen.__super__.constructor.call(this, domNode);
    }

    GameOptionsScreen.prototype.__init = function() {
      return GameOptionsScreen.__super__.__init.apply(this, arguments);
    };

    GameOptionsScreen.prototype.__build = function() {
      return GameOptionsScreen.__super__.__build.apply(this, arguments);
    };

    GameOptionsScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      GameOptionsScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-training-mode")) {
        this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE);
        this.__g.gameManager.setPlayerNames("Judge", "Player A", "Player B");
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "choose-characteristic"
        }));
      }
      if ($(button).hasClass("button-single-round")) {
        this.__g.isSingleRound = true;
        if (this.__g.isMultiDevice) {
          this.__g.mdGameManager.reset();
          this.__g.mdGameManager.createGame();
          this.__removeInteractivity();
        } else {
          this.__removeAllServerActiveAnimation();
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND);
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "who-is-playing"
          }));
          this.__removeInteractivity();
        }
      }
      if ($(button).hasClass("button-three-rounds")) {
        this.__g.isSingleRound = false;
        if (this.__g.isMultiDevice) {
          this.__g.mdGameManager.reset();
          this.__g.mdGameManager.createGame();
          return this.__removeInteractivity();
        } else {
          this.__removeAllServerActiveAnimation();
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_THREE_ROUNDS);
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "who-is-playing"
          }));
          return this.__removeInteractivity();
        }
      }
    };

    GameOptionsScreen.prototype.__onBackClick = function() {};

    GameOptionsScreen.prototype.__checkWithGameManager = function(e) {
      return GameOptionsScreen.__super__.__checkWithGameManager.apply(this, arguments);
    };

    GameOptionsScreen.prototype.__onServerError = function(e) {
      GameOptionsScreen.__super__.__onServerError.apply(this, arguments);
      this.__removeAllServerActiveAnimation();
      return this.__addInteractivity();
    };

    GameOptionsScreen.prototype.__setInitStyle = function() {
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

    GameOptionsScreen.prototype.__cueIntroAnimation = function() {
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

    GameOptionsScreen.prototype.__cueOutroAnimation = function() {
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

    GameOptionsScreen.prototype.screenStart = function() {
      GameOptionsScreen.__super__.screenStart.apply(this, arguments);
      return this.__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
    };

    GameOptionsScreen.prototype.introStart = function() {
      var targetColour, timeout;
      GameOptionsScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      if (this.__g.isMultiDevice === true) {
        $(".menu li:first-child").hide().next().hide();
        targetColour = masquerade.ColourManager.BLUE;
      } else {
        targetColour = masquerade.ColourManager.GREEN;
      }
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    GameOptionsScreen.prototype.outroStart = function() {
      GameOptionsScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          _this.__cueOutroAnimation();
          return _this.__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, _this.__onBackClick);
        };
      })(this), 0);
    };

    GameOptionsScreen.prototype.screenEnd = function() {
      return GameOptionsScreen.__super__.screenEnd.apply(this, arguments);
    };

    return GameOptionsScreen;

  })(masquerade.MDScreen);

}).call(this);
