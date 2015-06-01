(function() {
  var masquerade;

  masquerade = Namespace('SEQ.masquerade');

  masquerade.Globals = (function() {
    Globals.prototype.rootViewController = {};

    Globals.prototype.localStorageManager = {};

    Globals.prototype.navigationBar = {};

    Globals.prototype.gameManager = {};

    Globals.prototype.mdGameManager = {};

    Globals.prototype.colourManager = {};

    Globals.prototype.translationManager = {};

    Globals.prototype.screenWidth = 0;

    Globals.prototype.screenHeight = 0;

    Globals.prototype.showPlaceholderData = true;

    Globals.prototype.osVersion = 7.1;

    Globals.prototype.platform = "ios";

    Globals.prototype.debugElement = {};

    Globals.prototype.guid = 0;

    Globals.prototype.useTweenMax = false;

    Globals.prototype.tweenMaxInTime = 1;

    Globals.prototype.tweenMaxOutTime = 0.5;

    Globals.prototype.latencyDelay = 0;

    Globals.prototype.isSingleRound = false;

    Globals.prototype.isMultiDevice = false;

    Globals.prototype.isDebugging = true;

    function Globals() {
      this.init();
    }

    Globals.prototype.init = function() {};

    return Globals;

  })();

  masquerade.Globals.debug = function(str) {
    if (masquerade.Globals.isDebugging === true) {
      console.log(str);
      if (masquerade.Globals.localStorageManager) {
        return masquerade.Globals.localStorageManager.log(str);
      }
    }
  };

  masquerade.Globals.resetDebugger = function() {
    return masquerade.Globals.debugElement.innerHTML = "";
  };

}).call(this);
