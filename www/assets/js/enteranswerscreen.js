(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.EnterAnswerScreen = (function(_super) {
    __extends(EnterAnswerScreen, _super);

    EnterAnswerScreen.prototype.__textArea = {};

    EnterAnswerScreen.prototype.__bonus = 0;

    EnterAnswerScreen.prototype.__intervalID = 0;

    EnterAnswerScreen.prototype.__bonusSeconds = 0;

    EnterAnswerScreen.prototype.__bonusInitialSeconds = 0;

    EnterAnswerScreen.prototype.__bonusInitialScore = 0;

    EnterAnswerScreen.prototype.__bonus = 0;

    EnterAnswerScreen.prototype.__maxChars = -1;

    function EnterAnswerScreen(domNode) {
      this.__secondTick = __bind(this.__secondTick, this);
      this.__onTextAreaOnChange = __bind(this.__onTextAreaOnChange, this);
      this.__onTextAreaOnBlur = __bind(this.__onTextAreaOnBlur, this);
      this.__onTextAreaOnFocus = __bind(this.__onTextAreaOnFocus, this);
      EnterAnswerScreen.__super__.constructor.call(this, domNode);
    }

    EnterAnswerScreen.prototype.__init = function() {
      EnterAnswerScreen.__super__.__init.apply(this, arguments);
      this.__bonusInitialSeconds = this.__g.gameManager.getScoreDataValue("quickAnswerBonusSeconds");
      return this.__bonusInitialScore = this.__g.gameManager.getScoreDataValue("quickAnswerBonus");
    };

    EnterAnswerScreen.prototype.__build = function() {
      var phaseIndex;
      EnterAnswerScreen.__super__.__build.apply(this, arguments);
      this.__textArea = this.__domNode.getElementsByTagName('textarea')[0];
      this.__textArea.addEventListener("focus", this.__onTextAreaOnFocus, false);
      this.__textArea.addEventListener("blur", this.__onTextAreaOnBlur, false);
      this.__textArea.addEventListener("input", this.__onTextAreaOnChange, false);
      phaseIndex = this.__g.gameManager.getPhaseIndex();
      switch (phaseIndex) {
        case 1:
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
          break;
        case 2:
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "Answer honestly as " + "<span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
      }
      this.__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (this.__g.gameManager.getQuestionIndex() + 1) + " <span class='spanBold'>" + this.__g.gameManager.getCurrentQuestion() + "</span>";
      this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (this.__g.gameManager.getQuestionIndex() + 1));
      this.__maxChars = parseInt($(this.__textArea).attr("maxlength"));
      this.__updateCharCount();
      if (this.__g.gameManager.getMode() !== masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) {
        return this.__domNode.getElementsByClassName("count-down-wrapper")[0].style.visibility = "hidden";
      }
    };

    EnterAnswerScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      EnterAnswerScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__saveData();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "ready"
          }));
          return this.__removeInteractivity();
        } else {
          return this.__displayIncompleteFormData();
        }
      }
    };

    EnterAnswerScreen.prototype.__onTextAreaOnFocus = function(event) {
      return this.__updateCharCount();
    };

    EnterAnswerScreen.prototype.__onTextAreaOnBlur = function(event) {
      return this.__updateCharCount();
    };

    EnterAnswerScreen.prototype.__onTextAreaOnChange = function(event) {
      return this.__updateCharCount();
    };

    EnterAnswerScreen.prototype.__validate = function() {
      if (this.__textArea.value === "") {
        return false;
      }
      return true;
    };

    EnterAnswerScreen.prototype.__displayIncompleteFormData = function() {
      window.log("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "Please enter your answer"
      });
    };

    EnterAnswerScreen.prototype.__saveData = function() {
      this.__bonus = Math.round((this.__bonusSeconds / this.__bonusInitialSeconds) * this.__bonusInitialScore);
      this.__g.gameManager.setPlayerText(this.__textArea.value, this.__bonus);
      return this.__g.gameManager.incrementPhaseIndex();
    };

    EnterAnswerScreen.prototype.__introComplete = function() {
      EnterAnswerScreen.__super__.__introComplete.apply(this, arguments);
      return this.__intervalID = setInterval(this.__secondTick, 1000);
    };

    EnterAnswerScreen.prototype.__secondTick = function() {
      this.__bonusSeconds--;
      if (this.__bonusSeconds === 0) {
        clearInterval(this.__intervalID);
      }
      return this.__updateTime();
    };

    EnterAnswerScreen.prototype.__updateTime = function() {
      var degrees;
      this.__domNode.getElementsByClassName("count-down-timer")[0].innerHTML = this.__formatSecondsToTime(this.__bonusSeconds);
      degrees = 360 - ((this.__bonusSeconds / this.__bonusInitialSeconds) * 360);
      return this.__domNode.getElementsByClassName("svg-clock-hand")[0].attributes.transform.value = "rotate(" + degrees + ",65,65)";
    };

    EnterAnswerScreen.prototype.__formatSecondsToTime = function(seconds) {
      var d, m, s;
      d = new Date(0);
      d.setSeconds(seconds);
      s = String(d.getSeconds());
      if (s.length === 1) {
        s = "0" + s;
      }
      m = String(d.getMinutes());
      if (m.length === 1) {
        m = "0" + m;
      }
      return m + ":" + s;
    };

    EnterAnswerScreen.prototype.__updateCharCount = function() {
      var charsLeft;
      charsLeft = this.__maxChars - this.__textArea.value.length;
      return $('.char-count').html(charsLeft);
    };

    EnterAnswerScreen.prototype.introStart = function() {
      EnterAnswerScreen.__super__.introStart.apply(this, arguments);
      this.__bonusSeconds = this.__bonusInitialSeconds;
      this.__updateTime();
      this.__g.navigationBar.drawNavigationButtons(["pause", "help"]);
      if (this.__g.showPlaceholderData === true) {
        this.__textArea.value = "This is my answer";
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    EnterAnswerScreen.prototype.outroStart = function() {
      EnterAnswerScreen.__super__.outroStart.apply(this, arguments);
      clearInterval(this.__intervalID);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    EnterAnswerScreen.prototype.screenEnd = function() {
      return EnterAnswerScreen.__super__.screenEnd.apply(this, arguments);
    };

    return EnterAnswerScreen;

  })(masquerade.Screen);

}).call(this);
