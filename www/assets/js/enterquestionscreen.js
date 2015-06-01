(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.EnterQuestionScreen = (function(_super) {
    __extends(EnterQuestionScreen, _super);

    EnterQuestionScreen.prototype.__textArea = {};

    EnterQuestionScreen.prototype.__maxChars = -1;

    function EnterQuestionScreen(domNode) {
      this.__onTextAreaOnChange = __bind(this.__onTextAreaOnChange, this);
      this.__onTextAreaOnBlur = __bind(this.__onTextAreaOnBlur, this);
      this.__onTextAreaOnFocus = __bind(this.__onTextAreaOnFocus, this);
      EnterQuestionScreen.__super__.constructor.call(this, domNode);
    }

    EnterQuestionScreen.prototype.__init = function() {
      return EnterQuestionScreen.__super__.__init.apply(this, arguments);
    };

    EnterQuestionScreen.prototype.__build = function() {
      EnterQuestionScreen.__super__.__build.apply(this, arguments);
      this.__textArea = this.__domNode.getElementsByTagName('textarea')[0];
      this.__textArea.addEventListener("focus", this.__onTextAreaOnFocus, false);
      this.__textArea.addEventListener("blur", this.__onTextAreaOnBlur, false);
      this.__textArea.addEventListener("input", this.__onTextAreaOnChange, false);
      this.__domNode.getElementsByTagName('h3')[0].innerHTML += " <span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
      this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (this.__g.gameManager.getQuestionIndex() + 1));
      this.__maxChars = parseInt($(this.__textArea).attr("maxlength"));
      return this.__updateCharCount();
    };

    EnterQuestionScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      EnterQuestionScreen.__super__.__handleButtonEvent.apply(this, arguments);
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

    EnterQuestionScreen.prototype.__onTextAreaOnFocus = function(event) {
      var sections;
      sections = this.__domNode.getElementsByTagName("section");
      return this.__updateCharCount();
    };

    EnterQuestionScreen.prototype.__onTextAreaOnBlur = function(event) {
      var sections;
      sections = this.__domNode.getElementsByTagName("section");
      return this.__updateCharCount();
    };

    EnterQuestionScreen.prototype.__onTextAreaOnChange = function(event) {
      return this.__updateCharCount();
    };

    EnterQuestionScreen.prototype.__validate = function() {
      if (this.__textArea.value === "") {
        return false;
      }
      return true;
    };

    EnterQuestionScreen.prototype.__displayIncompleteFormData = function() {
      window.log("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "Please enter your question"
      });
    };

    EnterQuestionScreen.prototype.__saveData = function() {
      this.__g.gameManager.setPlayerText(this.__textArea.value);
      return this.__g.gameManager.incrementPhaseIndex();
    };

    EnterQuestionScreen.prototype.__updateCharCount = function() {
      var charsLeft;
      charsLeft = this.__maxChars - this.__textArea.value.length;
      return $('.char-count').html(charsLeft);
    };

    EnterQuestionScreen.prototype.introStart = function() {
      EnterQuestionScreen.__super__.introStart.apply(this, arguments);
      this.__updateCharCount();
      this.__g.navigationBar.drawNavigationButtons(["pause", "help"]);
      if (this.__g.showPlaceholderData === true) {
        this.__textArea.value = "AS A MAN, WHAT IS THE WORST THING ABOUT HAVING TO SHAVE?";
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    EnterQuestionScreen.prototype.outroStart = function() {
      EnterQuestionScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    EnterQuestionScreen.prototype.screenEnd = function() {
      return EnterQuestionScreen.__super__.screenEnd.apply(this, arguments);
    };

    return EnterQuestionScreen;

  })(masquerade.Screen);

}).call(this);
