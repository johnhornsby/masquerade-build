(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDWaitingForPlayersScreen = (function(_super) {
    __extends(MDWaitingForPlayersScreen, _super);

    function MDWaitingForPlayersScreen(domNode) {
      MDWaitingForPlayersScreen.__super__.constructor.call(this, domNode);
    }

    MDWaitingForPlayersScreen.prototype.screenStart = function() {
      MDWaitingForPlayersScreen.__super__.screenStart.apply(this, arguments);
      return this.__showWaitingCircle();
    };

    MDWaitingForPlayersScreen.prototype.introStart = function() {
      var targetColour, timeout;
      MDWaitingForPlayersScreen.__super__.introStart.apply(this, arguments);
      switch (this.__g.mdGameManager.getGUIDRole(this.__g.guid)) {
        case masquerade.MDGameManager.ROLE_PRETENDER:
          targetColour = masquerade.ColourManager.GREEN;
          break;
        case masquerade.MDGameManager.ROLE_NON_PRETENDER:
          targetColour = masquerade.ColourManager.GREEN;
          break;
        case masquerade.MDGameManager.ROLE_JUDGE:
          targetColour = masquerade.ColourManager.BLUE;
      }
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"]);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    MDWaitingForPlayersScreen.prototype.outroStart = function() {
      MDWaitingForPlayersScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    return MDWaitingForPlayersScreen;

  })(masquerade.MDScreen);

}).call(this);
