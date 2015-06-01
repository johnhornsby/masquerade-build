(function() {
  var display, events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.AlertScreen = (function(_super) {
    __extends(AlertScreen, _super);

    AlertScreen.prototype.__useLabel = "";

    AlertScreen.prototype.__clickedOK = true;

    AlertScreen.prototype.__container = {};

    function AlertScreen(domNode) {
      AlertScreen.__super__.constructor.call(this, domNode);
      this.__useLabel = "";
      this.__clickedOK = true;
      this.__container = {};
      this.__domNode = domNode;
    }

    AlertScreen.prototype.__init = function() {
      return AlertScreen.__super__.__init.apply(this, arguments);
    };

    AlertScreen.prototype.__build = function() {
      AlertScreen.__super__.__build.apply(this, arguments);
      this.__addInteractivity();
      $(this.__domNode).css("width", window.innerWidth + "px");
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        $(this.__domNode).addClass("android2");
      }
      return this.__setInitStyle();
    };

    AlertScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      AlertScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-ok")) {
        this.__clickedOK = true;
        this.dispatchEvent(new events.Event(masquerade.AlertScreen.OK_CLICK, {
          label: this.__useLabel
        }));
      }
      if ($(button).hasClass("button-cancel")) {
        this.__clickedOK = false;
        return this.dispatchEvent(new events.Event(masquerade.AlertScreen.CANCEL_CLICK, {
          label: this.__useLabel
        }));
      }
    };

    AlertScreen.prototype.__introComplete = function() {
      return AlertScreen.__super__.__introComplete.apply(this, arguments);
    };

    AlertScreen.prototype.__outroComtplete = function() {
      AlertScreen.__super__.__outroComtplete.apply(this, arguments);
      return this.__domNode.style.display = "none";
    };

    AlertScreen.prototype.__setInitStyle = function() {
      TweenMax.set(this.__domNode, {
        opacity: 1,
        perspective: 500
      });
      this.__container = $(this.__domNode).find(".lightbox-content-container");
      return TweenMax.set(this.__container, {
        scaleX: 0.85,
        scaleY: 0.85,
        force3D: true
      });
    };

    AlertScreen.prototype.__cueIntroAnimation = function() {
      TweenMax.to(this.__domNode, 0.5, {
        opacity: 1,
        ease: Strong.easeOut,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd
      });
      return TweenMax.to(this.__container, 0.5, {
        scaleX: 1,
        scaleY: 1,
        ease: Elastic.easeOut
      });
    };

    AlertScreen.prototype.__cueOutroAnimation = function() {
      TweenMax.to(this.__domNode, 0.2, {
        opacity: 0,
        ease: Strong.easeOut,
        onStart: this.__animationStart,
        onComplete: this.__animationEnd
      });
      return TweenMax.to(this.__container, 0.2, {
        scaleX: 0.85,
        scaleY: 0.85,
        ease: Expo.easeOut
      });
    };

    AlertScreen.prototype.introStart = function() {
      AlertScreen.__super__.introStart.apply(this, arguments);
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

    AlertScreen.prototype.outroStart = function() {
      var self;
      AlertScreen.__super__.outroStart.apply(this, arguments);
      self = this.__domNode;
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 350);
    };

    AlertScreen.prototype.screenEnd = function() {
      AlertScreen.__super__.screenEnd.apply(this, arguments);
      return $(this.__domNode).find(".message").html("");
    };

    AlertScreen.prototype.setContent = function(contentObject) {
      var cancel, messageHTML, ok;
      if (contentObject == null) {
        contentObject = {};
      }
      messageHTML = contentObject.message !== void 0 ? contentObject.message : "";
      $(this.__domNode).find(".message").html(messageHTML);
      ok = contentObject.ok !== void 0 ? contentObject.ok : "OK";
      $(this.__domNode).find(".button-ok").html(ok);
      cancel = contentObject.cancel !== void 0 ? contentObject.cancel : "CANCEL";
      $(this.__domNode).find(".button-cancel").html(cancel);
      if (contentObject.cancel) {
        $(this.__domNode).find(".button-cancel").css({
          display: "inline-block"
        });
      } else {
        $(this.__domNode).find(".button-cancel").css({
          display: "none"
        });
      }
      return this.__useLabel = contentObject.label !== void 0 ? contentObject.label : "";
    };

    return AlertScreen;

  })(masquerade.InteractiveElement);

  masquerade.AlertScreen.OK_CLICK = "okClick";

  masquerade.AlertScreen.CANCEL_CLICK = "cancelClick";

}).call(this);
