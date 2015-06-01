(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDRevealScreen = (function(_super) {
    __extends(MDRevealScreen, _super);

    MDRevealScreen.prototype.__guessChar = "";

    MDRevealScreen.prototype.__playerSplitGroup = {};

    MDRevealScreen.prototype.__confirmSplitGroup = {};

    MDRevealScreen.prototype.__guessFlipContainer = {};

    MDRevealScreen.prototype.__isButtonGuessOpen = false;

    function MDRevealScreen(domNode) {
      this.__onScrollToBottomUpdate = __bind(this.__onScrollToBottomUpdate, this);
      this.__onScrollToBottomComplete = __bind(this.__onScrollToBottomComplete, this);
      this.__onAlertCancelClick = __bind(this.__onAlertCancelClick, this);
      this.__onAlertOkClick = __bind(this.__onAlertOkClick, this);
      MDRevealScreen.__super__.constructor.call(this, domNode);
    }

    MDRevealScreen.prototype.__init = function() {
      return MDRevealScreen.__super__.__init.apply(this, arguments);
    };

    MDRevealScreen.prototype.__build = function() {
      var bubbleNode, conversationContainer, i, l, qaNode, questionAnswers, rect, svgNode, templateQaNode;
      MDRevealScreen.__super__.__build.apply(this, arguments);
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
      while (i < l) {
        qaNode = templateQaNode.cloneNode(true);
        qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " " + (i + 1);
        qaNode.getElementsByClassName('text-question-content')[0].innerHTML = questionAnswers[i].question;
        qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = this.__g.mdGameManager.getAnswerAtPositionWithIndex(true, i);
        qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = this.__g.mdGameManager.getAnswerAtPositionWithIndex(false, i);
        conversationContainer.appendChild(qaNode);
        i++;
      }
      $(this.__domNode).find(".bubble-left text").attr("fill", masquerade.ColourManager.RED);
      $(this.__domNode).find(".text-answer-a").css("color", masquerade.ColourManager.RED);
      this.__playerSplitGroup = this.__domNode.getElementsByClassName("button-split-group")[0];
      this.__confirmSplitGroup = this.__domNode.getElementsByClassName("button-split-group")[1];
      this.__confirmSplitGroup.style.visibility = "hidden";
      this.__guessFlipContainer = this.__domNode.getElementsByClassName("flip-container")[0];
      this.__g.navigationBar.setNavigationTitle(this.__g.mdGameManager.getCharacteristic());
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        return this.__playerSplitGroup.style.visibility = "hidden";
      }
    };

    MDRevealScreen.prototype.__drawSVG = function() {
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

    MDRevealScreen.prototype.__getBubblePoints = function(r) {
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

    MDRevealScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDRevealScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next-question")) {
        this.__removeInteractivity();
        this.__g.mdGameManager.askAnotherQuestion();
      }
      if ($(button).hasClass("button-guess")) {
        if (this.__g.platform === "android" && this.__g.osVersion < 4) {
          this.__playerSplitGroup.style.visibility = "visible";
          button.style.visibility = "hidden";
          setTimeout((function(_this) {
            return function() {
              return _this.__isButtonGuessOpen = true;
            };
          })(this), 500);
        } else {
          this.__guessFlipContainer.style.webkitTransform = "rotate3d(1, 0, 0, 180deg)";
          setTimeout((function(_this) {
            return function() {
              return _this.__isButtonGuessOpen = true;
            };
          })(this), 500);
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
              cancel: "No",
              label: "makeAGuess"
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
              cancel: "No",
              label: "makeAGuess"
            });
          };
        })(this), 33);
      }
    };

    MDRevealScreen.prototype.__onAlertOkClick = function(e) {
      if (e.data.label === "makeAGuess") {
        this.__removeInteractivity();
        return this.__g.mdGameManager.makeAGuess(this.__guessChar === "a");
      }
    };

    MDRevealScreen.prototype.__onAlertCancelClick = function(e) {
      $(this.__getButtonWithName("guess-a")).removeClass("selected");
      return $(this.__getButtonWithName("guess-b")).removeClass("selected");
    };

    MDRevealScreen.prototype.__onScrollToBottomComplete = function() {};

    MDRevealScreen.prototype.__onScrollToBottomUpdate = function() {};

    MDRevealScreen.prototype.__introComplete = function() {
      var body, scrollTop;
      MDRevealScreen.__super__.__introComplete.apply(this, arguments);
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

    MDRevealScreen.prototype.screenStart = function() {
      MDRevealScreen.__super__.screenStart.apply(this, arguments);
      this.__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      return this.__g.rootViewController.addEventListener(masquerade.AlertScreen.CANCEL_CLICK, this.__onAlertCancelClick);
    };

    MDRevealScreen.prototype.introStart = function() {
      var targetColour, timeout;
      MDRevealScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.RED;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__drawSVG();
      this.__g.navigationBar.drawNavigationButtons(["pause"]);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDRevealScreen.prototype.outroStart = function() {
      var body;
      MDRevealScreen.__super__.outroStart.apply(this, arguments);
      body = document.getElementsByTagName("body")[0];
      Animator.removeTween(body);
      this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.CANCEL_CLICK, this.__onAlertCancelClick);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDRevealScreen.prototype.screenEnd = function() {
      return MDRevealScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDRevealScreen;

  })(masquerade.MDScreen);

}).call(this);
