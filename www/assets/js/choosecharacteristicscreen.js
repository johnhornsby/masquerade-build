(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ChooseCharacteristicScreen = (function(_super) {
    __extends(ChooseCharacteristicScreen, _super);

    ChooseCharacteristicScreen.prototype.__textInputs = [];

    ChooseCharacteristicScreen.prototype.__characteristic = "";

    ChooseCharacteristicScreen.prototype.__select = {};

    ChooseCharacteristicScreen.prototype.__tableViewItemInstances = [];

    ChooseCharacteristicScreen.prototype.__uiListView = void 0;

    function ChooseCharacteristicScreen(domNode) {
      this.__onListItemSelect = __bind(this.__onListItemSelect, this);
      this.__onTextFieldOnBlur = __bind(this.__onTextFieldOnBlur, this);
      this.__onTextFieldOnFocus = __bind(this.__onTextFieldOnFocus, this);
      ChooseCharacteristicScreen.__super__.constructor.call(this, domNode);
      this.__tableViewItemInstances = [];
    }

    ChooseCharacteristicScreen.prototype.__init = function() {
      return ChooseCharacteristicScreen.__super__.__init.apply(this, arguments);
    };

    ChooseCharacteristicScreen.prototype.__build = function() {
      var textInput, textInputs, _i, _len;
      ChooseCharacteristicScreen.__super__.__build.apply(this, arguments);
      this.__textInputs = [];
      textInputs = this.__domNode.getElementsByTagName('input');
      for (_i = 0, _len = textInputs.length; _i < _len; _i++) {
        textInput = textInputs[_i];
        textInput.addEventListener("blur", this.__onTextFieldOnBlur, false);
        textInput.addEventListener("focus", this.__onTextFieldOnFocus, false);
        this.__textInputs.push(textInput);
      }
      if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
        return this.__domNode.getElementsByTagName('section')[1].style.display = "none";
      }
    };

    ChooseCharacteristicScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ChooseCharacteristicScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__saveData();
          if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
            this.__g.gameManager.setPlayerRoles("judge", "pretender", "non-pretender");
            this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
              name: "choose-questions"
            }));
          } else {
            this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
              name: "ready"
            }));
          }
          return this.__removeInteractivity();
        } else {
          return this.__displayIncompleteFormData();
        }
      }
    };

    ChooseCharacteristicScreen.prototype.__onTextFieldOnFocus = function(event) {
      return this.__uiListView.setSelectedIndex(-1);
    };

    ChooseCharacteristicScreen.prototype.__onTextFieldOnBlur = function(event) {
      var textInput;
      textInput = this.__textInputs[0];
      if (textInput.value !== "") {
        this.__uiListView.setSelectedIndex(-1);
      }
      return this.__characteristic = textInput.value;
    };

    ChooseCharacteristicScreen.prototype.__onListItemSelect = function(event) {
      this.__textInputs[0].value = "";
      return this.__characteristic = event.data.text;
    };

    ChooseCharacteristicScreen.prototype.__validate = function() {
      if (this.__characteristic === "") {
        return false;
      }
      return true;
    };

    ChooseCharacteristicScreen.prototype.__displayIncompleteFormData = function() {
      window.log("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "You have not chosen a characteristic"
      });
    };

    ChooseCharacteristicScreen.prototype.__saveData = function() {
      return this.__g.gameManager.setRoundCharacteristic(this.__characteristic);
    };

    ChooseCharacteristicScreen.prototype.introStart = function() {
      var characteristicData, dropdownContentString, options, selectedClass, timeout, _i, _len, _ref;
      ChooseCharacteristicScreen.__super__.introStart.apply(this, arguments);
      if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
        $(".ui-table-view-content").empty();
        dropdownContentString = '';
        _ref = this.__g.gameManager.getTrainingCharacteristics();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          characteristicData = _ref[_i];
          selectedClass = "";
          dropdownContentString += "<li class='ui-table-view-item'><a href='#'" + selectedClass + ">" + characteristicData.characteristic + "</a></li>";
        }
        $(".ui-table-view-content").eq(0).append(dropdownContentString);
      }
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
      if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_TRAINING_MODE) {
        this.__fadeColorTo(masquerade.ColourManager.RED);
        this.__uiListView.updateColour();
        timeout = 1000;
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    ChooseCharacteristicScreen.prototype.outroStart = function() {
      ChooseCharacteristicScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ChooseCharacteristicScreen.prototype.screenEnd = function() {
      return ChooseCharacteristicScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ChooseCharacteristicScreen;

  })(masquerade.Screen);

}).call(this);
