(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.MDAcknowledgeRoleScreen = (function(_super) {
    __extends(MDAcknowledgeRoleScreen, _super);

    MDAcknowledgeRoleScreen.prototype.__hasAcknowledgedRole = false;

    function MDAcknowledgeRoleScreen(domNode) {
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      MDAcknowledgeRoleScreen.__super__.constructor.call(this, domNode);
    }

    MDAcknowledgeRoleScreen.prototype.__init = function() {
      return MDAcknowledgeRoleScreen.__super__.__init.apply(this, arguments);
    };

    MDAcknowledgeRoleScreen.prototype.__build = function() {
      return MDAcknowledgeRoleScreen.__super__.__build.apply(this, arguments);
    };

    MDAcknowledgeRoleScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDAcknowledgeRoleScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        this.__removeInteractivity();
        this.__g.mdGameManager.setHasAcknowledgedRole();
        if (this.__g.guid !== this.__g.mdGameManager.getRoleGUID("judge")) {
          if (this.__g.mdGameManager.getPhaseIndex() < 3) {
            return this.__checkWithGameManager();
          }
        }
      }
    };

    MDAcknowledgeRoleScreen.prototype.__checkWithGameManager = function() {
      MDAcknowledgeRoleScreen.__super__.__checkWithGameManager.apply(this, arguments);
      this.__g.debug("MDAcknowledgeRoleScreen __checkWithGameManager()");
      if (this.__g.mdGameManager.hasAcknowledgedRole()) {
        this.__hasAcknowledgedRole = true;
      }
      if (this.__hasAcknowledgedRole || this.__g.mdGameManager.hasAcknowledgedRole()) {
        return this.__showWaitingForServer();
      } else {
        return this.__hideWaitingForServer();
      }
    };

    MDAcknowledgeRoleScreen.prototype.introStart = function() {
      var html, otherPlayerClassName, otherPlayerNumber, otherPlayerString, player, players, targetColour, timeout, titleImageIndex, _i, _len, _results;
      this.__hideWaitingForServer();
      MDAcknowledgeRoleScreen.__super__.introStart.apply(this, arguments);
      targetColour = masquerade.ColourManager.GREEN;
      timeout = this.__g.colourManager.getCurrentColour() === targetColour ? 100 : 1000;
      this.__fadeColorTo(targetColour);
      this.__g.navigationBar.drawNavigationButtons(["pause"], false);
      setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), timeout);
      players = this.__g.mdGameManager.getPlayers();
      otherPlayerNumber = 1;
      otherPlayerClassName = "";
      otherPlayerString = "";
      titleImageIndex = 0;
      _results = [];
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        if (player.guid === this.__g.guid) {
          html = $("h2").html();
          $("h2").html("" + html + " " + player.name);
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
          otherPlayerNumber++;
          otherPlayerClassName = "player-" + otherPlayerNumber + "-role";
          otherPlayerString = "" + player.name + " <span class='spanBold'>" + player.role + "</span>";
          _results.push($("." + otherPlayerClassName).html(otherPlayerString));
        }
      }
      return _results;
    };

    MDAcknowledgeRoleScreen.prototype.outroStart = function() {
      MDAcknowledgeRoleScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    MDAcknowledgeRoleScreen.prototype.screenEnd = function() {
      this.__hideWaitingCircle();
      return MDAcknowledgeRoleScreen.__super__.screenEnd.apply(this, arguments);
    };

    return MDAcknowledgeRoleScreen;

  })(masquerade.MDScreen);

}).call(this);
