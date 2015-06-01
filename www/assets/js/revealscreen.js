(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.RevealScreen = (function(_super) {
    __extends(RevealScreen, _super);

    RevealScreen.prototype.__guessChar = "";

    RevealScreen.prototype.__playerSplitGroup = {};

    RevealScreen.prototype.__confirmSplitGroup = {};

    RevealScreen.prototype.__guessFlipContainer = {};

    RevealScreen.prototype.__isButtonGuessOpen = false;

    function RevealScreen(domNode) {
      this.__onScrollToBottomUpdate = __bind(this.__onScrollToBottomUpdate, this);
      this.__onScrollToBottomComplete = __bind(this.__onScrollToBottomComplete, this);
      this.__onAlertCancelClick = __bind(this.__onAlertCancelClick, this);
      this.__onAlertOkClick = __bind(this.__onAlertOkClick, this);
      RevealScreen.__super__.constructor.call(this, domNode);
    }

    RevealScreen.prototype.__init = function() {
      return RevealScreen.__super__.__init.apply(this, arguments);
    };

    RevealScreen.prototype.__build = function() {
      var bubbleNode, conversationContainer, i, l, qaNode, rect, svgNode, templateQaNode;
      RevealScreen.__super__.__build.apply(this, arguments);
      if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
        this.__g.colourManager.setCurrentColour(masquerade.ColourManager.RED);
      } else {
        this.__g.colourManager.setCurrentColour(masquerade.ColourManager.RED);
      }
      templateQaNode = this.__domNode.getElementsByClassName('question-and-answer')[0];
      qaNode = {};
      svgNode = {};
      bubbleNode = {};
      rect = {};
      conversationContainer = this.__domNode.getElementsByClassName('conversation-container')[0];
      conversationContainer.removeChild(templateQaNode);
      this.__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      this.__g.rootViewController.addEventListener(masquerade.AlertScreen.CANCEL_CLICK, this.__onAlertCancelClick);
      l = this.__g.gameManager.getQuestionIndex() + 1;
      i = 0;
      while (i < l) {
        qaNode = templateQaNode.cloneNode(true);
        qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " " + (i + 1);
        qaNode.getElementsByClassName('text-question-content')[0].innerHTML = this.__g.gameManager.getQuestionAtIndex(i);
        qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = this.__g.gameManager.getAnswerAAtIndex(i);
        qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = this.__g.gameManager.getAnswerBAtIndex(i);
        conversationContainer.appendChild(qaNode);
        i++;
      }
      $(this.__domNode).find(".bubble-left text").attr("fill", this.__g.colourManager.getCurrentColour());
      $(this.__domNode).find(".text-answer-a").css("color", this.__g.colourManager.getCurrentColour());
      this.__playerSplitGroup = this.__domNode.getElementsByClassName("button-split-group")[0];
      this.__confirmSplitGroup = this.__domNode.getElementsByClassName("button-split-group")[1];
      this.__confirmSplitGroup.style.visibility = "hidden";
      this.__guessFlipContainer = this.__domNode.getElementsByClassName("flip-container")[0];
      this.__g.navigationBar.setNavigationTitle(this.__g.gameManager.getRoundCharacteristic());
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        return this.__playerSplitGroup.style.visibility = "hidden";
      }
    };

    RevealScreen.prototype.__drawSVG = function() {
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
          pathNode.attributes.transform.value = "translate(5," + (bubbleNode.clientHeight - 30) + ") scale(0.23)";
        } else {
          pathNode.attributes.transform.value = "translate(" + (bubbleNode.clientWidth - 35) + "," + (bubbleNode.clientHeight - 30) + ") scale(0.23)";
        }
        if (this.__g.platform === "android" && this.__g.osVersion < 4) {
          canvas = document.createElement("canvas");
          canvas.setAttribute("style", "height:" + ("" + bubbleNode.clientHeight + "px") + ";width:" + ("" + bubbleNode.clientWidth + "px") + ";position:absolute;top:0px;left:0px;");
          canvas.setAttribute("height", "" + bubbleNode.clientHeight + "px");
          canvas.setAttribute("width", "" + bubbleNode.clientWidth + "px");
          $(svg).after(canvas);
          svgString = $(svg.parentNode).html();
          svgString = svgString.substring(0, svgString.indexOf("<canvas"));
          svgString = svgString.substring(svgString.indexOf("<svg"));
          svg.style.display = "none";
          _results.push(canvg(canvas, svgString));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RevealScreen.prototype.__getBubblePoints = function(r) {
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

    RevealScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      RevealScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next-question")) {
        this.__g.gameManager.recordRoundScoring();
        this.__g.gameManager.signalPhaseEnd();
        if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-questions"
          }));
        } else {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "enter-question"
          }));
        }
        this.__removeInteractivity();
      }
      if ($(button).hasClass("button-guess")) {
        if (this.__g.platform === "android" && this.__g.osVersion < 4) {
          this.__playerSplitGroup.style.visibility = "visible";
          button.style.visibility = "hidden";
          setTimeout((function(_this) {
            return function() {
              return _this.__isButtonGuessOpen = true;
            };
          })(this), 1000);
        } else {
          this.__guessFlipContainer.style.webkitTransform = "rotate3d(1, 0, 0, 180deg)";
          setTimeout((function(_this) {
            return function() {
              _this.__isButtonGuessOpen = true;
              $(button).css({
                display: "none"
              });
              return $('.button-guess-a-b').css({
                position: "relative"
              });
            };
          })(this), 1000);
        }
      }
      if ($(button).hasClass("button-guess-a")) {
        if (this.__isButtonGuessOpen === false) {
          return;
        }
        this.__guessChar = "a";
        $(button).addClass("selected");
        $(this.__getButtonWithName("guess-b")).removeClass("selected");
        setTimeout((function(_this) {
          return function() {
            return _this.__g.rootViewController.alert({
              message: "Are you sure?",
              ok: "Yes",
              cancel: "No"
            });
          };
        })(this), 33);
      }
      if ($(button).hasClass("button-guess-b")) {
        if (this.__isButtonGuessOpen === false) {
          return;
        }
        this.__guessChar = "b";
        $(button).addClass("selected");
        $(this.__getButtonWithName("guess-a")).removeClass("selected");
        return setTimeout((function(_this) {
          return function() {
            return _this.__g.rootViewController.alert({
              message: "Are you sure?",
              ok: "Yes",
              cancel: "No"
            });
          };
        })(this), 33);
      }
    };

    RevealScreen.prototype.__onAlertOkClick = function() {
      this.__g.gameManager.makeGuess(this.__guessChar);
      this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
        name: "round-end"
      }));
      return this.__removeInteractivity();
    };

    RevealScreen.prototype.__onAlertCancelClick = function() {
      $(this.__getButtonWithName("guess-a")).removeClass("selected");
      return $(this.__getButtonWithName("guess-b")).removeClass("selected");
    };

    RevealScreen.prototype.__onScrollToBottomComplete = function() {};

    RevealScreen.prototype.__onScrollToBottomUpdate = function() {};

    RevealScreen.prototype.__introComplete = function() {
      var body, scrollTop;
      RevealScreen.__super__.__introComplete.apply(this, arguments);
      body = document.getElementsByTagName("body")[0];
      if (window.innerHeight < this.__domNode.scrollHeight) {
        scrollTop = (this.__domNode.scrollHeight + this.__g.statusBarOffset) - window.innerHeight;
        return setTimeout((function(_this) {
          return function() {
            return Animator.addTween(body, {
              scrollTop: scrollTop,
              time: 1,
              onComplete: _this.__onScrollToBottomComplete,
              onUpdate: _this.__onScrollToBottomUpdate,
              transition: "easeOutExpo"
            });
          };
        })(this), 100);
      }
    };

    RevealScreen.prototype.introStart = function() {
      RevealScreen.__super__.introStart.apply(this, arguments);
      this.__drawSVG();
      this.__g.navigationBar.drawNavigationButtons(["pause"]);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    RevealScreen.prototype.outroStart = function() {
      var body;
      RevealScreen.__super__.outroStart.apply(this, arguments);
      body = document.getElementsByTagName("body")[0];
      Animator.removeTween(body);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    RevealScreen.prototype.screenEnd = function() {
      RevealScreen.__super__.screenEnd.apply(this, arguments);
      this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      return this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.CANCEL_CLICK, this.__onAlertCancelClick);
    };

    return RevealScreen;

  })(masquerade.Screen);

}).call(this);
