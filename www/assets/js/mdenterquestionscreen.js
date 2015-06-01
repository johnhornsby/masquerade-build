(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDEnterQuestionScreen = (function(_super) {
    __extends(MDEnterQuestionScreen, _super);

    MDEnterQuestionScreen.prototype.__textArea = {};

    MDEnterQuestionScreen.prototype.__maxChars = -1;

    function MDEnterQuestionScreen(domNode) {
      this.__onTextAreaOnChange = __bind(this.__onTextAreaOnChange, this);
      this.__onTextAreaOnBlur = __bind(this.__onTextAreaOnBlur, this);
      this.__onTextAreaOnFocus = __bind(this.__onTextAreaOnFocus, this);
      MDEnterQuestionScreen.__super__.constructor.call(this, domNode);
    }

    MDEnterQuestionScreen.prototype.__init = function() {
      return MDEnterQuestionScreen.__super__.__init.apply(this, arguments);
    };

    MDEnterQuestionScreen.prototype.__build = function() {
      MDEnterQuestionScreen.__super__.__build.apply(this, arguments);
      this.__textArea = this.__domNode.getElementsByTagName('textarea')[0];
      this.__textArea.addEventListener("focus", this.__onTextAreaOnFocus, false);
      this.__textArea.addEventListener("blur", this.__onTextAreaOnBlur, false);
      this.__textArea.addEventListener("input", this.__onTextAreaOnChange, false);
      this.__domNode.getElementsByTagName('h3')[0].innerHTML += " <span class='spanBold'>'" + this.__g.mdGameManager.getCharacteristic() + "'</span>";
      this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (this.__g.mdGameManager.getQuestionIndex() + 1));
      this.__maxChars = this.__g.mdGameManager.getTextLimit();
      $(this.__textArea).attr("maxlength", "" + this.__maxChars);
      return this.__updateCharCount();
    };

    MDEnterQuestionScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDEnterQuestionScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__removeInteractivity();
          return this.__g.mdGameManager.enterQuestion(this.__textArea.value);
        } else {
          this.__removeAllServerActiveAnimation();
          return this.__displayIncompleteFormData();
        }
      }
    };

    MDEnterQuestionScreen.prototype.__onTextAreaOnFocus = function(event) {
      var sections;
      sections = this.__domNode.getElementsByTagName("section");
      return this.__updateCharCount();
    };

    MDEnterQuestionScreen.prototype.__onTextAreaOnBlur = function(event) {
      var sections;
      sections = this.__domNode.getElementsByTagName("section");
      return this.__updateCharCount();
    };

    MDEnterQuestionScreen.prototype.__onTextAreaOnChange = function(event) {
      return this.__updateCharCount();
    };

    MDEnterQuestionScreen.prototype.__validate = function() {
      if (this.__textArea.value === "") {
        return false;
      }
      return true;
    };

    MDEnterQuestionScreen.prototype.__displayIncompleteFormData = function() {
      this.__g.debug("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "Please enter your question",
        label: "validation"
      });
    };

    MDEnterQuestionScreen.prototype.__updateCharCount = function() {
      var charsLeft;
      charsLeft = this.__maxChars - this.__textArea.value.length;
      return $('.char-count').html(charsLeft);
    };

    MDEnterQuestionScreen.prototype.introStart = function() {
      var targetColour, timeout;
      MDEnterQuestionScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.RED;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__updateCharCount();
      this.__g.navigationBar.drawNavigationButtons(["pause", "help"]);
      if (this.__g.showPlaceholderData === true) {
        this.__textArea.value = "AS A MAN, WHAT IS THE WORST THING ABOUT HAVING TO SHAVE?";
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDEnterQuestionScreen.prototype.outroStart = function() {
      MDEnterQuestionScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDEnterQuestionScreen.prototype.screenEnd = function() {
      return MDEnterQuestionScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDEnterQuestionScreen;

  })(masquerade.MDScreen);

}).call(this);
