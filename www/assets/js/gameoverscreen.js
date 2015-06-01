(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.GameOverScreen = (function(_super) {
    __extends(GameOverScreen, _super);

    function GameOverScreen(domNode) {
      GameOverScreen.__super__.constructor.call(this, domNode);
    }

    GameOverScreen.prototype.__init = function() {
      return GameOverScreen.__super__.__init.apply(this, arguments);
    };

    GameOverScreen.prototype.__build = function() {
      var i, nameCell, nameCells, scoreCell, scoreCells, scoreData, table, _i, _j, _len, _len1, _results;
      GameOverScreen.__super__.__build.apply(this, arguments);
      table = this.__domNode.getElementsByTagName('table')[0];
      scoreData = this.__g.gameManager.getFinalScoreData();
      scoreCells = this.__domNode.getElementsByClassName('cell-score');
      nameCells = this.__domNode.getElementsByClassName('cell-name');
      i = -1 + scoreCells.length;
      for (_i = 0, _len = scoreCells.length; _i < _len; _i++) {
        scoreCell = scoreCells[_i];
        scoreCell.innerHTML = scoreData[i].score;
        i--;
      }
      i = -1 + scoreCells.length;
      _results = [];
      for (_j = 0, _len1 = nameCells.length; _j < _len1; _j++) {
        nameCell = nameCells[_j];
        nameCell.innerHTML = scoreData[i].name;
        _results.push(i--);
      }
      return _results;
    };

    GameOverScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      GameOverScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-home")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "home",
          clearHistory: true
        }));
      }
      if ($(button).hasClass("button-high-scores")) {
        this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
          name: "high-scores",
          clearHistory: true
        }));
      }
      return this.__removeInteractivity();
    };

    GameOverScreen.prototype.introStart = function() {
      var timeout;
      GameOverScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons([], false);
      timeout = this.__g.colourManager.getCurrentColour() === masquerade.ColourManager.RED ? 100 : 1000;
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      return this.__fadeColorTo(masquerade.ColourManager.RED);
    };

    GameOverScreen.prototype.outroStart = function() {
      GameOverScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    GameOverScreen.prototype.screenEnd = function() {
      return GameOverScreen.__super__.screenEnd.apply(this, arguments);
    };

    return GameOverScreen;

  })(masquerade.Screen);

}).call(this);
