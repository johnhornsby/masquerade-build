(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.UIDropdownView = (function(_super) {
    __extends(UIDropdownView, _super);

    UIDropdownView.prototype.__inputElement = {};

    UIDropdownView.prototype.__listView = {};

    UIDropdownView.prototype.__domNode = {};

    UIDropdownView.prototype.__fastClickInstances = [];

    UIDropdownView.prototype.__selectedIndex = -1;

    UIDropdownView.prototype.__isOpen = false;

    function UIDropdownView(options) {
      this.__onInputClick = __bind(this.__onInputClick, this);
      this.__onListViewItemClick = __bind(this.__onListViewItemClick, this);
      UIDropdownView.__super__.constructor.apply(this, arguments);
      this.__domNode = options.domNode;
      this.__init();
    }

    UIDropdownView.prototype.__init = function() {
      return this.__build();
    };

    UIDropdownView.prototype.__build = function() {
      var options;
      this.__inputElement = this.__domNode.getElementsByClassName("ui-dropdown-input")[0];
      this.__inputElement.addEventListener("click", this.__onInputClick);
      options = {
        domNode: this.__domNode.getElementsByClassName("ui-dropdown-select")[0]
      };
      options.domNode.style.width = this.__inputElement.clientWidth + "px";
      this.__listView = new masquerade.UIListView(options);
      this.__listView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, this.__onListViewItemClick);
      return this.__close();
    };

    UIDropdownView.prototype.__onListViewItemClick = function(event) {
      this.__close();
      return this.dispatchEvent(new events.Event(masquerade.UIDropdownView.CHANGE, {
        text: this.getSelectedText(),
        index: this.getSelectedIndex(),
        currentTarget: this
      }));
    };

    UIDropdownView.prototype.__onInputClick = function(event) {
      return this.__open();
    };

    UIDropdownView.prototype.__close = function() {
      this.__isOpen = false;
      this.__inputElement.getElementsByTagName('input')[0].value = this.__listView.getSelectedText();
      this.__listView.setStyle({
        "display": "none"
      });
      return this.__listView.setStyle({
        "z-index": "auto"
      });
    };

    UIDropdownView.prototype.__open = function() {
      this.__isOpen = true;
      this.__listView.setStyle({
        "display": "block"
      });
      this.__listView.setStyle({
        "z-index": "999"
      });
      this.__listView.updateFrameDimensions();
      return this.dispatchEvent(new events.Event(masquerade.UIDropdownView.OPEN, {
        currentTarget: this
      }));
    };

    UIDropdownView.prototype.close = function() {
      return this.__close();
    };

    UIDropdownView.prototype.isOpen = function() {
      return this.__isOpen;
    };

    UIDropdownView.prototype.getSelectedIndex = function() {
      return this.__listView.getSelectedIndex();
    };

    UIDropdownView.prototype.setSelectedIndex = function(index) {
      this.__listView.setSelectedIndex(index);
      return this.__inputElement.getElementsByTagName('input')[0].value = this.getSelectedText();
    };

    UIDropdownView.prototype.getLength = function() {
      return this.__listView.getLength();
    };

    UIDropdownView.prototype.getSelectedText = function() {
      return this.__listView.getSelectedText();
    };

    UIDropdownView.prototype.getDomNode = function() {
      return this.__domNode;
    };

    return UIDropdownView;

  })(display.EventDispatcher);

  masquerade.UIDropdownView.CHANGE = "change";

  masquerade.UIDropdownView.OPEN = "open";

  masquerade.UIDropdownView.CLOSE = "close";

}).call(this);
