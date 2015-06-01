masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDJoinGameScreen extends masquerade.MDScreen

  __pin:""
  __isValid = false


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    # #patch for usign TweenMax
    # if @__g.useTweenMax
    #   $(@__domNode).css("opacity","0")
    # else
    #   $(@__domNode).addClass("fade-init")
    

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      @__isValid = false
      if $("input").val() isnt ""
        pin = $.trim($("input").val()).toUpperCase()
        if pin.length is 5 and isAlphaNumeric(pin)
          @__pin = pin
          @__isValid = true
      if @__isValid
        @__removeInteractivity()
        @__g.mdGameManager.joinGame(@__pin)
      else
        #if not valid ensure animation has been removed
        @__removeAllServerActiveAnimation()
        @__g.rootViewController.alert {message:"Please enter your pin correctly!",label:"validation"}
      
  #called on start and when players update. Main this is to determin if we have yet to join a game,
  #or are already joined, therefore to show loading.
  #There is scope here that MDGM can have remnants from previous games, such as player list
  #therefore MDGM can show already joined, but I have coupled with ensuring the phaseIndex is at its
  #expected value. This may need more thought as to how to handle ended games within the MDGM.

  #This method is called by the UPDATED_PLAYERS event, this is called just before the UPDATED_SERVER event.

  #UPDATE 22/2/14
  #This function auto joining a previous ended game should of been fixed by resetting the MDGM before on initStart()
  #If there was a live game saved on localStorage then this would have been picked up previously by ChooseDeviceScreen

  #UPDATE 23/2/14
  #This is now called from UPDATE_SERVER event, and is called after the RVC, if RVC relocates then this 
  #method does not end up begining called as its listener is remove before it can be called, ensuring
  #no invalid data is called
  __checkWithGameManager: () =>
    super
    @__g.debug "MDJoinGame __checkWithGameManager()"
    #if @__g.mdGameManager.hasJoined() and @__g.mdGameManager.getPhaseIndex() is 0 #show
    if @__g.mdGameManager.hasJoined() #show
      if @__activeFrame isnt $(".frame-2")[0]
        @__showFrame2()
        @__g.navigationBar.drawNavigationButtons(["pause"])
        $(@__domNode).find(".frame-2 input").val(@__g.mdGameManager.getPin())
    else #hide
      if @__activeFrame isnt $(".frame-1")[0]
        @__showFrame1()
        @__g.navigationBar.drawNavigationButtons(["back"])
      @__addInteractivity();



  __showFrame1:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-1").get(0)

    # if @__previousFrame is $(".frame-2").get(0)
    #   TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
    #   TweenMax.to(@__previousFrame, 0.25, {scaleX:0.8, scaleY:0.8, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    #   TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})
    # else
    TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
    TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})

    @__isWaitingForServer = false
    @__hideWaitingCircle()
    #@__releaseNavigation()


  __showFrame2:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-2").get(0)

    TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
    TweenMax.to(@__previousFrame, 0.25, {scaleX:0.8, scaleY:0.8, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, delay:0.2, force3D:true, ease:Sine.easeOut})

    @__showWaitingCircle()
    #@__releaseNavigation()

  __initialiseFrame:()->  #override
    # at the time Zepto calculated width with padding, Jquery doesn't
    # paddingLeftInt = parseInt($(@__domNode).css("padding-left").replace(/[^-\d\.]/g, ''))
    paddingTopString = $(@__domNode).css("padding-top")
    # width = $(@__domNode).width() - (paddingLeftInt * 2)
    width = $(@__domNode).width()

    style =
      x: "0px"
      scaleX:1
      scaleY:1
      opacity:0
      display:"none"
      position:"absolute"
      top:paddingTopString
      width:width+"px"

    TweenMax.set($(".frame-1")[0], style)
    TweenMax.set($(".frame-2")[0], style)

    @__showFrame1()


  # __showWaitingForServer:()->
  #   if @__isWaitingForServer is false
  #     @__isWaitingForServer = true
  #     $(".frame-1").hide()
  #     $(".frame-2").show()
  #     @__showWaitingCircle()

  # __hideWaitingForServer:()->
  #   if @__isWaitingForServer is true
  #     @__isWaitingForServer = false
  #     @__hideWaitingForServer()
  #     $(".frame-1").show()
  #     $(".frame-2").hide()
  #     @__hideWaitingCircle()
  #   # if @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE
  #   @__addInteractivity()

  # __initialiseFrame:()->
  #   $(".frame-2").hide()
  #   @__isWaitingForServer = false



    
  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.BLUE then 100 else 1000
    @__fadeColorTo(masquerade.ColourManager.BLUE)

    #reset MDGM to ennsure that any lingering game properties are reset, like player list, this causes problems in the method below
        #TODO this should be done with check with game manager
    if @__g.mdGameManager.isCreator()
      $(".is-joiner").hide()
      @__pin = @__g.mdGameManager.getPin()
      $("input").val(@__pin)
    else
      $(".is-creator").hide()



    #this should not always trigger, if we have joined and phase index is 0, we are forwarded to this screen,
    #we have already got a response and setup the MDGM, however this resets it and then makes a request to the
    #server with a undefined pin resulting in a Response 3.
    #this command was supposed put here to reset because supposedly this was meant to be a deliberate step for
    #the user to join, and not an auto join. However starting this screen it seems that we need to allow
    #auto join, I'll remove this and place on the button before you navigate to join.
    #@__g.mdGameManager.reset()
    super
    #advise navigation bar, this is accomplished in __checkWithGameManager
    #@__g.navigationBar.drawNavigationButtons(["back"])


    #@__checkWithGameManager()

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout
  
  screenStart:()->
    super
    #@__checkWithGameManager()
    # @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__checkWithGameManager)
    # @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)


  outroStart:()->
    super
    #remove MDGM listeners here, so RVC.navigateTo removes them before they are called and potentially call invalid data
    # @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__checkWithGameManager)
    # @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)
    #@ignoreMDGM()

    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
