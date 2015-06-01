(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.MDScreen = (function(_super) {
    __extends(MDScreen, _super);

    MDScreen.prototype.__isValid = true;

    MDScreen.prototype.__isWaitingForServer = false;

    MDScreen.prototype.__waitingCircle = void 0;

    MDScreen.prototype.__activeFrame = void 0;

    MDScreen.prototype.__previousFrame = void 0;

    function MDScreen(domNode) {
      this.__onServerError = __bind(this.__onServerError, this);
      this.__sendToServerSuccess = __bind(this.__sendToServerSuccess, this);
      this.__sendToServer = __bind(this.__sendToServer, this);
      this.__checkWithGameManager = __bind(this.__checkWithGameManager, this);
      MDScreen.__super__.constructor.apply(this, arguments);
    }

    MDScreen.prototype.__introComplete = function() {
      return MDScreen.__super__.__introComplete.apply(this, arguments);
    };

    MDScreen.prototype.__build = function() {
      return MDScreen.__super__.__build.apply(this, arguments);
    };

    MDScreen.prototype.__checkWithGameManager = function() {};

    MDScreen.prototype.__killTweenMax = function() {
      return $(".frame").each(function() {
        return TweenMax.killTweensOf(this);
      });
    };

    MDScreen.prototype.__showWaitingForServer = function() {
      if (this.__isWaitingForServer === false) {
        this.__isWaitingForServer = true;
        $(".frame-1").hide();
        $(".frame-2").show();
        return this.__showWaitingCircle();
      }
    };

    MDScreen.prototype.__hideWaitingForServer = function() {
      if (this.__isWaitingForServer === true) {
        this.__isWaitingForServer = false;
        this.__hideWaitingForServer();
        $(".frame-1").show();
        $(".frame-2").hide();
        this.__hideWaitingCircle();
      }
      return this.__addInteractivity();
    };

    MDScreen.prototype.__initialiseFrame = function() {
      $(".frame-2").hide();
      return this.__isWaitingForServer = false;
    };

    MDScreen.prototype.__showWaitingCircle = function() {
      if (this.__waitingCircle === void 0) {
        this.__waitingCircle = new masquerade.WaitingCircle("waiting-for-server");
        return this.__waitingCircle.start();
      }
    };

    MDScreen.prototype.__hideWaitingCircle = function() {
      if (this.__waitingCircle !== void 0) {
        this.__waitingCircle.stop();
      }
      return this.__waitingCircle = void 0;
    };

    MDScreen.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      MDScreen.__super__.__handleButtonEvent.apply(this, arguments);
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-call-server")) {
        return $(button).addClass("button-active");
      }
    };

    MDScreen.prototype.__sendToServer = function() {};

    MDScreen.prototype.__sendToServerSuccess = function() {
      return this.__removeAllServerActiveAnimation();
    };

    MDScreen.prototype.__removeAllServerActiveAnimation = function() {
      return $(this.__domNode).find(".button-call-server.button-active").removeClass("button-active");
    };

    MDScreen.prototype.__onServerError = function(e) {};

    MDScreen.prototype.setIsValid = function(bool) {
      return this.__isValid = bool;
    };

    MDScreen.prototype.isValid = function() {
      return this.__isValid;
    };

    MDScreen.prototype.listenToMDGM = function() {
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__onServerError);
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_SERVER, this.__checkWithGameManager);
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__checkWithGameManager);
      return this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, this.__sendToServerSuccess);
    };

    MDScreen.prototype.ignoreMDGM = function() {
      this.__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__onServerError);
      this.__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_SERVER, this.__checkWithGameManager);
      this.__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__checkWithGameManager);
      return this.__g.mdGameManager.removeEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, this.__sendToServerSuccess);
    };

    MDScreen.prototype.introStart = function() {
      MDScreen.__super__.introStart.apply(this, arguments);
      this.__initialiseFrame();
      return this.__checkWithGameManager();
    };

    MDScreen.prototype.screenStart = function() {
      MDScreen.__super__.screenStart.apply(this, arguments);
      this.__checkWithGameManager();
      return this.listenToMDGM();
    };

    MDScreen.prototype.outroStart = function() {
      MDScreen.__super__.outroStart.apply(this, arguments);
      this.ignoreMDGM();
      return this.__killTweenMax();
    };

    MDScreen.prototype.screenEnd = function() {
      MDScreen.__super__.screenEnd.apply(this, arguments);
      return this.__hideWaitingCircle();
    };

    return MDScreen;

  })(masquerade.Screen);

}).call(this);
