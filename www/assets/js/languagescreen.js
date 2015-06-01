(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.LanguageScreen = (function(_super) {
    __extends(LanguageScreen, _super);

    LanguageScreen.prototype.__uiListView = {};

    function LanguageScreen(domNode) {
      this.__onListItemSelect = __bind(this.__onListItemSelect, this);
      LanguageScreen.__super__.constructor.call(this, domNode);
    }

    LanguageScreen.prototype.__init = function() {
      return LanguageScreen.__super__.__init.apply(this, arguments);
    };

    LanguageScreen.prototype.__build = function() {
      return LanguageScreen.__super__.__build.apply(this, arguments);
    };

    LanguageScreen.prototype.__onListItemSelect = function(event) {
      var dataValue, dropdownView, index;
      dropdownView = event.data.currentTarget;
      index = event.data.index;
      dataValue = $(dropdownView.getDomNode()).find("a").eq(index).attr("data-value");
      this.__g.localStorageManager.setLanguage(parseInt(dataValue, 10));
      return this.__g.translationManager.updateLanguage();
    };

    LanguageScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      LanguageScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-confirm")) {
        return this.__g.navigationBar.goBack();
      }
    };

    LanguageScreen.prototype.introStart = function() {
      var itemValue, listItem, localStorageValue, options, tableView, timeout, _i, _j, _len, _len1, _ref, _ref1;
      LanguageScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.RED ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.RED);
      localStorageValue = void 0;
      itemValue = void 0;
      _ref = this.__domNode.getElementsByClassName("ui-table-view");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tableView = _ref[_i];
        _ref1 = tableView.getElementsByTagName("a");
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          listItem = _ref1[_j];
          localStorageValue = parseInt(this.__g.localStorageManager.getLanguage());
          itemValue = parseInt($(listItem).attr("data-value"));
          if (itemValue === localStorageValue) {
            $(listItem).addClass("selected");
          }
        }
      }
      options = {
        domNode: this.__domNode.getElementsByClassName("ui-table-view")[0]
      };
      this.__uiListView = new masquerade.UIListView(options);
      this.__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, this.__onListItemSelect);
      this.__uiListView.updateFrameDimensions();
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    LanguageScreen.prototype.outroStart = function() {
      LanguageScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    LanguageScreen.prototype.screenEnd = function() {
      return LanguageScreen.__super__.screenEnd.apply(this, arguments);
    };

    return LanguageScreen;

  })(masquerade.Screen);

}).call(this);
