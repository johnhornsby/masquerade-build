(function() {
  var display, events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.PauseScreen = (function(_super) {
    __extends(PauseScreen, _super);

    function PauseScreen(domNode) {
      PauseScreen.__super__.constructor.call(this, domNode);
      this.__domNode = domNode;
    }

    PauseScreen.prototype.__init = function() {
      return PauseScreen.__super__.__init.apply(this, arguments);
    };

    PauseScreen.prototype.__build = function() {
      PauseScreen.__super__.__build.apply(this, arguments);
      this.__addInteractivity();
      $(this.__domNode).css("width", window.innerWidth + "px");
      return this.__setInitStyle();
    };

    PauseScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      PauseScreen.__super__.__handleButtonEvent.apply(this, arguments);
      mouseEvent.stopPropagation();
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-resume")) {
        this.dispatchEvent(new events.Event(masquerade.PauseScreen.RESUME_GAME_CLICK));
      }
      if ($(button).hasClass("button-exit")) {
        return this.dispatchEvent(new events.Event(masquerade.PauseScreen.EXIT_GAME_CLICK));
      }
    };

    PauseScreen.prototype.__introComplete = function() {
      return PauseScreen.__super__.__introComplete.apply(this, arguments);
    };

    PauseScreen.prototype.__outroComtplete = function() {
      PauseScreen.__super__.__outroComtplete.apply(this, arguments);
      $(this.__domNode).removeClass("fadeOutEnable");
      return this.__domNode.style.display = "none";
    };

    PauseScreen.prototype.__setInitStyle = function() {
      TweenMax.set(this.__domNode, {
        opacity: 1,
        perspective: 500
      });
      this.__container = $(this.__domNode).find(".lightbox-content-container");
      return TweenMax.set(this.__container, {
        scaleX: 1.2,
        scaleY: 1.2,
        force3D: true
      });
    };

    PauseScreen.prototype.__cueIntroAnimation = function() {
      TweenMax.to(this.__domNode, 0.5, {
        opacity: 1,
        ease: Strong.easeOut,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd
      });
      return TweenMax.to(this.__container, 0.5, {
        scaleX: 1,
        scaleY: 1,
        ease: Expo.easeOut
      });
    };

    PauseScreen.prototype.__cueOutroAnimation = function() {
      TweenMax.to(this.__domNode, 0.2, {
        opacity: 0,
        ease: Strong.easeOut,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd
      });
      return TweenMax.to(this.__container, 0.2, {
        scaleX: 1.2,
        scaleY: 1.2,
        ease: Expo.easeOut
      });
    };

    PauseScreen.prototype.introStart = function() {
      PauseScreen.__super__.introStart.apply(this, arguments);
      if (this.__g.mdGameManager.isActive()) {
        $(this.__domNode).find("h6").html(this.__g.mdGameManager.getPin());
        $(this.__domNode).find("h6").show();
      } else {
        $(this.__domNode).find("h6").hide();
      }
      setTimeout((function(_this) {
        return function() {
          return _this.__domNode.style.display = "block";
        };
      })(this), 300);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 350);
    };

    PauseScreen.prototype.outroStart = function() {
      var self;
      PauseScreen.__super__.outroStart.apply(this, arguments);
      setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 350);
      return self = this.__domNode;
    };

    PauseScreen.prototype.screenEnd = function() {
      return PauseScreen.__super__.screenEnd.apply(this, arguments);
    };

    return PauseScreen;

  })(masquerade.InteractiveElement);

  masquerade.PauseScreen.EXIT_GAME_CLICK = "exitGame";

  masquerade.PauseScreen.RESUME_GAME_CLICK = "resumeGame";

}).call(this);
