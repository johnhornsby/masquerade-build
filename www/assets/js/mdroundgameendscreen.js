(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDRoundGameEndScreen = (function(_super) {
    __extends(MDRoundGameEndScreen, _super);

    MDRoundGameEndScreen.prototype.__activeFrame = void 0;

    MDRoundGameEndScreen.prototype.__previousFrame = void 0;

    MDRoundGameEndScreen.prototype.__frames = [];

    MDRoundGameEndScreen.prototype.__frameAnimationTime = 0.25;

    MDRoundGameEndScreen.prototype.__scoreData = void 0;

    function MDRoundGameEndScreen(domNode) {
      this.__onBackClick = __bind(this.__onBackClick, this);
      this.__hidePreviousFrame = __bind(this.__hidePreviousFrame, this);
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      MDRoundGameEndScreen.__super__.constructor.call(this, domNode);
      this.__tripToSaveScoresOnExit = false;
    }

    MDRoundGameEndScreen.prototype.__init = function() {
      return MDRoundGameEndScreen.__super__.__init.apply(this, arguments);
    };

    MDRoundGameEndScreen.prototype.__build = function() {
      var $frame1, $gameOverButton, $homeButton, $nextRoundButton, $reviewButton, bubbleNode, conversationContainer, i, isComplete, judgeName, l, message, nameCell, nameCells, nonPretenderName, pretenderName, qaNode, questionAnswers, rect, result, role, scoreCell, scoreCells, svgNode, table, templateQaNode, titleImageIndex, _i, _j, _len, _len1, _results;
      MDRoundGameEndScreen.__super__.__build.apply(this, arguments);
      this.__frames = $("frame");
      message = "";
      result = this.__g.mdGameManager.getRoundResult();
      role = this.__g.mdGameManager.getGUIDRole(this.__g.guid);
      judgeName = this.__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_JUDGE);
      pretenderName = this.__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_PRETENDER);
      nonPretenderName = this.__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_NON_PRETENDER);
      switch (role) {
        case masquerade.MDGameManager.ROLE_JUDGE:
          if (result) {
            message += "Well done, you got it right!";
          } else {
            message += "Sorry, you got it wrong!";
          }
          message += " <span class='spanBold'>" + pretenderName + "</span> was the pretender";
          break;
        case masquerade.MDGameManager.ROLE_PRETENDER:
          if (result) {
            message += "Oops, busted! <span class='spanBold'>" + judgeName + "</span> the judge correctly identified you!";
          } else {
            message += "Well done, you fooled <span class='spanBold'>" + judgeName + "</span> the judge";
          }
          break;
        case masquerade.MDGameManager.ROLE_NON_PRETENDER:
          if (result) {
            message += "<span class='spanBold'>" + judgeName + "</span> the judge correctly identified <span class='spanBold'>" + pretenderName + "</span> the pretender";
          } else {
            message += "<span class='spanBold'>" + pretenderName + "</span> the pretender fooled <span class='spanBold'>" + judgeName + "</span> the judge";
          }
      }
      this.__domNode.getElementsByClassName('text-message')[0].innerHTML = message;
      $frame1 = $(this.__domNode).find(".frame-1");
      $gameOverButton = $frame1.find('.button-game-over');
      $nextRoundButton = $frame1.find('.button-next-round');
      $homeButton = $frame1.find('.button-home');
      $reviewButton = $frame1.find('.button-review');
      titleImageIndex = 0;
      isComplete = false;
      if (this.__g.mdGameManager.isSingleRound() === false && this.__g.mdGameManager.getRoundIndex() === 2) {
        isComplete = true;
      } else if (this.__g.mdGameManager.isSingleRound()) {
        isComplete = true;
      }
      if (isComplete) {
        titleImageIndex = 1;
        $nextRoundButton.html("Play Again");
        if (this.__g.mdGameManager.isSingleRound()) {
          $gameOverButton.hide();
        } else {
          $homeButton.hide();
          $nextRoundButton.hide();
        }
      } else {
        $nextRoundButton.html("Next Round");
        $gameOverButton.hide();
        $homeButton.hide();
      }
      $frame1.find(".title-image").eq(titleImageIndex).removeClass('hide');
      if (isComplete && this.__g.mdGameManager.isSingleRound() === false) {
        table = $(this.__domNode).find(".frame-2 table")[0];
        this.__scoreData = this.__g.mdGameManager.getFinalScoreData();
        scoreCells = $(table).find('.cell-score');
        nameCells = $(table).find('.cell-name');
        i = -1 + scoreCells.length;
        for (_i = 0, _len = scoreCells.length; _i < _len; _i++) {
          scoreCell = scoreCells[_i];
          scoreCell.innerHTML = this.__scoreData[i].score;
          i--;
        }
        i = -1 + scoreCells.length;
        for (_j = 0, _len1 = nameCells.length; _j < _len1; _j++) {
          nameCell = nameCells[_j];
          nameCell.innerHTML = this.__scoreData[i].name;
          i--;
        }
      }
      templateQaNode = this.__domNode.getElementsByClassName('question-and-answer')[0];
      qaNode = {};
      svgNode = {};
      bubbleNode = {};
      rect = {};
      conversationContainer = this.__domNode.getElementsByClassName('conversation-container')[0];
      conversationContainer.removeChild(templateQaNode);
      l = this.__g.mdGameManager.getQuestionIndex() + 1;
      questionAnswers = this.__g.mdGameManager.getRoundQuestionAnswers();
      i = 0;
      _results = [];
      while (i < l) {
        qaNode = templateQaNode.cloneNode(true);
        qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " " + (i + 1);
        qaNode.getElementsByClassName('text-question-content')[0].innerHTML = questionAnswers[i].question;
        qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = this.__g.mdGameManager.getAnswerAtPositionWithIndex(true, i);
        qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = this.__g.mdGameManager.getAnswerAtPositionWithIndex(false, i);
        conversationContainer.appendChild(qaNode);
        _results.push(i++);
      }
      return _results;
    };

    MDRoundGameEndScreen.prototype.__drawSVG = function() {
      var bubbleNode, canvas, pathNode, point, polygonNode, rect, svg, svgString, svgs, _i, _len, _results;
      svgs = this.__domNode.getElementsByTagName('svg');
      bubbleNode = {};
      point = {};
      polygonNode = {};
      pathNode = {};
      canvas = {};
      svgString = "";
      _results = [];
      for (_i = 0, _len = svgs.length; _i < _len; _i++) {
        svg = svgs[_i];
        bubbleNode = svg.parentNode;
        rect = {
          x: 2,
          y: 2,
          width: bubbleNode.clientWidth - 4,
          height: bubbleNode.clientHeight - 30
        };
        svg.attributes.width.value = "" + bubbleNode.clientWidth + "px";
        svg.attributes.height.value = "" + bubbleNode.clientHeight + "px";
        svg.attributes.viewBox.value = "0 0 " + bubbleNode.clientWidth + " " + bubbleNode.clientHeight;
        polygonNode = svg.getElementsByTagName('polygon')[0];
        pathNode = svg.getElementsByTagName('path')[0];
        polygonNode.attributes.points.value = this.__getBubblePoints(rect);
        if ($(bubbleNode).hasClass("bubble-left")) {
          polygonNode.attributes.transform.value = "translate(" + bubbleNode.clientWidth + ",0) scale(-1,1)";
          _results.push(pathNode.attributes.transform.value = "translate(5," + (bubbleNode.clientHeight - 30) + ") scale(0.23)");
        } else {
          _results.push(pathNode.attributes.transform.value = "translate(" + (bubbleNode.clientWidth - 35) + "," + (bubbleNode.clientHeight - 30) + ") scale(0.23)");
        }
      }
      return _results;
    };

    MDRoundGameEndScreen.prototype.__getBubblePoints = function(r) {
      var str;
      str = "" + r.x + "," + r.y + " ";
      str += "" + (r.x + r.width) + "," + r.y + " ";
      str += "" + (r.x + r.width) + "," + (r.y + r.height - 12) + " ";
      str += "" + (r.x + r.width - 40) + "," + (r.y + r.height - 12) + " ";
      str += "" + (r.x + r.width - 40) + "," + (r.y + r.height) + " ";
      str += "" + (r.x + r.width - 80) + "," + (r.y + r.height - 12) + " ";
      str += "" + r.x + "," + (r.y + r.height - 12) + " ";
      return str += "" + r.x + "," + r.y + "";
    };

    MDRoundGameEndScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button, isComplete;
      MDRoundGameEndScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      isComplete = false;
      if (this.__g.mdGameManager.isSingleRound() === false && this.__g.mdGameManager.getRoundIndex() === 2) {
        isComplete = true;
      } else if (this.__g.mdGameManager.isSingleRound()) {
        isComplete = true;
      }
      if ($(button).hasClass("button-next-round")) {
        if (this.__g.mdGameManager.isSingleRound()) {
          this.__removeInteractivity();
          this.__g.mdGameManager.leaveGame();
          this.__g.mdGameManager.reset();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "multi-device",
            clearHistory: true
          }));
        } else {
          if (isComplete) {
            this.__removeInteractivity();
            this.__g.mdGameManager.leaveGame();
            this.__g.mdGameManager.reset();
            this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
              name: "multi-device",
              clearHistory: true
            }));
          } else {
            this.__removeInteractivity();
            this.__g.mdGameManager.nextRound();
          }
        }
      }
      if ($(button).hasClass("button-game-over")) {
        this.__showFrame2();
      }
      if ($(button).hasClass("button-home")) {
        this.__removeInteractivity();
        this.__g.mdGameManager.leaveGame();
        this.__g.mdGameManager.reset();
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "home",
          clearHistory: true
        }));
      }
      if ($(button).hasClass("button-review")) {
        this.__showFrame4();
      }
      if ($(button).hasClass("button-close-review")) {
        this.__showFrame1();
      }
      if ($(button).hasClass("button-high-scores")) {
        this.__removeInteractivity();
        this.__g.mdGameManager.leaveGame();
        this.__g.mdGameManager.reset();
        return this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "high-scores",
          clearHistory: true
        }));
      }
    };

    MDRoundGameEndScreen.prototype.__checkWithGameManager = function() {
      MDRoundGameEndScreen.__super__.__checkWithGameManager.apply(this, arguments);
      this.__g.debug("mdroundgameover __checkWithGameManager()");
      if (this.__g.mdGameManager.getGUIDIsReadyForNextRound(this.__g.guid)) {
        if (this.__activeFrame !== $(".frame-3")[0]) {
          return this.__showFrame3();
        }
      }
    };

    MDRoundGameEndScreen.prototype.__showFrame1 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-1").get(0);
      if (this.__previousFrame === $(".frame-4").get(0)) {
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
      }
      if (this.__previousFrame === $(".frame-2").get(0)) {
        TweenMax.set(this.__activeFrame, {
          x: "-500px",
          opacity: 0,
          display: "block"
        });
        TweenMax.to(this.__previousFrame, 0.25, {
          x: "500px",
          opacity: 0,
          force3D: true,
          onComplete: this.__hidePreviousFrame,
          ease: Sine.easeIn
        });
        TweenMax.to(this.__activeFrame, 0.25, {
          x: "0px",
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
      this.__isWaitingForServer = false;
      this.__hideWaitingCircle();
      this.__releaseNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["pause"]);
    };

    MDRoundGameEndScreen.prototype.__showFrame2 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-2").get(0);
      TweenMax.set(this.__activeFrame, {
        x: "500px",
        opacity: 0,
        display: "block"
      });
      TweenMax.to(this.__previousFrame, 0.25, {
        x: "-500px",
        opacity: 0,
        force3D: true,
        onComplete: this.__hidePreviousFrame,
        ease: Sine.easeIn
      });
      TweenMax.to(this.__activeFrame, 0.25, {
        x: "0px",
        opacity: 1,
        force3D: true,
        delay: 0.1,
        ease: Sine.easeOut
      });
      this.__hideWaitingCircle();
      this.__hijackNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["back"]);
    };

    MDRoundGameEndScreen.prototype.__showFrame3 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-3").get(0);
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
        delay: 0.1,
        force3D: true,
        ease: Sine.easeOut
      });
      this.__showWaitingCircle();
      this.__releaseNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["back"]);
    };

    MDRoundGameEndScreen.prototype.__showFrame4 = function() {
      this.__killTweenMax();
      this.__previousFrame = this.__activeFrame;
      this.__activeFrame = $(".frame-4").get(0);
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
      this.__hideWaitingCircle();
      this.__hijackNavigation();
      return this.__g.navigationBar.drawNavigationButtons(["back"]);
    };

    MDRoundGameEndScreen.prototype.__hidePreviousFrame = function() {
      $(this.__previousFrame).hide();
      return this.__previousFrame = void 0;
    };

    MDRoundGameEndScreen.prototype.__initialiseFrame = function() {
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
      TweenMax.set($(".frame-3")[0], style);
      TweenMax.set($(".frame-4")[0], style);
      return this.__showFrame1();
    };

    MDRoundGameEndScreen.prototype.__killTweenMax = function() {
      return $(".frame").each(function() {
        return TweenMax.killTweensOf(this);
      });
    };

    MDRoundGameEndScreen.prototype.__onBackClick = function() {
      return this.__showFrame1();
    };

    MDRoundGameEndScreen.prototype.__hijackNavigation = function() {
      this.__g.rootViewController.setListenToNavigationEvents(false);
      return this.__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
    };

    MDRoundGameEndScreen.prototype.__releaseNavigation = function() {
      this.__g.rootViewController.setListenToNavigationEvents(true);
      return this.__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
    };

    MDRoundGameEndScreen.prototype.__checkToSaveScores = function() {
      if (this.__scoreData) {
        return this.__g.localStorageManager.addHighScores(this.__scoreData);
      }
    };

    MDRoundGameEndScreen.prototype.introStart = function() {
      var targetColour, timeout;
      targetColour = masquerade.ColourManager.RED;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__drawSVG();
      MDRoundGameEndScreen.__super__.introStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    MDRoundGameEndScreen.prototype.outroStart = function() {
      MDRoundGameEndScreen.__super__.outroStart.apply(this, arguments);
      this.__checkToSaveScores();
      this.__releaseNavigation();
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDRoundGameEndScreen.prototype.screenEnd = function() {
      return MDRoundGameEndScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDRoundGameEndScreen;

  })(masquerade.MDScreen);

}).call(this);
