(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.WhoIsPlayingScreen = (function(_super) {
    __extends(WhoIsPlayingScreen, _super);

    function WhoIsPlayingScreen(domNode) {
      this.__onTextFieldOnBlur = __bind(this.__onTextFieldOnBlur, this);
      WhoIsPlayingScreen.__super__.constructor.call(this, domNode);
    }

    WhoIsPlayingScreen.prototype.__init = function() {
      return WhoIsPlayingScreen.__super__.__init.apply(this, arguments);
    };

    WhoIsPlayingScreen.prototype.__build = function() {
      var textInput, textInputs, _i, _len, _results;
      WhoIsPlayingScreen.__super__.__build.apply(this, arguments);
      this.__textInputs = [];
      textInputs = this.__domNode.getElementsByTagName('input');
      _results = [];
      for (_i = 0, _len = textInputs.length; _i < _len; _i++) {
        textInput = textInputs[_i];
        textInput.addEventListener("blur", this.__onTextFieldOnBlur, false);
        _results.push(this.__textInputs.push(textInput));
      }
      return _results;
    };

    WhoIsPlayingScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button, validationCode;
      WhoIsPlayingScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        validationCode = this.__validate();
        if (validationCode === 0) {
          this.__saveData();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-roles"
          }));
          return this.__removeInteractivity();
        } else {
          return this.__displayIncompleteFormData(validationCode);
        }
      }
    };

    WhoIsPlayingScreen.prototype.__onTextFieldOnBlur = function(event) {
      var index;
      return index = this.__textInputs.indexOf(event.currentTarget);
    };

    WhoIsPlayingScreen.prototype.__validate = function() {
      var duplicateNameCheckArray, textInput, _i, _len, _ref;
      duplicateNameCheckArray = [];
      _ref = this.__textInputs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        textInput = _ref[_i];
        if (textInput.value === "") {
          return 1;
        }
        if (duplicateNameCheckArray.indexOf(textInput.value) !== -1) {
          return 2;
        }
        duplicateNameCheckArray.push(textInput.value);
      }
      return 0;
    };

    WhoIsPlayingScreen.prototype.__displayIncompleteFormData = function(code) {
      window.log("IN-VALID");
      switch (code) {
        case 1:
          return this.__g.rootViewController.alert({
            message: "Please enter all three player names"
          });
        case 2:
          return this.__g.rootViewController.alert({
            message: "Please ensure all player names are unique"
          });
      }
    };

    WhoIsPlayingScreen.prototype.__saveData = function() {
      return this.__g.gameManager.setPlayerNames(this.__textInputs[0].value, this.__textInputs[1].value, this.__textInputs[2].value);
    };

    WhoIsPlayingScreen.prototype.introStart = function() {
      WhoIsPlayingScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      if (this.__g.showPlaceholderData === true) {
        this.__textInputs[0].value = "Efan";
        this.__textInputs[1].value = "Poppy";
        this.__textInputs[2].value = "Tom";
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    WhoIsPlayingScreen.prototype.outroStart = function() {
      WhoIsPlayingScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    WhoIsPlayingScreen.prototype.screenEnd = function() {
      return WhoIsPlayingScreen.__super__.screenEnd.apply(this, arguments);
    };

    return WhoIsPlayingScreen;

  })(masquerade.Screen);

}).call(this);
