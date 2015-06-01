(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.RoundEndScreen = (function(_super) {
    __extends(RoundEndScreen, _super);

    function RoundEndScreen(domNode) {
      RoundEndScreen.__super__.constructor.call(this, domNode);
    }

    RoundEndScreen.prototype.__init = function() {
      return RoundEndScreen.__super__.__init.apply(this, arguments);
    };

    RoundEndScreen.prototype.__build = function() {
      var homeButton, message, nextButton, nextRoundButton, result, reviewButton, titleImageIndex, titleImages;
      RoundEndScreen.__super__.__build.apply(this, arguments);
      titleImageIndex = 0;
      result = this.__g.gameManager.getEndRoundResult();
      message = "";
      if (result.won) {
        message += "Well done, you got it right! ";
      } else {
        message += "Sorry, you got it wrong! ";
      }
      message += "<span class='spanBold'>" + result.pretender + "</span> was the Pretender";
      nextButton = this.__domNode.getElementsByClassName('button-next')[0];
      nextRoundButton = this.__domNode.getElementsByClassName('button-next-round')[0];
      homeButton = this.__domNode.getElementsByClassName('button-home')[0];
      reviewButton = this.__domNode.getElementsByClassName('button-review')[0];
      if (this.__g.gameManager.isGameOver()) {
        titleImageIndex = 1;
        nextRoundButton.innerHTML = "Play Again";
        if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) {
          homeButton.style.display = "none";
          nextRoundButton.style.display = "none";
          this.__sendDataToServer();
        } else if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
          reviewButton.style.display = "none";
          nextButton.style.display = "none";
        } else {
          nextButton.style.display = "none";
          this.__sendDataToServer();
        }
      } else {
        nextRoundButton.innerHTML = "Next Round";
        nextButton.style.display = "none";
        homeButton.style.display = "none";
      }
      titleImages = this.__domNode.getElementsByClassName("title-image");
      $(titleImages[titleImageIndex]).removeClass("hide");
      return this.__domNode.getElementsByClassName('text-message')[0].innerHTML = message;
    };

    RoundEndScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      RoundEndScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next-round")) {
        if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_SINGLE_ROUND) {
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND);
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "who-is-playing",
            clearHistory: true
          }));
        } else if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
          this.__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE);
          this.__g.gameManager.setPlayerNames("Judge", "Player A", "Player B");
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-characteristic",
            clearHistory: true
          }));
        } else {
          this.__g.gameManager.newRound();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-roles",
            clearHistory: true
          }));
        }
      }
      if ($(button).hasClass("button-next")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "game-over",
          clearHistory: false
        }));
      }
      if ($(button).hasClass("button-home")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "home",
          clearHistory: true
        }));
      }
      if ($(button).hasClass("button-review")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "review",
          clearHistory: false
        }));
      }
      return this.__removeInteractivity();
    };

    RoundEndScreen.prototype.__sendDataToServer = function() {
      var json;
      json = this.__g.gameManager.getGameDataToSend();
      return this.__g.mdGameManager.sendSingleDeviceGameData(json);
    };

    RoundEndScreen.prototype.introStart = function() {
      RoundEndScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons([], false);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    RoundEndScreen.prototype.outroStart = function() {
      RoundEndScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    RoundEndScreen.prototype.screenEnd = function() {
      return RoundEndScreen.__super__.screenEnd.apply(this, arguments);
    };

    return RoundEndScreen;

  })(masquerade.Screen);

}).call(this);
