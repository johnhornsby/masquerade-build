(function() {
  var events;

  events = Namespace('SEQ.events');

  events.Event = (function() {
    Event.prototype.eventType = "";

    Event.prototype.data = {};

    function Event(eventType, data) {
      this.eventType = eventType;
      this.data = data != null ? data : void 0;
    }

    return Event;

  })();

}).call(this);
