(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.GameScoresScreen = (function(_super) {
    __extends(GameScoresScreen, _super);

    function GameScoresScreen(domNode) {
      GameScoresScreen.__super__.constructor.call(this, domNode);
    }

    GameScoresScreen.prototype.__init = function() {
      return GameScoresScreen.__super__.__init.apply(this, arguments);
    };

    GameScoresScreen.prototype.__build = function() {
      var message, nextButton, result;
      GameScoresScreen.__super__.__build.apply(this, arguments);
      result = this.__g.gameManager.getEndRoundResult();
      message = "You are ";
      if (result.won) {
        message += "correct!, ";
      } else {
        message += "wrong!, ";
      }
      message += "" + result.pretender + " was the Pretender";
      this.__domNode.getElementsByClassName('text-message')[0].innerHTML = message;
      nextButton = this.__domNode.getElementsByClassName('button-next')[0];
      if (this.__g.gameManager.isGameOver()) {
        return nextButton.innerHTML = "Play Again";
      } else {
        return nextButton.innerHTML = "Next Round";
      }
    };

    GameScoresScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      GameScoresScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) {
          this.__g.gameManager.newRound();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-characteristic"
          }));
        } else if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_SINGLE_ROUND) {
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND);
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "who-is-playing"
          }));
        } else {
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE);
          this.__g.gameManager.setPlayerNames("Judge", "A", "B");
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-characteristic"
          }));
        }
      }
      if ($(button).hasClass("button-home")) {
        return this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "home"
        }));
      }
    };

    GameScoresScreen.prototype.introStart = function() {
      GameScoresScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["help"]);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    GameScoresScreen.prototype.outroStart = function() {
      GameScoresScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    GameScoresScreen.prototype.screenEnd = function() {
      return GameScoresScreen.__super__.screenEnd.apply(this, arguments);
    };

    return GameScoresScreen;

  })(masquerade.Screen);

}).call(this);
