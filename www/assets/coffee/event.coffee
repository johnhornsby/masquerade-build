events = Namespace('SEQ.events')

class events.Event 

	eventType:""
	data:{}

	constructor:(@eventType,@data=undefined)->
