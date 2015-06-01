#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.MDScreen extends masquerade.Screen

  __isValid:true
  __isWaitingForServer:false
  __waitingCircle:undefined
  __activeFrame:undefined
  __previousFrame:undefined

  constructor: (domNode)->
    super





  #PRIVATE
  #_______________________________________________________________________________________
    

  __introComplete:()->
    super

  __build:()->
    super


  __checkWithGameManager:()=> #override


  __killTweenMax:()->
    $(".frame").each ()->
      TweenMax.killTweensOf this

  __showWaitingForServer:()->
    if @__isWaitingForServer is false
      @__isWaitingForServer = true

      $(".frame-1").hide()
      
      $(".frame-2").show()

      @__showWaitingCircle()

  __hideWaitingForServer:()->
    if @__isWaitingForServer is true
      @__isWaitingForServer = false
      @__hideWaitingForServer()
      $(".frame-1").show()
      $(".frame-2").hide()
      @__hideWaitingCircle()
    # if @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE
    @__addInteractivity()

  __initialiseFrame:()->
    $(".frame-2").hide()
    @__isWaitingForServer = false

  __showWaitingCircle:()->
    if @__waitingCircle is undefined
      @__waitingCircle = new masquerade.WaitingCircle("waiting-for-server")
      @__waitingCircle.start()

  __hideWaitingCircle:()->
    if @__waitingCircle isnt undefined
      @__waitingCircle.stop()
    @__waitingCircle = undefined
  
  __handleButtonEvent:(mouseEvent)->
    super
    #override
    button = mouseEvent.currentTarget
    if $(button).hasClass("button-call-server")
      $(button).addClass("button-active")

  __sendToServer:()=>


  __sendToServerSuccess:()=>
    @__removeAllServerActiveAnimation()

  __removeAllServerActiveAnimation:()->
    $(@__domNode).find(".button-call-server.button-active").removeClass("button-active")

  __onServerError:(e)=>
    


  #PUBLIC
  #_______________________________________________________________________________________
  setIsValid:(bool)->
    @__isValid = bool
  isValid:()->
    return @__isValid

  listenToMDGM:()->
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__onServerError)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__checkWithGameManager)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)
    #@__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER, @__sendToServer)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, @__sendToServerSuccess)


  ignoreMDGM:()->
    @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__onServerError)
    @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__checkWithGameManager)
    @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)
    #@__g.mdGameManager.removeEventListener(masquerade.MDGameManager.SEND_TO_SERVER, @__sendToServer)
    @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, @__sendToServerSuccess)

  introStart:()->
    super
    # @__isWaitingForServer = true
    # @__hideWaitingForServer()
    @__initialiseFrame()
    @__checkWithGameManager()

  screenStart:()->
    super
    @__checkWithGameManager()
    @listenToMDGM()

  outroStart:()->
    super
    @ignoreMDGM()
    @__killTweenMax()

  screenEnd:()->
    super
    @__hideWaitingCircle()

  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________
