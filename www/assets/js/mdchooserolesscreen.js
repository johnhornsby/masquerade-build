(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDChooseRolesScreen = (function(_super) {
    __extends(MDChooseRolesScreen, _super);

    MDChooseRolesScreen.prototype.__uiDropdownViews = [];

    MDChooseRolesScreen.prototype.__players = [];

    MDChooseRolesScreen.prototype.__judgeGUID = "";

    MDChooseRolesScreen.prototype.__defaultRoles = ["judge", "pretender", "non-pretender"];

    MDChooseRolesScreen.prototype.__nonPretenderGUID = "";

    MDChooseRolesScreen.prototype.__pretenderGUID = "";

    function MDChooseRolesScreen(domNode) {
      this.__onAlertOkClick = __bind(this.__onAlertOkClick, this);
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      this.__dropdownOpen = __bind(this.__dropdownOpen, this);
      this.__dropdownChange = __bind(this.__dropdownChange, this);
      MDChooseRolesScreen.__super__.constructor.call(this, domNode);
    }

    MDChooseRolesScreen.prototype.__init = function() {
      return MDChooseRolesScreen.__super__.__init.apply(this, arguments);
    };

    MDChooseRolesScreen.prototype.__build = function() {
      return MDChooseRolesScreen.__super__.__build.apply(this, arguments);
    };

    MDChooseRolesScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button, judgeHasChanged;
      MDChooseRolesScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__g.mdGameManager.isSingleRound()) {
          this.__closeAll();
          if (this.__validate()) {
            judgeHasChanged = this.__saveData();
            if (judgeHasChanged) {
              this.__removeAllServerActiveAnimation();
              return this.__g.rootViewController.alert({
                message: "Are you sure you want to resign your role as Judge?",
                ok: "Yes",
                cancel: "No",
                label: "resignAsJudge"
              });
            } else {
              this.__removeInteractivity();
              return this.__g.mdGameManager.confirmRoles(this.__judgeGUID, this.__nonPretenderGUID, this.__pretenderGUID);
            }
          } else {
            this.__removeAllServerActiveAnimation();
            return this.__displayIncompleteFormData();
          }
        } else {
          return this.__g.debug("acknowledge");
        }
      }
    };

    MDChooseRolesScreen.prototype.__dropdownChange = function(event) {
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

    MDChooseRolesScreen.prototype.__dropdownOpen = function(event) {
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

    MDChooseRolesScreen.prototype.__closeAll = function() {
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

    MDChooseRolesScreen.prototype.__validate = function() {
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

    MDChooseRolesScreen.prototype.__displayIncompleteFormData = function() {
      this.__g.debug("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "You have not defined each player role",
        label: "validation"
      });
    };

    MDChooseRolesScreen.prototype.__saveData = function() {
      var index, input, judgeHasChanged, role, _i, _len, _ref;
      index = 0;
      role = "";
      judgeHasChanged = false;
      _ref = this.__domNode.getElementsByTagName("input");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        role = input.value.toLowerCase();
        switch (role) {
          case "judge":
            this.__judgeGUID = this.__players[index].guid;
            if (this.__judgeGUID !== this.__g.guid) {
              judgeHasChanged = true;
            }
            break;
          case "non-pretender":
            this.__nonPretenderGUID = this.__players[index].guid;
            break;
          case "pretender":
            this.__pretenderGUID = this.__players[index].guid;
        }
        index++;
      }
      return judgeHasChanged;
    };

    MDChooseRolesScreen.prototype.__writePlayerNames = function() {
      var playerNameTags, playerNames;
      playerNameTags = this.__domNode.getElementsByTagName('h3');
      playerNames = this.__g.gameManager.getPlayerNames();
      playerNameTags[0].innerHTML = this.__players[0].name;
      playerNameTags[1].innerHTML = this.__players[1].name;
      return playerNameTags[2].innerHTML = this.__players[2].name;
    };

    MDChooseRolesScreen.prototype.__checkWithGameManager = function() {
      var previousJudgeName;
      MDChooseRolesScreen.__super__.__checkWithGameManager.apply(this, arguments);
      console.log("MDChooseRolesScreen __checkWithGameManager()");
      this.__players = this.__g.mdGameManager.getPlayers();
      if (this.__judgeGUID !== this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)) {
        this.__g.debug("updated judge");
        if (this.__judgeGUID !== "" && this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) === this.__g.guid) {
          previousJudgeName = this.__g.mdGameManager.getGUIDName(this.__judgeGUID);
          this.__g.rootViewController.alert({
            message: "" + previousJudgeName + " has assigned you the role of Judge",
            label: "reasignedAsJudge"
          });
        }
        this.__judgeGUID = this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE);
      }
      if (this.__g.mdGameManager.isSingleRound()) {
        if (this.__g.guid === this.__judgeGUID) {
          this.__showFrame1();
          this.__populateDropdowns();
          return this.__addInteractivity();
        } else {
          return this.__showFrame2();
        }
      } else {
        this.__showFrame3();
        return this.__addInteractivity();
      }
    };

    MDChooseRolesScreen.prototype.__showFrame1 = function() {
      $(".frame-1").show();
      $(".frame-2").hide();
      $(".frame-3").hide();
      return this.__hideWaitingCircle();
    };

    MDChooseRolesScreen.prototype.__showFrame2 = function() {
      $(".frame-1").hide();
      $(".frame-2").show();
      $(".frame-3").hide();
      return this.__showWaitingCircle();
    };

    MDChooseRolesScreen.prototype.__showFrame3 = function() {
      $(".frame-1").hide();
      $(".frame-2").hide();
      $(".frame-3").show();
      return this.__hideWaitingCircle();
    };

    MDChooseRolesScreen.prototype.__populateDropdowns = function() {
      var dropdown, dropdownContentString, dropdownView, index, inputs, player, role, selectedClass, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
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
        _ref1 = this.__defaultRoles;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          role = _ref1[_j];
          selectedClass = role === this.__players[index].role ? " class='selected'" : "";
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
      inputs = this.__domNode.getElementsByTagName("input");
      index = 0;
      _ref2 = this.__players;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        player = _ref2[_k];
        inputs[index].value = player.role;
        _results.push(index++);
      }
      return _results;
    };

    MDChooseRolesScreen.prototype.__onAlertOkClick = function(e) {
      if (e.data.label === "resignAsJudge") {
        this.__removeInteractivity();
        return this.__g.mdGameManager.confirmRoles(this.__judgeGUID, this.__nonPretenderGUID, this.__pretenderGUID);
      }
    };

    MDChooseRolesScreen.prototype.introStart = function() {
      var targetColour, timeout;
      MDChooseRolesScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.GREEN;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"]);
      this.__writePlayerNames();
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDChooseRolesScreen.prototype.screenStart = function() {
      MDChooseRolesScreen.__super__.screenStart.apply(this, arguments);
      return this.__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
    };

    MDChooseRolesScreen.prototype.outroStart = function() {
      MDChooseRolesScreen.__super__.outroStart.apply(this, arguments);
      this.__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDChooseRolesScreen.prototype.screenEnd = function() {
      return MDChooseRolesScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDChooseRolesScreen;

  })(masquerade.MDScreen);

}).call(this);
