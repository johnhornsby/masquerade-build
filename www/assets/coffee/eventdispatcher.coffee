
"use strict"
display = Namespace('SEQ.display')
masquerade = Namespace('SEQ.masquerade')

class display.EventDispatcher
  
  __eventHashTable:{}

  constructor: () ->
    @__eventHashTable = {}

  __isFunction: (functionToCheck) ->
    getType = {}
    functionToCheck and getType.toString.call(functionToCheck) is "[object Function]"

  addEventListener: (eventType, func) =>
    @__eventHashTable[eventType] = []  if @__eventHashTable[eventType] is `undefined`
    @__eventHashTable[eventType].push func  if @__eventHashTable[eventType].indexOf(func) is -1

  removeEventListener: (eventType, func) =>
    return false  if @__eventHashTable[eventType] is `undefined`
    @__eventHashTable[eventType].splice @__eventHashTable[eventType].indexOf(func), 1  if @__eventHashTable[eventType].indexOf(func) > -1
    true

  dispatchEvent: (eventObject) =>
    a = @__eventHashTable[eventObject.eventType]
    return false  if a is `undefined` or a.constructor isnt Array
    i = 0

    targetObject = null
    while i < a.length
      targetObject = a[i]
      
      if @__isFunction(targetObject) is false
        window.log "EventDispatcher Error this is not a function:"+a[i]
      # try
      if targetObject isnt undefined
        targetObject(eventObject)
      # catch error
      #   message = "#{error.name} #{error.message} #{error.stack} i:#{i} a:#{a} targetObject:#{targetObject} eventObject.eventType:#{eventObject.eventType}"
      #   console.warn message
      #   masquerade.Globals.debug(message)
      i++

window.EventDispatcher = display.EventDispatcher