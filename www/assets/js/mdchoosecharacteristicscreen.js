(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDChooseCharacteristicScreen = (function(_super) {
    __extends(MDChooseCharacteristicScreen, _super);

    MDChooseCharacteristicScreen.prototype.__textInputs = [];

    MDChooseCharacteristicScreen.prototype.__characteristic = "";

    MDChooseCharacteristicScreen.prototype.__select = {};

    MDChooseCharacteristicScreen.prototype.__tableViewItemInstances = [];

    MDChooseCharacteristicScreen.prototype.__uiListView = void 0;

    function MDChooseCharacteristicScreen(domNode) {
      this.__onListItemSelect = __bind(this.__onListItemSelect, this);
      this.__onTextFieldOnBlur = __bind(this.__onTextFieldOnBlur, this);
      this.__onTextFieldOnFocus = __bind(this.__onTextFieldOnFocus, this);
      MDChooseCharacteristicScreen.__super__.constructor.call(this, domNode);
      this.__tableViewItemInstances = [];
    }

    MDChooseCharacteristicScreen.prototype.__init = function() {
      return MDChooseCharacteristicScreen.__super__.__init.apply(this, arguments);
    };

    MDChooseCharacteristicScreen.prototype.__build = function() {
      var textInput, textInputs, _i, _len, _results;
      MDChooseCharacteristicScreen.__super__.__build.apply(this, arguments);
      this.__textInputs = [];
      textInputs = this.__domNode.getElementsByTagName('input');
      _results = [];
      for (_i = 0, _len = textInputs.length; _i < _len; _i++) {
        textInput = textInputs[_i];
        textInput.addEventListener("blur", this.__onTextFieldOnBlur, false);
        textInput.addEventListener("focus", this.__onTextFieldOnFocus, false);
        _results.push(this.__textInputs.push(textInput));
      }
      return _results;
    };

    MDChooseCharacteristicScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDChooseCharacteristicScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__removeInteractivity();
          return this.__g.mdGameManager.confirmCharacteristic(this.__characteristic);
        } else {
          this.__removeAllServerActiveAnimation();
          return this.__displayIncompleteFormData();
        }
      }
    };

    MDChooseCharacteristicScreen.prototype.__onTextFieldOnFocus = function(event) {
      return this.__uiListView.setSelectedIndex(-1);
    };

    MDChooseCharacteristicScreen.prototype.__onTextFieldOnBlur = function(event) {
      var textInput;
      textInput = this.__textInputs[0];
      if (textInput.value !== "") {
        this.__uiListView.setSelectedIndex(-1);
      }
      return this.__characteristic = textInput.value;
    };

    MDChooseCharacteristicScreen.prototype.__onListItemSelect = function(event) {
      this.__textInputs[0].value = "";
      return this.__characteristic = event.data.text;
    };

    MDChooseCharacteristicScreen.prototype.__validate = function() {
      if (this.__characteristic === "") {
        return false;
      }
      return true;
    };

    MDChooseCharacteristicScreen.prototype.__displayIncompleteFormData = function() {
      this.__g.debug("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "You have not chosen a characteristic"
      });
    };

    MDChooseCharacteristicScreen.prototype.introStart = function() {
      var options, targetColour, timeout;
      MDChooseCharacteristicScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.GREEN;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      options = {
        domNode: this.__domNode.getElementsByClassName("ui-table-view")[0]
      };
      this.__uiListView = new masquerade.UIListView(options);
      this.__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, this.__onListItemSelect);
      if (this.__g.showPlaceholderData === true) {
        this.__uiListView.setSelectedIndex(0);
        this.__characteristic = this.__uiListView.getSelectedText();
      }
      this.__textInputs[0].value = "";
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        $(".ui-table-view").css("margin-top", "10px");
      }
      this.__g.navigationBar.drawNavigationButtons(["pause"]);
      timeout = 100;
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDChooseCharacteristicScreen.prototype.outroStart = function() {
      MDChooseCharacteristicScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDChooseCharacteristicScreen.prototype.screenEnd = function() {
      return MDChooseCharacteristicScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDChooseCharacteristicScreen;

  })(masquerade.MDScreen);

}).call(this);
