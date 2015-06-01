(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.NavigationBar = (function(_super) {
    __extends(NavigationBar, _super);

    NavigationBar.prototype.__helpButton = {};

    NavigationBar.prototype.__pauseButton = {};

    NavigationBar.prototype.__backButton = {};

    NavigationBar.prototype.__isHelpActive = false;

    NavigationBar.prototype.__helpContentContainer = {};

    NavigationBar.prototype.__isHelpAvailable = false;

    NavigationBar.prototype.__helpButtonOffSVG = "";

    NavigationBar.prototype.__helpButtonOnSVG = "";

    NavigationBar.prototype.__helpCanvas = {};

    NavigationBar.prototype.__serverBusy = false;

    function NavigationBar(domNode) {
      this.__sendToServerComplete = __bind(this.__sendToServerComplete, this);
      this.__sendToServer = __bind(this.__sendToServer, this);
      NavigationBar.__super__.constructor.call(this, domNode);
      this.__domNode = domNode;
    }

    NavigationBar.prototype.__init = function() {
      NavigationBar.__super__.__init.apply(this, arguments);
      return this.__isHelpActive = false;
    };

    NavigationBar.prototype.__build = function() {
      NavigationBar.__super__.__build.apply(this, arguments);
      if (this.__g.platform === "ios" && this.__g.osVersion >= 7) {
        $(this.__domNode).addClass("status-bar-offset");
      }
      $(this.__domNode).css("width", window.innerWidth + "px");
      this.__domNode.getElementsByClassName("help")[0].style.height = window.innerHeight + "px";
      this.__helpButton = this.__domNode.getElementsByClassName("button-help")[0];
      this.__pauseButton = this.__domNode.getElementsByClassName("button-pause")[0];
      this.__backButton = this.__domNode.getElementsByClassName("button-back")[0];
      this.__helpContentContainer = this.__domNode.getElementsByClassName("lightbox-content-container")[0];
      this.__isHelpAvailable = false;
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        this.__convertSVGToCanvas();
      } else {
        $(this.__helpButton).find("path").css("visibility", "visible");
        $(this.__helpButton).find("polygon").css("visibility", "hidden");
      }
      this.__addInteractivity();
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER, this.__sendToServer);
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, this.__sendToServerComplete);
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__sendToServerComplete);
      return this.drawNavigationButtons([], false);
    };

    NavigationBar.prototype.__convertSVGToCanvas = function() {
      this.__convertButtonSVGToCanvas(this.__backButton, 15, 15, 0.7);
      this.__convertButtonSVGToCanvas(this.__pauseButton, 15, 15, 0.7);
      return this.__convertHelpButtonSVGToCanvas(0, 15, 0.7);
    };

    NavigationBar.prototype.__drawHelpCanvasFromSVG = function(svgString) {};

    NavigationBar.prototype.__convertHelpButtonSVGToCanvas = function(offsetX, offsetY, scaleXY) {
      var $group, $svg, helpSVGString;
      $svg = $(this.__helpButton).find("svg");
      $(this.__helpButton).css("-webkit-transform", "scale(1)");
      $group = $(this.__helpButton).find("svg > g");
      $group.attr("transform", "translate(" + offsetX + "px," + offsetY + "px) scale(" + scaleXY + ")");
      this.__helpCanvas = {};
      this.__helpCanvas = document.createElement("canvas");
      this.__helpCanvas.setAttribute("style", "height:" + "60px" + ";width:" + "60px;");
      this.__helpCanvas.setAttribute("height", "60px");
      this.__helpCanvas.setAttribute("width", "60px");
      $(this.__helpButton).append(this.__helpCanvas);
      $svg = $(this.__helpButton).find("svg");
      helpSVGString = this.__helpButton.innerHTML;
      helpSVGString = helpSVGString.substring(0, helpSVGString.indexOf("<canvas"));
      helpSVGString = helpSVGString.substring(helpSVGString.indexOf("<svg"));
      helpSVGString = helpSVGString.replace(/\n/g, "");
      helpSVGString = helpSVGString.replace(/[\t ]+\</g, "<");
      helpSVGString = helpSVGString.replace(/\>[\t ]+\</g, "><");
      helpSVGString = helpSVGString.replace(/\>[\t ]+$/g, ">");
      this.__helpButtonOnSVG = helpSVGString.replace(/\<path(.*)path\>/, "");
      this.__helpButtonOffSVG = helpSVGString.replace(/\<polygon(.*)polygon\>/, "");
      canvg(this.__helpCanvas, this.__helpButtonOffSVG);
      return $svg.css({
        display: "none"
      });
    };

    NavigationBar.prototype.__convertButtonSVGToCanvas = function(buttonElement, offsetX, offsetY, scaleXY) {
      var $group, $svg, canvas, svgString;
      $svg = $(buttonElement).find("svg");
      $(buttonElement).css("-webkit-transform", "scale(1)");
      $group = $(buttonElement).find("svg > g");
      $group.attr("transform", "translate(" + offsetX + "px," + offsetY + "px) scale(" + scaleXY + ")");
      canvas = {};
      canvas = document.createElement("canvas");
      canvas.setAttribute("style", "height:" + "60px" + ";width:" + "60px;");
      canvas.setAttribute("height", "60px");
      canvas.setAttribute("width", "60px");
      $(buttonElement).append(canvas);
      $svg = $(buttonElement).find("svg");
      svgString = buttonElement.innerHTML;
      svgString = svgString.substring(0, svgString.indexOf("<canvas"));
      svgString = svgString.substring(svgString.indexOf("<svg"));
      $svg.css({
        display: "none"
      });
      return canvg(canvas, svgString);
    };

    NavigationBar.prototype.__handleButtonEvent = function(mouseEvent) {
      var button;
      NavigationBar.__super__.__handleButtonEvent.apply(this, arguments);
      if (this.__serverBusy === true) {
        return true;
      }
      button = mouseEvent.currentTarget;
      if ($(button).hasClass("button-help")) {
        this.dispatchEvent(new events.Event(masquerade.NavigationBar.HELP_CLICK));
        if (this.__isHelpAvailable) {
          if (this.__isHelpActive) {
            this.__isHelpActive = false;
            this.__helpContentContainer.parentNode.style.display = "none";
            if (this.__g.platform === "android" && this.__g.osVersion < 4) {
              canvg(this.__helpCanvas, this.__helpButtonOffSVG);
            } else {
              $(this.__helpButton).find("path").css("visibility", "visible");
              $(this.__helpButton).find("polygon").css("visibility", "hidden");
            }
          } else {
            this.__isHelpActive = true;
            this.__helpContentContainer.parentNode.style.display = "block";
            if (this.__g.platform === "android" && this.__g.osVersion < 4) {
              canvg(this.__helpCanvas, this.__helpButtonOnSVG);
            } else {
              $(this.__helpButton).find("path").css("visibility", "hidden");
              $(this.__helpButton).find("polygon").css("visibility", "visible");
            }
          }
        }
      }
      if ($(button).hasClass("button-pause")) {
        this.dispatchEvent(new events.Event(masquerade.NavigationBar.PAUSE_CLICK));
      }
      if ($(button).hasClass("button-back")) {
        return this.dispatchEvent(new events.Event(masquerade.NavigationBar.BACK_CLICK));
      }
    };

    NavigationBar.prototype.__sendToServer = function(e) {
      var button, buttons, _i, _len, _results;
      if (e.data.callString !== "getState") {
        this.__serverBusy = true;
        buttons = this.__domNode.getElementsByClassName("button");
        _results = [];
        for (_i = 0, _len = buttons.length; _i < _len; _i++) {
          button = buttons[_i];
          TweenMax.killTweensOf(button, {
            opacity: true
          });
          _results.push(TweenMax.to(button, 1, {
            opacity: 0.1
          }));
        }
        return _results;
      }
    };

    NavigationBar.prototype.__sendToServerComplete = function() {
      var button, buttons, _i, _len, _results;
      buttons = this.__domNode.getElementsByClassName("button");
      this.__serverBusy = false;
      _results = [];
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        button = buttons[_i];
        TweenMax.killTweensOf(button, {
          opacity: true
        });
        _results.push(TweenMax.to(button, 1, {
          opacity: 1
        }));
      }
      return _results;
    };

    NavigationBar.prototype.drawNavigationButtons = function(buttonNameArray, showNavBar) {
      var button, _i, _len, _ref;
      if (buttonNameArray == null) {
        buttonNameArray = [];
      }
      if (showNavBar == null) {
        showNavBar = true;
      }
      _ref = this.__buttonInstances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        if (buttonNameArray.indexOf(button.name) > -1) {
          if (button.name === "back" && this.__g.rootViewController.getHistoryLength() > 0) {
            button.style.display = "block";
          } else if (button.name !== "back") {
            button.style.display = "block";
          }
        } else {
          button.style.display = "none";
        }
      }
      return this.__domNode.getElementsByClassName("nav-back")[0].style.display = showNavBar ? "block" : "none";
    };

    NavigationBar.prototype.setNavigationTitle = function(text) {
      var headerH2;
      if (text == null) {
        text = "";
      }
      if (this.__isHelpActive) {
        this.__isHelpActive = false;
        this.__helpContentContainer.parentNode.style.display = "none";
      }
      headerH2 = this.__domNode.getElementsByClassName("nav-header-title")[0];
      return headerH2.innerHTML = text;
    };

    NavigationBar.prototype.setHelpContentNode = function(node) {
      if (this.__helpContentContainer.childNodes.length > 0) {
        while (this.__helpContentContainer.firstChild) {
          this.__helpContentContainer.removeChild(this.__helpContentContainer.firstChild);
        }
      }
      if (node === void 0) {
        return this.__isHelpAvailable = false;
      } else {
        this.__isHelpAvailable = true;
        return this.__helpContentContainer.appendChild(node);
      }
    };

    NavigationBar.prototype.goBack = function() {
      return this.dispatchEvent(new events.Event(masquerade.NavigationBar.BACK_CLICK));
    };

    NavigationBar.prototype.showLoading = function() {
      return $(".connect-to-server .loading").show();
    };

    NavigationBar.prototype.hideLoading = function() {
      return $(".connect-to-server .loading").hide();
    };

    return NavigationBar;

  })(masquerade.InteractiveElement);

  masquerade.NavigationBar.BACK_CLICK = "backClick";

  masquerade.NavigationBar.PAUSE_CLICK = "pauseClick";

  masquerade.NavigationBar.HELP_CLICK = "helpClick";

}).call(this);
