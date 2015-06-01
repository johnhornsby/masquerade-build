(function() {
  var masquerade;

  masquerade = Namespace('SEQ.masquerade');

  masquerade.ColourManager = (function() {
    ColourManager.prototype.__g = masquerade.Globals;

    ColourManager.prototype.__currentColour = "#60bca5";

    function ColourManager() {
      this.__init();
    }

    ColourManager.prototype.__init = function() {};

    ColourManager.prototype.fadeColorTo = function(colour) {
      var el, elements, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      console.log("fadeColorTo fade to " + colour);
      this.__currentColour = colour;
      elements = document.getElementsByClassName('color-background-floodable');
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.stopFadeOnElement(el);
        TweenMax.to(el, 0.8, {
          backgroundColor: colour
        });
      }
      elements = document.getElementsByClassName('color-color-floodable');
      for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
        el = elements[_j];
        el.style.color = colour;
      }
      elements = document.getElementsByClassName('selected-color-color-floodable');
      for (_k = 0, _len2 = elements.length; _k < _len2; _k++) {
        el = elements[_k];
        el.style.color = colour;
      }
      elements = document.getElementsByClassName('selected-color-background-floodable');
      for (_l = 0, _len3 = elements.length; _l < _len3; _l++) {
        el = elements[_l];
        el.style.backgroundColor = colour;
      }
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        $(".color-color-floodable-android2").css("color", colour);
        return $(".color-background-floodable-android2").css("background-color", colour);
      }
    };

    ColourManager.prototype.stopFadeOnElement = function(element) {
      if (TweenMax.isTweening(element)) {
        return TweenMax.killTweensOf(element, {
          backgroundColor: true
        });
      }
    };

    ColourManager.prototype.getCurrentColour = function() {
      return this.__currentColour;
    };

    ColourManager.prototype.getInvertBaseColour = function() {
      return "white";
    };

    ColourManager.prototype.setCurrentColour = function(str) {
      return this.__currentColour = str;
    };

    return ColourManager;

  })();

  masquerade.ColourManager.GREEN = "#60bca5";

  masquerade.ColourManager.RED = "#eb5055";

  masquerade.ColourManager.YELLOW = "#ffac35";

  masquerade.ColourManager.BLUE = "#449bb5";

  masquerade.ColourManager.PURPLE = "#543c52";

  masquerade.ColourManager.NAVY = "#3e5667";

  masquerade.ColourManager.LIME = "#b3d059";

  masquerade.ColourManager.BEIGE = "#d5c6aa";

}).call(this);
