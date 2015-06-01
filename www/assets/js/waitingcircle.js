(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.WaitingCircle = (function(_super) {
    __extends(WaitingCircle, _super);

    WaitingCircle.prototype.__g = masquerade.Globals;

    WaitingCircle.prototype.__canvasID = "";

    WaitingCircle.prototype.__canvas = {};

    WaitingCircle.prototype.__stage = {};

    WaitingCircle.prototype.__strokeWidth = 4;

    WaitingCircle.prototype.__circleBottom = {};

    WaitingCircle.prototype.__circleTop = {};

    WaitingCircle.prototype.__radius = 0;

    WaitingCircle.prototype.__increment = 0;

    WaitingCircle.prototype.__isFlip = false;

    WaitingCircle.prototype.__startAngle = 0;

    WaitingCircle.prototype.__endAngle = 0;

    WaitingCircle.prototype.__scale = 0;

    WaitingCircle.prototype.__width = 0;

    WaitingCircle.prototype.__step = 0.001;

    WaitingCircle.prototype.__scaleFactor = 0;

    function WaitingCircle(__canvasID) {
      this.__canvasID = __canvasID;
      this.__complete = __bind(this.__complete, this);
      this.__in = __bind(this.__in, this);
      this.__tick = __bind(this.__tick, this);
      this.__init();
    }

    WaitingCircle.prototype.__init = function() {
      var canvasWidth, element, maxWidth, paddingLeftInt, width;
      element = $("#wrapper > .screen").get(0);
      paddingLeftInt = parseInt($(element).css("padding-left").replace(/[^-\d\.]/g, ''));
      width = $(element).width() - (paddingLeftInt * 2);
      if ($(document).width() < 500) {
        maxWidth = 220;
        this.__strokeWidth = 3;
      } else {
        maxWidth = 400;
        this.__strokeWidth = 4;
      }
      width = Math.min(width, maxWidth);
      this.__scaleFactor = 1;
      if (this.__g.platform === "ios") {
        this.__scaleFactor = 2;
      }
      canvasWidth = width * this.__scaleFactor;
      $("#" + this.__canvasID).attr("width", "" + canvasWidth + "px").attr("height", "" + canvasWidth + "px");
      $("#" + this.__canvasID).css({
        'width': "" + width,
        'height': "" + width
      });
      this.__stage = new createjs.Stage(this.__canvasID);
      createjs.Ticker.setFPS(50);
      this.__width = canvasWidth;
      this.__radius = this.__width / 2;
      this.__container = new createjs.Container();
      this.__circleBottom = new createjs.Shape();
      this.__circleBottom.graphics.setStrokeStyle(this.__strokeWidth * this.__scaleFactor, "butt").beginStroke("rgba(0, 0, 0, 0.1)");
      this.__circleBottom.graphics.arc(0, 0, this.__radius - ((this.__strokeWidth * this.__scaleFactor) / 2), 0, Math.PI * 2);
      this.__container.addChild(this.__circleBottom);
      this.__circleTop = new createjs.Shape();
      this.__circleTop.graphics.setStrokeStyle(this.__strokeWidth * this.__scaleFactor, "butt").beginStroke("#FFFFFF");
      this.__circleTop.graphics.arc(0, 0, this.__radius - ((this.__strokeWidth * this.__scaleFactor) / 2), 0, 0);
      this.__container.addChild(this.__circleTop);
      this.__stage.addChild(this.__container);
      this.__increment -= this.__step;
      this.__container.setTransform(this.__width / 2, this.__width / 2, 1, 1);
      return this.__tick();
    };

    WaitingCircle.prototype.__tick = function() {
      this.__circleTop.graphics.clear();
      this.__increment += this.__step;
      if (this.__increment > 2) {
        this.__isFlip = this.__isFlip === false;
        this.__increment = this.__increment - 2;
      }
      if (this.__isFlip) {
        this.__endAngle = 0;
        if (this.__increment > 2 - this.__step) {
          this.__startAngle = 0;
          this.__endAngle = 0;
        } else {
          this.__startAngle = this.__increment;
        }
      } else {
        this.__startAngle = 0;
        this.__endAngle = this.__increment;
      }
      this.__circleTop.graphics.setStrokeStyle(this.__strokeWidth * this.__scaleFactor, "butt").beginStroke("#FFFFFF");
      this.__circleTop.graphics.arc(0, 0, this.__radius - ((this.__strokeWidth * this.__scaleFactor) / 2), Math.PI * this.__startAngle, Math.PI * this.__endAngle);
      return this.__stage.update();
    };

    WaitingCircle.prototype.__in = function() {};

    WaitingCircle.prototype.__complete = function() {};

    WaitingCircle.prototype.stop = function() {
      return createjs.Ticker.removeEventListener("tick", this.__tick);
    };

    WaitingCircle.prototype.start = function() {
      return createjs.Ticker.addEventListener("tick", this.__tick);
    };

    return WaitingCircle;

  })(display.EventDispatcher);

}).call(this);
