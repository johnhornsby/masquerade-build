(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.HighScoresScreen = (function(_super) {
    __extends(HighScoresScreen, _super);

    function HighScoresScreen(domNode) {
      HighScoresScreen.__super__.constructor.call(this, domNode);
    }

    HighScoresScreen.prototype.__init = function() {
      return HighScoresScreen.__super__.__init.apply(this, arguments);
    };

    HighScoresScreen.prototype.__build = function() {
      var a, i, o, rows, _i, _len, _results;
      HighScoresScreen.__super__.__build.apply(this, arguments);
      a = this.__g.localStorageManager.getHighScores();
      rows = this.__domNode.getElementsByTagName("tr");
      i = 0;
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        o = a[_i];
        rows[i].childNodes[1].innerHTML = Math.round(o.score);
        rows[i].childNodes[2].innerHTML = o.name;
        _results.push(i++);
      }
      return _results;
    };

    HighScoresScreen.prototype.screenStart = function() {
      return HighScoresScreen.__super__.screenStart.apply(this, arguments);
    };

    HighScoresScreen.prototype.introStart = function() {
      var timeout;
      HighScoresScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["back"], false);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.PURPLE ? 100 : 1000;
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      return this.__fadeColorTo(masquerade.ColourManager.PURPLE);
    };

    HighScoresScreen.prototype.outroStart = function() {
      HighScoresScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    HighScoresScreen.prototype.screenEnd = function() {
      return HighScoresScreen.__super__.screenEnd.apply(this, arguments);
    };

    return HighScoresScreen;

  })(masquerade.Screen);

}).call(this);
