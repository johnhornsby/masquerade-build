masquerade = Namespace('SEQ.masquerade')

class masquerade.Globals

  #Global Accessable Instances
  rootViewController:{}
  localStorageManager:{}
  navigationBar:{}
  gameManager:{}
  mdGameManager:{}
  colourManager:{}
  translationManager:{}


  #Global Parameters
  screenWidth:0
  screenHeight:0
  showPlaceholderData:true
  osVersion:7.1
  platform:"ios"
  debugElement:{}
  guid:0
  useTweenMax:false
  tweenMaxInTime:1
  tweenMaxOutTime:0.5
  latencyDelay:0

  #Temporary Parameters
  isSingleRound:false
  isMultiDevice:false
  isDebugging:true

  constructor: ()->
    @init()

  init:() ->

masquerade.Globals.debug = (str)->
  #masquerade.Globals.debugElement.innerHTML += "<br>" + str + "<br>_______________________________<br><br>"
  if masquerade.Globals.isDebugging is true
    console.log(str)
    if masquerade.Globals.localStorageManager
      masquerade.Globals.localStorageManager.log(str)

masquerade.Globals.resetDebugger = ()->
  masquerade.Globals.debugElement.innerHTML = ""
