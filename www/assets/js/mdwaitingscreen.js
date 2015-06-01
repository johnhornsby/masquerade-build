(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDWaitingScreen = (function(_super) {
    __extends(MDWaitingScreen, _super);

    function MDWaitingScreen(domNode) {
      MDWaitingScreen.__super__.constructor.call(this, domNode);
    }

    MDWaitingScreen.prototype.introStart = function() {
      var targetColour, timeout;
      this.__showWaitingForServer();
      MDWaitingScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.GREEN;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"], false);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
    };

    MDWaitingScreen.prototype.outroStart = function() {
      MDWaitingScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDWaitingScreen.prototype.screenEnd = function() {
      return MDWaitingScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDWaitingScreen;

  })(masquerade.MDScreen);

}).call(this);
