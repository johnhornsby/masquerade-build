(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ChooseQuestionsScreen = (function(_super) {
    __extends(ChooseQuestionsScreen, _super);

    ChooseQuestionsScreen.prototype.__question = "";

    ChooseQuestionsScreen.prototype.__questionIndex = -1;

    ChooseQuestionsScreen.prototype.__select = {};

    function ChooseQuestionsScreen(domNode) {
      this.__onListItemSelect = __bind(this.__onListItemSelect, this);
      ChooseQuestionsScreen.__super__.constructor.call(this, domNode);
    }

    ChooseQuestionsScreen.prototype.__init = function() {
      return ChooseQuestionsScreen.__super__.__init.apply(this, arguments);
    };

    ChooseQuestionsScreen.prototype.__build = function() {
      var str;
      ChooseQuestionsScreen.__super__.__build.apply(this, arguments);
      str = " <span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
      this.__g.translationManager.replaceTag(this.__domNode, "{CHARACTERISTIC}", str);
      return this.__g.navigationBar.setNavigationTitle(this.__domNode.getAttribute("data-navigation-title") + " " + (this.__g.gameManager.getQuestionIndex() + 1));
    };

    ChooseQuestionsScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ChooseQuestionsScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__validate()) {
          this.__saveData();
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "reveal"
          }));
          return this.__removeInteractivity();
        } else {
          return this.__displayIncompleteFormData();
        }
      }
    };

    ChooseQuestionsScreen.prototype.__onListItemSelect = function(event) {
      this.__question = event.data.text;
      return this.__questionIndex = event.data.index;
    };

    ChooseQuestionsScreen.prototype.__validate = function() {
      if (this.__question === "") {
        return false;
      }
      return true;
    };

    ChooseQuestionsScreen.prototype.__displayIncompleteFormData = function() {
      window.log("IN-VALID");
      return this.__g.rootViewController.alert({
        message: "You have not chosen a question"
      });
    };

    ChooseQuestionsScreen.prototype.__saveData = function() {
      var questionData;
      questionData = this.__g.gameManager.getTrainingQuestionWithIndex(this.__questionIndex);
      this.__g.gameManager.setPlayerText(this.__question);
      this.__g.gameManager.incrementPhaseIndex();
      this.__g.gameManager.setPlayerText(questionData.p);
      this.__g.gameManager.incrementPhaseIndex();
      this.__g.gameManager.setPlayerText(questionData.np);
      return this.__g.gameManager.incrementPhaseIndex();
    };

    ChooseQuestionsScreen.prototype.introStart = function() {
      var dropdownContentString, options, questionData, selectedClass, _i, _len, _ref;
      ChooseQuestionsScreen.__super__.introStart.apply(this, arguments);
      if (this.__g.gameManager.getQuestionIndex() > 0) {
        this.__g.navigationBar.drawNavigationButtons(["pause"]);
      } else {
        this.__g.navigationBar.drawNavigationButtons(["back"]);
      }
      dropdownContentString = '';
      _ref = this.__g.gameManager.getTrainingQuestions();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        questionData = _ref[_i];
        selectedClass = "";
        dropdownContentString += "<li class='ui-table-view-item'><a href='#'" + selectedClass + ">" + questionData.j + "</a></li>";
      }
      $(".ui-table-view-content").eq(0).append(dropdownContentString);
      options = {
        domNode: this.__domNode.getElementsByClassName("ui-table-view")[0]
      };
      this.__uiListView = new masquerade.UIListView(options);
      this.__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, this.__onListItemSelect);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    ChooseQuestionsScreen.prototype.outroStart = function() {
      ChooseQuestionsScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ChooseQuestionsScreen.prototype.screenEnd = function() {
      return ChooseQuestionsScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ChooseQuestionsScreen;

  })(masquerade.Screen);

}).call(this);
