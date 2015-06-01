(function() {
  var events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ReadyScreen = (function(_super) {
    __extends(ReadyScreen, _super);

    function ReadyScreen(domNode) {
      ReadyScreen.__super__.constructor.call(this, domNode);
    }

    ReadyScreen.prototype.__init = function() {
      return ReadyScreen.__super__.__init.apply(this, arguments);
    };

    ReadyScreen.prototype.__build = function() {
      var phaseIndex, titleImageIndex;
      ReadyScreen.__super__.__build.apply(this, arguments);
      phaseIndex = this.__g.gameManager.getPhaseIndex();
      this.__domNode.getElementsByTagName('h2')[0].innerHTML += this.__g.gameManager.getCurrentPlayerName();
      switch (phaseIndex) {
        case 0:
          this.__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to enter your question?";
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "The characteristic is " + "<span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
          break;
        case 1:
          this.__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to enter your answer?";
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
          break;
        case 2:
          this.__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to answer your question?";
          this.__domNode.getElementsByTagName('h4')[0].innerHTML = "YOU MUST ANSWER HONESTLY AS " + "<span class='spanBold'>'" + this.__g.gameManager.getRoundCharacteristic() + "'</span>";
          break;
        case 3:
          this.__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to judge?";
      }
      titleImageIndex = phaseIndex === 3 ? 0 : phaseIndex;
      return $(this.__domNode.getElementsByClassName("title-image")[titleImageIndex]).removeClass("hide");
    };

    ReadyScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      ReadyScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-next")) {
        if (this.__g.gameManager.getPhaseIndex() === 0) {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "enter-question"
          }));
        } else if (this.__g.gameManager.getPhaseIndex() < 3) {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "enter-answer"
          }));
        } else {
          this.dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO, {
            name: "reveal"
          }));
        }
      }
      return this.__removeInteractivity();
    };

    ReadyScreen.prototype.introStart = function() {
      var phaseIndex;
      ReadyScreen.__super__.introStart.apply(this, arguments);
      this.__g.navigationBar.drawNavigationButtons(["pause"], false);
      phaseIndex = this.__g.gameManager.getPhaseIndex();
      switch (phaseIndex) {
        case 1:
          this.__fadeColorTo(masquerade.ColourManager.YELLOW);
          break;
        case 2:
          this.__fadeColorTo(masquerade.ColourManager.NAVY);
          break;
        default:
          this.__fadeColorTo(masquerade.ColourManager.RED);
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    ReadyScreen.prototype.outroStart = function() {
      ReadyScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ReadyScreen.prototype.screenEnd = function() {
      return ReadyScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ReadyScreen;

  })(masquerade.Screen);

}).call(this);
