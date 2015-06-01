(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDWaitingForJudgementScreen = (function(_super) {
    __extends(MDWaitingForJudgementScreen, _super);

    function MDWaitingForJudgementScreen(domNode) {
      MDWaitingForJudgementScreen.__super__.constructor.call(this, domNode);
    }

    MDWaitingForJudgementScreen.prototype.introStart = function() {
      var targetColour, timeout;
      this.__showWaitingForServer();
      MDWaitingForJudgementScreen.__super__.introStart.apply(this, arguments);
      switch (this.__g.mdGameManager.getGUIDRole(this.__g.guid)) {
        case masquerade.MDGameManager.ROLE_PRETENDER:
          targetColour = masquerade.ColourManager.YELLOW;
          break;
        case masquerade.MDGameManager.ROLE_NON_PRETENDER:
          targetColour = masquerade.ColourManager.NAVY;
      }
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"], false);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDWaitingForJudgementScreen.prototype.outroStart = function() {
      MDWaitingForJudgementScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDWaitingForJudgementScreen.prototype.screenEnd = function() {
      return MDWaitingForJudgementScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDWaitingForJudgementScreen;

  })(masquerade.MDScreen);

}).call(this);
