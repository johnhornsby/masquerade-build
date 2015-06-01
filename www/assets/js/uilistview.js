(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.UIListView = (function(_super) {
    __extends(UIListView, _super);

    UIListView.prototype.__g = masquerade.Globals;

    UIListView.prototype.__inputElement = {};

    UIListView.prototype.__tableViewElement = {};

    UIListView.prototype.__scrollPanelViewController = {};

    UIListView.prototype.__domNode = {};

    UIListView.prototype.__tableViewItemInstances = [];

    UIListView.prototype.__fastClickInstances = [];

    UIListView.prototype.__selectedIndex = -1;

    function UIListView(options) {
      this.__onTableViewItemClick = __bind(this.__onTableViewItemClick, this);
      UIListView.__super__.constructor.apply(this, arguments);
      this.__domNode = options.domNode;
      this.__init();
    }

    UIListView.prototype.__init = function() {
      return this.__build();
    };

    UIListView.prototype.__build = function() {
      var index, options, tableViewItem, tableViewItems, _i, _len;
      options = {
        frameElement: this.__domNode,
        contentElement: this.__domNode.getElementsByClassName("ui-table-view-content")[0],
        horizontalThumbFrame: this.__domNode.getElementsByClassName("thumb-horizontal-frame")[0],
        horizontalThumb: this.__domNode.getElementsByClassName("thumb-horizontal")[0],
        verticleThumbFrame: this.__domNode.getElementsByClassName("thumb-verticle-frame")[0],
        verticleThumb: this.__domNode.getElementsByClassName("thumb-verticle")[0],
        scrollDirection: ScrollPanelController.SCROLL_DIRECTION_VERTICLE
      };
      this.__scrollPanelViewController = new ScrollPanelViewController(options);
      this.__tableViewItemInstances = [];
      tableViewItems = this.__domNode.querySelectorAll(".ui-table-view-item a");
      index = 0;
      for (_i = 0, _len = tableViewItems.length; _i < _len; _i++) {
        tableViewItem = tableViewItems[_i];
        this.__tableViewItemInstances.push(tableViewItem);
        this.__fastClickInstances.push(new FastClick(tableViewItem));
        tableViewItem.addEventListener("click", this.__onTableViewItemClick, false);
        if ($(tableViewItem).hasClass("selected")) {
          this.__selectedIndex = index;
        }
        index++;
      }
      return this.updateColour();
    };

    UIListView.prototype.__onTableViewItemClick = function(mouseEvent) {
      var index, selectedTableViewItem;
      selectedTableViewItem = mouseEvent.currentTarget;
      index = this.__tableViewItemInstances.indexOf(selectedTableViewItem);
      this.__setSelectedIndex(index);
      return this.dispatchEvent(new events.Event(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, {
        text: this.getSelectedText(),
        index: index,
        currentTarget: this
      }));
    };

    UIListView.prototype.__setSelectedIndex = function(index) {
      var selectedTableViewItem, tableViewItem, _i, _len, _ref, _results;
      this.__selectedIndex = index;
      selectedTableViewItem = this.__selectedIndex > -1 && this.__selectedIndex < this.__tableViewItemInstances.length ? this.__tableViewItemInstances[index] : void 0;
      _ref = this.__tableViewItemInstances;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tableViewItem = _ref[_i];
        if (selectedTableViewItem === tableViewItem) {
          $(tableViewItem).addClass("selected");
          tableViewItem.style.backgroundColor = this.__g.colourManager.getCurrentColour();
          _results.push(tableViewItem.style.color = this.__g.colourManager.getInvertBaseColour());
        } else {
          $(tableViewItem).removeClass("selected");
          tableViewItem.style.backgroundColor = this.__g.colourManager.getInvertBaseColour();
          _results.push(tableViewItem.style.color = this.__g.colourManager.getCurrentColour());
        }
      }
      return _results;
    };

    UIListView.prototype.updateColour = function() {
      var tableViewItem, _i, _len, _ref, _results;
      _ref = this.__tableViewItemInstances;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tableViewItem = _ref[_i];
        if ($(tableViewItem).hasClass("selected")) {
          tableViewItem.style.backgroundColor = this.__g.colourManager.getCurrentColour();
          _results.push(tableViewItem.style.color = this.__g.colourManager.getInvertBaseColour());
        } else {
          tableViewItem.style.backgroundColor = this.__g.colourManager.getInvertBaseColour();
          _results.push(tableViewItem.style.color = this.__g.colourManager.getCurrentColour());
        }
      }
      return _results;
    };

    UIListView.prototype.setStyle = function(object) {
      var s, _results;
      _results = [];
      for (s in object) {
        _results.push(this.__domNode.style[s] = object[s]);
      }
      return _results;
    };

    UIListView.prototype.getSelectedIndex = function() {
      return this.__selectedIndex;
    };

    UIListView.prototype.setSelectedIndex = function(index) {
      if (index == null) {
        index = -1;
      }
      return this.__setSelectedIndex(index);
    };

    UIListView.prototype.getLength = function() {
      return this.__tableViewItemInstances.length;
    };

    UIListView.prototype.getSelectedText = function() {
      if (this.__selectedIndex > -1) {
        return $(this.__tableViewItemInstances[this.__selectedIndex]).text();
      } else {
        return "";
      }
    };

    UIListView.prototype.getDomNode = function() {
      return this.__domNode;
    };

    UIListView.prototype.updateFrameDimensions = function() {
      return this.__scrollPanelViewController.updateFrameDimensions();
    };

    return UIListView;

  })(display.EventDispatcher);

  masquerade.UIListView.LIST_VIEW_ITEM_CLICK = "listViewItemClick";

}).call(this);
