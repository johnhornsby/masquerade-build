(function() {
  var app, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  masquerade = Namespace('SEQ.masquerade');

  masquerade.Masquerade = (function() {
    Masquerade.prototype.__globals = {};

    Masquerade.prototype.__rootViewController = {};

    function Masquerade() {
      this.__translationLoadComplete = __bind(this.__translationLoadComplete, this);
      this.__onDeviceReady = __bind(this.__onDeviceReady, this);
      this.__init();
    }

    Masquerade.prototype.__init = function() {
      document.addEventListener("deviceready", this.__onDeviceReady, false);
      return $(function() {
        window.log("ready");
        return $('body').on("load", function() {
          return window.log("loaded");
        });
      });
    };

    Masquerade.prototype.__onDeviceReady = function() {
      window.log("Device Ready");
      this.__globals = masquerade.Globals;
      this.__globals.isDebugging = false;
      this.__globals.statusBarOffset = 0;
      this.__globals.osVersion = 0;
      this.__globals.platform = "0";
      if (window.device !== void 0) {
        this.__globals.osVersion = parseFloat(window.device.version);
        this.__globals.platform = window.device.platform.toLowerCase();
        this.__globals.statusBarOffset = 20;
        this.__globals.debug("Platform:" + this.__globals.platform + " Version:" + this.__globals.osVersion);
        if (this.__globals.platform === "ios") {
          $("title").before('<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />');
        }
      }
      this.__globals.showPlaceholderData = false;
      this.__globals.useTweenMax = true;
      this.__globals.tweenMaxInTime = 0.15;
      this.__globals.tweenMaxOutTime = 0.15;
      this.__globals.latencyDelay = 0;
      this.__globals.isMultiDevice = false;
      this.__globals.localStorageManager = new masquerade.LocalStorageManager();
      this.__globals.translationManager = new masquerade.TranslationManager();
      this.__globals.translationManager.addEventListener(masquerade.TranslationManager.DATA_LOAD_COMPLETE, this.__translationLoadComplete);
      this.__globals.guid = this.__globals.localStorageManager.getGUID();
      this.__globals.gameManager = new masquerade.GameManager();
      this.__globals.mdGameManager = new masquerade.MDGameManager();
      this.__globals.colourManager = new masquerade.ColourManager();
      this.__rootViewController = new masquerade.RootViewController();
      this.__globals.rootViewController = this.__rootViewController;
      return this.__globals.translationManager.load();
    };

    Masquerade.prototype.__translationLoadComplete = function() {
      return this.__rootViewController.beginGame();
    };

    return Masquerade;

  })();

  app = new masquerade.Masquerade();

  SEQ.app = app;

}).call(this);
