(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.TranslationManager = (function(_super) {
    __extends(TranslationManager, _super);

    TranslationManager.prototype.__path = "";

    TranslationManager.prototype.__languageIndex = 0;

    TranslationManager.prototype.__g = {};

    TranslationManager.prototype.__json = [];

    function TranslationManager() {
      this.__onLoadDataComplete = __bind(this.__onLoadDataComplete, this);
      TranslationManager.__super__.constructor.apply(this, arguments);
      this.__init();
    }

    TranslationManager.prototype.__init = function() {
      this.__g = masquerade.Globals;
      return this.__languageIndex = this.__g.localStorageManager.getLanguage();
    };

    TranslationManager.prototype.__onLoadDataComplete = function(json) {
      this.__json = json;
      return this.dispatchEvent(new events.Event(masquerade.TranslationManager.DATA_LOAD_COMPLETE));
    };

    TranslationManager.prototype.__getLanguageKeyWithIndex = function(index) {
      switch (index) {
        case 0:
          return "en";
        case 1:
          return "fr";
        case 2:
          return "de";
        case 3:
          return "es";
        case 4:
          return "it";
      }
    };

    TranslationManager.prototype.load = function() {
      return $.getJSON('data/translation.json', this.__onLoadDataComplete);
    };

    TranslationManager.prototype.updateLanguage = function() {
      return this.__languageIndex = this.__g.localStorageManager.getLanguage();
    };

    TranslationManager.prototype.getTextForKey = function(key) {
      var tranlationObject;
      tranlationObject = this.__json[key];
      if (tranlationObject === void 0) {
        window.log("NO TRANSLATION KEY " + key);
        return "";
      }
      if (tranlationObject[this.__getLanguageKeyWithIndex(this.__languageIndex)] === void 0) {
        window.log("NO " + (this.__getLanguageKeyWithIndex(this.__languageIndex)) + " TRANSLATION FOR KEY " + key);
        return "";
      } else {
        return tranlationObject[this.__getLanguageKeyWithIndex(this.__languageIndex)];
      }
    };

    TranslationManager.prototype.translateDomNode = function(domNode) {
      var $translationNodes, self;
      $translationNodes = $(domNode).find("translation");
      self = this;
      return $translationNodes.each(function() {
        var key, translation;
        key = $(this).attr("data-key");
        translation = self.getTextForKey(key);
        return $(this).html(translation);
      });
    };

    TranslationManager.prototype.replaceTag = function(domNode, tag, str) {
      return $(domNode).html(function(index, html) {
        return html.replace(tag, str);
      });
    };

    return TranslationManager;

  })(display.EventDispatcher);

  masquerade.TranslationManager.DATA_LOAD_COMPLETE = "dataLoadComplete";

}).call(this);
