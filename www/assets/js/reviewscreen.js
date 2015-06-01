(function() {
  var events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  events = Namespace('SEQ.events');

  masquerade.ReviewScreen = (function(_super) {
    __extends(ReviewScreen, _super);

    function ReviewScreen(domNode) {
      this.__onScrollToBottomUpdate = __bind(this.__onScrollToBottomUpdate, this);
      this.__onScrollToBottomComplete = __bind(this.__onScrollToBottomComplete, this);
      ReviewScreen.__super__.constructor.call(this, domNode);
    }

    ReviewScreen.prototype.__init = function() {
      return ReviewScreen.__super__.__init.apply(this, arguments);
    };

    ReviewScreen.prototype.__build = function() {
      var bubbleNode, conversationContainer, i, l, qaNode, rect, svgNode, templateQaNode;
      ReviewScreen.__super__.__build.apply(this, arguments);
      templateQaNode = this.__domNode.getElementsByClassName('question-and-answer')[0];
      qaNode = {};
      svgNode = {};
      bubbleNode = {};
      rect = {};
      conversationContainer = this.__domNode.getElementsByClassName('conversation-container')[0];
      conversationContainer.removeChild(templateQaNode);
      l = this.__g.gameManager.getQuestionIndex() + 1;
      i = 0;
      while (i < l) {
        qaNode = templateQaNode.cloneNode(true);
        qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " " + (i + 1);
        qaNode.getElementsByClassName('text-question-content')[0].innerHTML = this.__g.gameManager.getQuestionAtIndex(i);
        qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = this.__g.gameManager.getAnswerAAtIndex(i);
        qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = this.__g.gameManager.getAnswerBAtIndex(i);
        conversationContainer.appendChild(qaNode);
        i++;
      }
      return this.__g.navigationBar.setNavigationTitle("Review Dialog");
    };

    ReviewScreen.prototype.__drawSVG = function() {
      var bubbleNode, canvas, pathNode, point, polygonNode, rect, svg, svgString, svgs, _i, _len, _results;
      svgs = this.__domNode.getElementsByTagName('svg');
      bubbleNode = {};
      point = {};
      polygonNode = {};
      pathNode = {};
      canvas = {};
      svgString = "";
      _results = [];
      for (_i = 0, _len = svgs.length; _i < _len; _i++) {
        svg = svgs[_i];
        bubbleNode = svg.parentNode;
        rect = {
          x: 2,
          y: 2,
          width: bubbleNode.clientWidth - 4,
          height: bubbleNode.clientHeight - 30
        };
        svg.attributes.width.value = "" + bubbleNode.clientWidth + "px";
        svg.attributes.height.value = "" + bubbleNode.clientHeight + "px";
        svg.attributes.viewBox.value = "0 0 " + bubbleNode.clientWidth + " " + bubbleNode.clientHeight;
        polygonNode = svg.getElementsByTagName('polygon')[0];
        pathNode = svg.getElementsByTagName('path')[0];
        polygonNode.attributes.points.value = this.__getBubblePoints(rect);
        if ($(bubbleNode).hasClass("bubble-left")) {
          polygonNode.attributes.transform.value = "translate(" + bubbleNode.clientWidth + ",0) scale(-1,1)";
          pathNode.attributes.transform.value = "translate(5," + (bubbleNode.clientHeight - 30) + ") scale(0.23)";
        } else {
          pathNode.attributes.transform.value = "translate(" + (bubbleNode.clientWidth - 35) + "," + (bubbleNode.clientHeight - 30) + ") scale(0.23)";
        }
        if (this.__g.platform === "android" && this.__g.osVersion < 4) {
          canvas = document.createElement("canvas");
          canvas.setAttribute("style", "height:" + ("" + bubbleNode.clientHeight + "px") + ";width:" + ("" + bubbleNode.clientWidth + "px") + ";position:absolute;top:0px;left:0px;");
          canvas.setAttribute("height", "" + bubbleNode.clientHeight + "px");
          canvas.setAttribute("width", "" + bubbleNode.clientWidth + "px");
          $(svg).after(canvas);
          svgString = $(svg.parentNode).html();
          svgString = svgString.substring(0, svgString.indexOf("<canvas"));
          svgString = svgString.substring(svgString.indexOf("<svg"));
          svg.style.display = "none";
          _results.push(canvg(canvas, svgString));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ReviewScreen.prototype.__getBubblePoints = function(r) {
      var str;
      str = "" + r.x + "," + r.y + " ";
      str += "" + (r.x + r.width) + "," + r.y + " ";
      str += "" + (r.x + r.width) + "," + (r.y + r.height - 12) + " ";
      str += "" + (r.x + r.width - 40) + "," + (r.y + r.height - 12) + " ";
      str += "" + (r.x + r.width - 40) + "," + (r.y + r.height) + " ";
      str += "" + (r.x + r.width - 80) + "," + (r.y + r.height - 12) + " ";
      str += "" + r.x + "," + (r.y + r.height - 12) + " ";
      return str += "" + r.x + "," + r.y + "";
    };

    ReviewScreen.prototype.__onScrollToBottomComplete = function() {};

    ReviewScreen.prototype.__onScrollToBottomUpdate = function() {};

    ReviewScreen.prototype.__introComplete = function() {
      var body, scrollTop;
      ReviewScreen.__super__.__introComplete.apply(this, arguments);
      body = document.getElementsByTagName("body")[0];
      if (window.innerHeight < this.__domNode.scrollHeight) {
        scrollTop = (this.__domNode.scrollHeight + this.__g.statusBarOffset) - window.innerHeight;
        return setTimeout((function(_this) {
          return function() {
            return Animator.addTween(body, {
              scrollTop: scrollTop,
              time: 1,
              onComplete: _this.__onScrollToBottomComplete,
              onUpdate: _this.__onScrollToBottomUpdate,
              transition: "easeOutExpo"
            });
          };
        })(this), 100);
      }
    };

    ReviewScreen.prototype.introStart = function() {
      ReviewScreen.__super__.introStart.apply(this, arguments);
      this.__drawSVG();
      this.__g.navigationBar.drawNavigationButtons(["back"]);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueIntroAnimation();
        };
      })(this), 100);
    };

    ReviewScreen.prototype.outroStart = function() {
      ReviewScreen.__super__.outroStart.apply(this, arguments);
      return setTimeout((function(_this) {
        return function() {
          return _this.__cueOutroAnimation();
        };
      })(this), 0);
    };

    ReviewScreen.prototype.screenEnd = function() {
      return ReviewScreen.__super__.screenEnd.apply(this, arguments);
    };

    return ReviewScreen;

  })(masquerade.Screen);

}).call(this);
