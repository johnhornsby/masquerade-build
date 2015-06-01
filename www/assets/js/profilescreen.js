(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ProfileScreen = (function(_super) {
    __extends(ProfileScreen, _super);

    ProfileScreen.prototype.__textInput = {};

    ProfileScreen.prototype.__uiDropdownViews = [];

    ProfileScreen.prototype.__prepareToSaveNickName = null;

    ProfileScreen.prototype.__prepareToSaveAge = null;

    ProfileScreen.prototype.__prepareToSaveGender = null;

    ProfileScreen.prototype.__prepareToSavePrivacy = null;

    function ProfileScreen(domNode) {
      this.__dropdownOpen = __bind(this.__dropdownOpen, this);
      this.__dropdownChange = __bind(this.__dropdownChange, this);
      this.__onTextFieldOnChange = __bind(this.__onTextFieldOnChange, this);
      this.__checkboxChange = __bind(this.__checkboxChange, this);
      ProfileScreen.__super__.constructor.call(this, domNode);
    }

    ProfileScreen.prototype.__init = function() {
      return ProfileScreen.__super__.__init.apply(this, arguments);
    };

    ProfileScreen.prototype.__build = function() {
      ProfileScreen.__super__.__build.apply(this, arguments);
      this.__textInput = this.__domNode.getElementsByTagName('input')[0];
      this.__textInput.addEventListener("change", this.__onTextFieldOnChange, false);
      $(this.__textInput).val(this.__g.localStorageManager.getName());
      return $(this.__domNode).find(".ui-checkbox").change(this.__checkboxChange);
    };

    ProfileScreen.prototype.__checkboxChange = function() {
      var isOK;
      isOK = $('.ui-checkbox').prop("checked");
      return this.__prepareToSavePrivacy = isOK === false;
    };

    ProfileScreen.prototype.__onTextFieldOnChange = function(event) {
      var name;
      name = $(this.__textInput).val();
      return this.__prepareToSaveNickName = name;
    };

    ProfileScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ProfileScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-apply")) {
        this.__applySavedData();
        if (this.__g.localStorageManager.isProfileValid()) {
          return this.__g.navigationBar.goBack();
        } else {
          return this.__g.rootViewController.alert({
            message: "Your player profile is incomplete!"
          });
        }
      }
    };

    ProfileScreen.prototype.__dropdownChange = function(event) {
      var dataValue, dropdownView, index;
      dropdownView = event.data.currentTarget;
      index = event.data.index;
      dataValue = $(dropdownView.getDomNode()).find("a").eq(index).attr("data-value");
      if ($(dropdownView.getDomNode()).hasClass("ui-dropdown-age")) {
        return this.__prepareToSaveAge = parseInt(dataValue, 10);
      } else {
        return this.__prepareToSaveGender = parseInt(dataValue, 10);
      }
    };

    ProfileScreen.prototype.__dropdownOpen = function(event) {
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

    ProfileScreen.prototype.__applySavedData = function() {
      if (this.__prepareToSaveNickName != null) {
        this.__g.localStorageManager.setName(this.__prepareToSaveNickName);
      }
      if (this.__prepareToSaveAge != null) {
        this.__g.localStorageManager.setAge(this.__prepareToSaveAge);
      }
      if (this.__prepareToSaveGender != null) {
        this.__g.localStorageManager.setGender(this.__prepareToSaveGender);
      }
      if (this.__prepareToSavePrivacy != null) {
        return this.__g.localStorageManager.setPrivacy(this.__prepareToSavePrivacy);
      }
    };

    ProfileScreen.prototype.introStart = function() {
      var dropdown, dropdownContentString, dropdownView, index, isAgeDropDown, itemValue, listItem, localStorageValue, selectedClass, timeout, _i, _j, _len, _len1, _ref, _ref1;
      ProfileScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.BLUE ? 100 : 1000;
      this.__fadeColorTo(masquerade.ColourManager.BLUE);
      this.__uiDropdownViews = [];
      dropdownView = void 0;
      dropdownContentString = '';
      selectedClass = '';
      index = 0;
      isAgeDropDown = false;
      localStorageValue = void 0;
      itemValue = void 0;
      $(".ui-dropdown-input").addClass("enabled");
      _ref = this.__domNode.getElementsByClassName("ui-dropdown");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dropdown = _ref[_i];
        if ($(dropdown).hasClass("ui-dropdown-age")) {
          isAgeDropDown = true;
        } else {
          isAgeDropDown = false;
        }
        _ref1 = dropdown.getElementsByTagName("a");
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          listItem = _ref1[_j];
          if (isAgeDropDown) {
            localStorageValue = parseInt(this.__g.localStorageManager.getAge());
          } else {
            localStorageValue = parseInt(this.__g.localStorageManager.getGender());
          }
          itemValue = parseInt($(listItem).attr("data-value"));
          if (itemValue === localStorageValue) {
            $(listItem).addClass("selected");
          }
        }
        dropdownView = new masquerade.UIDropdownView({
          domNode: dropdown
        });
        dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE, this.__dropdownChange);
        dropdownView.addEventListener(masquerade.UIDropdownView.OPEN, this.__dropdownOpen);
        this.__uiDropdownViews.push(dropdownView);
      }
      $(this.__domNode).find(".ui-checkbox").prop("checked", !this.__g.localStorageManager.getPrivacy());
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    ProfileScreen.prototype.outroStart = function() {
      ProfileScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ProfileScreen.prototype.screenEnd = function() {
      return ProfileScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ProfileScreen;

  })(masquerade.MDScreen);

}).call(this);
