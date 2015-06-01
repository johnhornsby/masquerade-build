(function() {
  var display, events, masquerade,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.Screen = (function(_super) {
    __extends(Screen, _super);

    Screen.prototype.__helpNode = {};

    function Screen(domNode) {
      this.__helpNode = void 0;
      Screen.__super__.constructor.apply(this, arguments);
    }

    Screen.prototype.__init = function() {
      return Screen.__super__.__init.apply(this, arguments);
    };

    Screen.prototype.__build = function() {
      var helpContent, navigationTitle, parent;
      Screen.__super__.__build.apply(this, arguments);
      if (this.__g.navigationBar) {
        navigationTitle = this.__domNode.getAttribute("data-navigation-title");
        if (navigationTitle === void 0) {
          this.__g.navigationBar.setNavigationTitle();
        } else {
          this.__g.navigationBar.setNavigationTitle(navigationTitle);
        }
      }
      helpContent = this.__domNode.getElementsByClassName("help-content");
      if (helpContent.length > 0) {
        this.__helpNode = helpContent[0];
        parent = this.__helpNode.parentNode;
        parent.removeChild(this.__helpNode);
      }
      if (this.__g.navigationBar !== void 0) {
        this.__g.navigationBar.setHelpContentNode(this.__helpNode);
      }
      return this.__setInitStyle();
    };

    Screen.prototype.__fadeColorTo = function(color) {
      return this.__g.colourManager.fadeColorTo(color);
    };

    Screen.prototype.__setInitStyle = function() {
      if (this.__g.useTweenMax) {
        return $(this.__domNode).css("opacity", "0");
      } else {
        return $(this.__domNode).addClass("fade-init");
      }
    };

    Screen.prototype.__cueIntroAnimation = function() {
      if (this.__g.useTweenMax) {
        return TweenMax.to(this.__domNode, this.__g.tweenMaxInTime, {
          opacity: 1,
          onStart: this.__animationStart,
          onComplete: this.__animationEnd
        });
      } else {
        $(this.__domNode).removeClass("fade-init");
        return $(this.__domNode).addClass("fade-complete");
      }
    };

    Screen.prototype.__cueOutroAnimation = function() {
      if (this.__g.useTweenMax) {
        return TweenMax.to(this.__domNode, this.__g.tweenMaxOutTime, {
          opacity: 0,
          onStart: this.__animationStart,
          onComplete: this.__animationEnd
        });
      } else {
        $(this.__domNode).removeClass("fade-complete");
        return $(this.__domNode).addClass("fade-outro");
      }
    };

    Screen.prototype.getHelpNode = function() {
      return this.__helpNode;
    };

    Screen.prototype.introStart = function() {
      var body;
      Screen.__super__.introStart.apply(this, arguments);
      body = document.getElementsByTagName("body")[0];
      return body.scrollTop = 0;
    };

    Screen.prototype.screenEnd = function() {
      Screen.__super__.screenEnd.apply(this, arguments);
      return this.__g.colourManager.stopFadeOnElement(this.__domNode);
    };

    return Screen;

  })(masquerade.InteractiveElement);

}).call(this);
