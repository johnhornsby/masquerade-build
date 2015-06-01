(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDEnterAnswerScreen = (function(_super) {
    __extends(MDEnterAnswerScreen, _super);

    MDEnterAnswerScreen.prototype.__textArea = {};

    MDEnterAnswerScreen.prototype.__bonus = 0;

    MDEnterAnswerScreen.prototype.__intervalID = 0;

    MDEnterAnswerScreen.prototype.__bonusSeconds = 0;

    MDEnterAnswerScreen.prototype.__bonusInitialSeconds = 0;

    MDEnterAnswerScreen.prototype.__bonusInitialScore = 0;

    MDEnterAnswerScreen.prototype.__bonus = 0;

    MDEnterAnswerScreen.prototype.__maxChars = -1;

    function MDEnterAnswerScreen(domNode) {
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      this.__secondTick = __bind(this.__secondTick, this);
      this.__onTextAreaOnChange = __bind(this.__onTextAreaOnChange, this);
      this.__onTextAreaOnBlur = __bind(this.__onTextAreaOnBlur, this);
      this.__onTextAreaOnFocus = __bind(this.__onTextAreaOnFocus, this);
      MDEnterAnswerScreen.__super__.constructor.call(this, domNode);
    }

    MDEnterAnswerScreen.prototype.__init = function() {
      MDEnterAnswerScreen.__super__.__init.apply(this, arguments);
      this.__bonusInitialSeconds = this.__g.gameManager.getScoreDataValue("quickAnswerBonusSeconds");
      return this.__bonusInitialScore = this.__g.gameManager.getScoreDataValue("quickAnswerBonus");
    };

    MDEnterAnswerScreen.prototype.__build = function() {
      var question, questionIndex, role;
      MDEnterAnswerScreen.__super__.__build.apply(this, arguments);
      questionIndex = this.__g.mdGameManager.getQuestionIndex();
      question = this.__g.mdGameManager.getRoundQuestionAnswers()[questionIndex].question;
      this.__textArea = this.__domNode.getElementsByTagName('textarea')[0];
      this.__textArea.addEventListener("focus", this.__onTextAreaOnFocus, false);
      this.__textArea.addEventListener("blur", this.__onTextAreaOnBlur, false);
      this.__textArea.addEventListener("input", this.__onTextAreaOnChange, false);
      role = this.__g.mdGameManager.getGUIDRole(this.__g.guid);
      switch (role) {
        case "pretender":
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'" + this.__g.mdGameManager.getCharacteristic() + "'</span>";
          this.__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (questionIndex + 1) + " <span class='spanBold'>" + question + "</span>";
          this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (questionIndex + 1));
          break;
        case "non-pretender":
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "Answer honestly as " + "<span class='spanBold'>'" + this.__g.mdGameManager.getCharacteristic() + "'</span>";
          this.__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (questionIndex + 1) + " <span class='spanBold'>" + question + "</span>";
          this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (questionIndex + 1));
          break;
        case "judge":
          this.__g.navigationBar.setNavigationTitle("Answering");
      }
      this.__maxChars = this.__g.mdGameManager.getTextLimit();
      $(this.__textArea).attr("maxlength", "" + this.__maxChars);
      this.__updateCharCount();
      if (this.__g.mdGameManager.isSingleRound()) {
        return this.__domNode.getElementsByClassName("count-down-wrapper")[0].style.visibility = "hidden";
      }
    };

    MDEnterAnswerScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDEnterAnswerScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__bonus = Math.round((this.__bonusSeconds / this.__bonusInitialSeconds) * this.__bonusInitialScore);
          this.__removeInteractivity();
          return this.__g.mdGameManager.enterAnswer(this.__textArea.value, this.__bonus);
        } else {
          this.__removeAllServerActiveAnimation();
          return this.__displayIncompleteFormData();
        }
      }
    };

    MDEnterAnswerScreen.prototype.__onTextAreaOnFocus = function(event) {
      return this.__updateCharCount();
    };

    MDEnterAnswerScreen.prototype.__onTextAreaOnBlur = function(event) {
      return this.__updateCharCount();
    };

    MDEnterAnswerScreen.prototype.__onTextAreaOnChange = function(event) {
      return this.__updateCharCount();
    };

    MDEnterAnswerScreen.prototype.__validate = function() {
      if (this.__textArea.value === "") {
        return false;
      }
      return true;
    };

    MDEnterAnswerScreen.prototype.__displayIncompleteFormData = function() {
      this.__g.debug("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "Please enter your answer",
        label: "validation"
      });
    };

    MDEnterAnswerScreen.prototype.__introComplete = function() {
      MDEnterAnswerScreen.__super__.__introComplete.apply(this, arguments);
      return this.__intervalID = setInterval(this.__secondTick, 1000);
    };

    MDEnterAnswerScreen.prototype.__secondTick = function() {
      this.__bonusSeconds--;
      if (this.__bonusSeconds === 0) {
        clearInterval(this.__intervalID);
      }
      return this.__updateTime();
    };

    MDEnterAnswerScreen.prototype.__updateTime = function() {
      var degrees;
      this.__domNode.getElementsByClassName("count-down-timer")[0].innerHTML = this.__formatSecondsToTime(this.__bonusSeconds);
      degrees = 360 - ((this.__bonusSeconds / this.__bonusInitialSeconds) * 360);
      return this.__domNode.getElementsByClassName("svg-clock-hand")[0].attributes.transform.value = "rotate(" + degrees + ",65,65)";
    };

    MDEnterAnswerScreen.prototype.__formatSecondsToTime = function(seconds) {
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

    MDEnterAnswerScreen.prototype.__updateCharCount = function() {
      var charsLeft;
      charsLeft = this.__maxChars - this.__textArea.value.length;
      return $('.char-count').html(charsLeft);
    };

    MDEnterAnswerScreen.prototype.__checkWithGameManager = function() {
      MDEnterAnswerScreen.__super__.__checkWithGameManager.apply(this, arguments);
      console.log("mdenteranswer __checkWithGameManager()");
      if (this.__g.guid !== this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)) {
        if (this.__g.mdGameManager.hasAnsweredQuestion()) {
          return this.__showWaitingForServer();
        } else {
          return this.__hideWaitingForServer();
        }
      } else {
        return this.__showWaitingForServer();
      }
    };

    MDEnterAnswerScreen.prototype.introStart = function() {
      var otherPlayer, questionIndex, targetColour, timeout;
      MDEnterAnswerScreen.__super__.introStart.apply(this, arguments);
      switch (this.__g.mdGameManager.getGUIDRole(this.__g.guid)) {
        case masquerade.MDGameManager.ROLE_PRETENDER:
          targetColour = masquerade.ColourManager.YELLOW;
          break;
        case masquerade.MDGameManager.ROLE_NON_PRETENDER:
          targetColour = masquerade.ColourManager.NAVY;
          break;
        case masquerade.MDGameManager.ROLE_JUDGE:
          targetColour = masquerade.ColourManager.BLUE;
      }
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      if (this.__g.guid !== this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)) {
        this.__bonusSeconds = this.__bonusInitialSeconds;
        this.__updateTime();
        this.__g.navigationBar.drawNavigationButtons(["pause"]);
        if (this.__g.showPlaceholderData === true) {
          this.__textArea.value = "This is my answer";
        }
        questionIndex = this.__g.mdGameManager.getQuestionIndex();
        otherPlayer = masquerade.MDGameManager.ROLE_PRETENDER;
        if (this.__g.guid === this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_PRETENDER)) {
          otherPlayer = masquerade.MDGameManager.ROLE_NON_PRETENDER;
        }
        $(".frame-2 h3").html("waiting for the " + otherPlayer + " to answer question " + (questionIndex + 1));
      } else {
        questionIndex = this.__g.mdGameManager.getQuestionIndex();
        $(".frame-2 h3").html("players are answering question " + (questionIndex + 1));
      }
      this.__updateCharCount();
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDEnterAnswerScreen.prototype.outroStart = function() {
      MDEnterAnswerScreen.__super__.outroStart.apply(this, arguments);
      clearInterval(this.__intervalID);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDEnterAnswerScreen.prototype.screenEnd = function() {
      this.__hideWaitingCircle();
      return MDEnterAnswerScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDEnterAnswerScreen;

  })(masquerade.MDScreen);

}).call(this);
