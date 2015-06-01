(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ChooseRolesScreen = (function(_super) {
    __extends(ChooseRolesScreen, _super);

    ChooseRolesScreen.prototype.__uiDropdownViews = [];

    function ChooseRolesScreen(domNode) {
      this.__dropdownOpen = __bind(this.__dropdownOpen, this);
      this.__dropdownChange = __bind(this.__dropdownChange, this);
      ChooseRolesScreen.__super__.constructor.call(this, domNode);
    }

    ChooseRolesScreen.prototype.__init = function() {
      return ChooseRolesScreen.__super__.__init.apply(this, arguments);
    };

    ChooseRolesScreen.prototype.__build = function() {
      return ChooseRolesScreen.__super__.__build.apply(this, arguments);
    };

    ChooseRolesScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ChooseRolesScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        this.__closeAll();
        if (this.__validate()) {
          this.__saveData();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "choose-characteristic"
          }));
          return this.__removeInteractivity();
        } else {
          return this.__displayIncompleteFormData();
        }
      }
    };

    ChooseRolesScreen.prototype.__dropdownChange = function(event) {
      var compareIndex, compareSelectedText, d, dropdownView, index, narrowDownOptions, options, swapIndex, value, _i, _len, _ref;
      dropdownView = event.data.currentTarget;
      value = dropdownView.getSelectedText();
      options = ["judge", "pretender", "non-pretender"];
      narrowDownOptions = ["judge", "pretender", "non-pretender"];
      if (value !== "") {
        swapIndex = -1;
        index = 0;
        compareSelectedText = "";
        compareIndex = -1;
        _ref = this.__uiDropdownViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          compareSelectedText = d.getSelectedText();
          compareIndex = narrowDownOptions.indexOf(compareSelectedText);
          if (compareIndex !== -1) {
            narrowDownOptions.splice(compareIndex, 1);
          }
          if (d !== dropdownView) {
            if (value === d.getSelectedText()) {
              swapIndex = index;
            }
          }
          index++;
        }
        if (swapIndex !== -1) {
          return this.__uiDropdownViews[swapIndex].setSelectedIndex(options.indexOf(narrowDownOptions.pop()));
        }
      }
    };

    ChooseRolesScreen.prototype.__dropdownOpen = function(event) {
      var d, dropdownView, _i, _len, _ref, _results;
      dropdownView = event.data.currentTarget;
      _ref = this.__uiDropdownViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d !== dropdownView && d.isOpen() === true) {
          _results.push(d.close());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ChooseRolesScreen.prototype.__closeAll = function() {
      var d, _i, _len, _ref, _results;
      _ref = this.__uiDropdownViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.isOpen() === true) {
          _results.push(d.close());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ChooseRolesScreen.prototype.__validate = function() {
      var d, _i, _len, _ref;
      _ref = this.__domNode.getElementsByTagName("input");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.value === "") {
          return false;
        }
      }
      return true;
    };

    ChooseRolesScreen.prototype.__displayIncompleteFormData = function() {
      window.log("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "You have not defined each player role"
      });
    };

    ChooseRolesScreen.prototype.__saveData = function() {
      var input, roles, _i, _len, _ref;
      roles = [];
      _ref = this.__domNode.getElementsByTagName("input");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        roles.push(input.value.toLowerCase());
      }
      return this.__g.gameManager.setPlayerRoles(roles[0], roles[1], roles[2]);
    };

    ChooseRolesScreen.prototype.__writePlayerNames = function() {
      var $playerNameTags, playerNames;
      playerNames = this.__g.gameManager.getPlayerNames();
      $playerNameTags = $(this.__domNode).find("h3");
      $playerNameTags.eq(0).html(playerNames[0]);
      $playerNameTags.eq(1).html(playerNames[1]);
      return $playerNameTags.eq(2).html(playerNames[2]);
    };

    ChooseRolesScreen.prototype.introStart = function() {
      var autoSelectedRoles, avaibleRoles, dropdown, dropdownContentString, dropdownView, index, inputs, role, selectedClass, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      ChooseRolesScreen.__super__.introStart.apply(this, arguments);
      avaibleRoles = this.__g.gameManager.getAvailableRoles();
      autoSelectedRoles = this.__g.gameManager.getAutoCompletedRoles();
      if (this.__g.gameManager.getMode() === masquerade.GameManager.GAME_OPTION_SINGLE_ROUND) {
        this.__uiDropdownViews = [];
        dropdownView = void 0;
        dropdownContentString = '';
        selectedClass = '';
        index = 0;
        $(".ui-dropdown-input").addClass("enabled");
        $(".ui-table-view-content").empty();
        _ref = this.__domNode.getElementsByClassName("ui-dropdown");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dropdown = _ref[_i];
          dropdownContentString = '';
          _ref1 = avaibleRoles[index];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            role = _ref1[_j];
            selectedClass = role === autoSelectedRoles[index] ? " class='selected'" : "";
            dropdownContentString += "<li class='ui-table-view-item'><a href='#'" + selectedClass + ">" + role + "</a></li>";
          }
          $(".ui-table-view-content").eq(index).append(dropdownContentString);
          dropdownView = new masquerade.UIDropdownView({
            domNode: dropdown
          });
          dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE, this.__dropdownChange);
          dropdownView.addEventListener(masquerade.UIDropdownView.OPEN, this.__dropdownOpen);
          this.__uiDropdownViews.push(dropdownView);
          index++;
        }
      }
      inputs = this.__domNode.getElementsByTagName("input");
      index = 0;
      for (_k = 0, _len2 = autoSelectedRoles.length; _k < _len2; _k++) {
        role = autoSelectedRoles[_k];
        inputs[index].value = role;
        index++;
      }
      if (this.__g.gameManager.getRoundIndex() > 0) {
        this.__g.navigationBar.drawNavigationButtons(["pause"]);
      } else {
        this.__g.navigationBar.drawNavigationButtons(["back"]);
      }
      this.__writePlayerNames();
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    ChooseRolesScreen.prototype.outroStart = function() {
      ChooseRolesScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ChooseRolesScreen.prototype.screenEnd = function() {
      return ChooseRolesScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ChooseRolesScreen;

  })(masquerade.Screen);

}).call(this);
