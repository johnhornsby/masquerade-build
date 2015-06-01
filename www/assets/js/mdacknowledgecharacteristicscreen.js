(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDAcknowledgeCharacteristicScreen = (function(_super) {
    __extends(MDAcknowledgeCharacteristicScreen, _super);

    MDAcknowledgeCharacteristicScreen.prototype.__hasAcknowledgedCharacteristic = false;

    function MDAcknowledgeCharacteristicScreen(domNode) {
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      MDAcknowledgeCharacteristicScreen.__super__.constructor.call(this, domNode);
    }

    MDAcknowledgeCharacteristicScreen.prototype.__init = function() {
      return MDAcknowledgeCharacteristicScreen.__super__.__init.apply(this, arguments);
    };

    MDAcknowledgeCharacteristicScreen.prototype.__build = function() {
      return MDAcknowledgeCharacteristicScreen.__super__.__build.apply(this, arguments);
    };

    MDAcknowledgeCharacteristicScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      MDAcknowledgeCharacteristicScreen.__super__.__handleButtonEvent.apply(this, arguments);
      this.__removeInteractivity();
      this.__g.mdGameManager.setHasAcknowledgedCharacteristic();
      if (this.__g.mdGameManager.getPhaseIndex() < 5) {
        return this.__checkWithGameManager();
      }
    };

    MDAcknowledgeCharacteristicScreen.prototype.__checkWithGameManager = function() {
      MDAcknowledgeCharacteristicScreen.__super__.__checkWithGameManager.apply(this, arguments);
      this.__g.debug("MDAcknowledgeRoleScreen __checkWithGameManager()");
      if (this.__g.mdGameManager.hasAcknowledgedCharacteristic()) {
        this.__hasAcknowledgedCharacteristic = true;
      }
      if (this.__hasAcknowledgedCharacteristic || this.__g.mdGameManager.hasAcknowledgedCharacteristic()) {
        return this.__showWaitingForServer();
      } else {
        return this.__hideWaitingForServer();
      }
    };

    MDAcknowledgeCharacteristicScreen.prototype.introStart = function() {
      var otherPlayerClassName, otherPlayerNumber, otherPlayerString, player, players, targetColour, timeout, titleImageIndex, _i, _len, _results;
      this.__hideWaitingForServer();
      MDAcknowledgeCharacteristicScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.GREEN;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"], false);
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      $("h2").html(this.__g.mdGameManager.getCharacteristic());
      players = this.__g.mdGameManager.getPlayers();
      otherPlayerNumber = 1;
      otherPlayerClassName = "";
      otherPlayerString = "";
      titleImageIndex = 0;
      _results = [];
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        if (player.guid === this.__g.guid) {
          switch (player.role) {
            case "judge":
              titleImageIndex = 0;
              break;
            case "pretender":
              titleImageIndex = 1;
              break;
            case "non-pretender":
              titleImageIndex = 2;
          }
          _results.push($(this.__domNode.getElementsByClassName("title-image")[titleImageIndex]).removeClass("hide"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    MDAcknowledgeCharacteristicScreen.prototype.outroStart = function() {
      MDAcknowledgeCharacteristicScreen.__super__.outroStart.apply(this, arguments);
      if (this.__waitingCircle !== void 0) {
        this.__waitingCircle.stop();
      }
      this.__waitingCircle = void 0;
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDAcknowledgeCharacteristicScreen.prototype.screenEnd = function() {
      return MDAcknowledgeCharacteristicScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDAcknowledgeCharacteristicScreen;

  })(masquerade.MDScreen);

}).call(this);
