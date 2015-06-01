(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.HowToPlayScreen = (function(_super) {
    __extends(HowToPlayScreen, _super);

    function HowToPlayScreen(domNode) {
      HowToPlayScreen.__super__.constructor.call(this, domNode);
    }

    HowToPlayScreen.prototype.__init = function() {
      return HowToPlayScreen.__super__.__init.apply(this, arguments);
    };

    HowToPlayScreen.prototype.__build = function() {
      return HowToPlayScreen.__super__.__build.apply(this, arguments);
    };

    HowToPlayScreen.prototype.screenStart = function() {
      return HowToPlayScreen.__super__.screenStart.apply(this, arguments);
    };

    HowToPlayScreen.prototype.introStart = function() {
      var timeout;
      HowToPlayScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"], false);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.RED ? 100 : 1000;
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      return this.__fadeColorTo(masquerade.ColourManager.RED);
    };

    HowToPlayScreen.prototype.outroStart = function() {
      HowToPlayScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    HowToPlayScreen.prototype.screenEnd = function() {
      return HowToPlayScreen.__super__.screenEnd.apply(this, arguments);
    };

    return HowToPlayScreen;

  })(masquerade.Screen);

}).call(this);
