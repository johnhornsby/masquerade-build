masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.SettingsScreen extends masquerade.MDScreen

  __isCharacterLimitShort:true
  __activeFrame:undefined
  __previousFrame:undefined
  __frames:[]
  __frameAnimationTime:0.25

  constructor: (domNode)->
    super domNode
    @__isCharacterLimitShort = true;






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    @__frames = $("frame")
    #$(@__domNode).addClass("fade-init")



    #--
    @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    #@__g.rootViewController.addEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)
      

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-character-short"
      @__toggleCharacterLimitButtons(150)
    if $(button).hasClass "button-character-long"
      @__toggleCharacterLimitButtons(400)
    if $(button).hasClass "button-reset-scores"
      setTimeout ()=>
        @__g.rootViewController.alert {message:"Are you sure?",ok:"Yes",cancel:"No", label:"reset-scores"}
      ,33
    if $(button).hasClass "button-language"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"language"}))
    if $(button).hasClass "button-profile"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"profile"}))
    if $(button).hasClass "button-log"
      @__showFrame2()
    if $(button).hasClass "button-reset-log"
      setTimeout ()=>
        @__g.rootViewController.alert {message:"Are you sure?",ok:"Yes",cancel:"No", label:"reset-log"}
      ,33
    # @__removeInteractivity()

  __toggleCharacterLimitButtons:(isShort)->
    shortBackColour = @__g.colourManager.getInvertBaseColour()
    shortTextColour = @__g.colourManager.getCurrentColour()
    longBackColour = @__g.colourManager.getCurrentColour()
    longTextColour = @__g.colourManager.getInvertBaseColour()
    
    if isShort isnt 150
      @__isCharacterLimitShort = false
      @__g.localStorageManager.setCharacterLimit(400)
      shortBackColour = @__g.colourManager.getCurrentColour()
      shortTextColour = @__g.colourManager.getInvertBaseColour()
      longBackColour = @__g.colourManager.getInvertBaseColour()
      longTextColour = @__g.colourManager.getCurrentColour()
    else
      @__g.localStorageManager.setCharacterLimit(150)
    $(@__domNode).find(".button-character-short").css("background-color", shortBackColour)
    $(@__domNode).find(".button-character-short").css("color", shortTextColour)
    $(@__domNode).find(".button-character-long").css("background-color", longBackColour)
    $(@__domNode).find(".button-character-long").css("color", longTextColour)

  __onAlertOkClick:(e)=>
    if e.data.label is "reset-scores"
      @__g.localStorageManager.clearHighScores()
      @__g.localStorageManager.resetLog()
      @__g.mdGameManager.reset()
      @__g.localStorageManager.setGender(undefined)
      @__g.localStorageManager.setName("")
      @__g.localStorageManager.setAge(0)
      @__g.localStorageManager.setIsInActiveGame(false)
      @__g.localStorageManager.clearActivePin()
      @__g.localStorageManager.setPrivacy("true")
      @__g.localStorageManager.setCharacterLimit(150)
      @__toggleCharacterLimitButtons(150)

    if e.data.label is "reset-log"
      @__g.localStorageManager.resetLog()
    #@__g.gameManager.recordRoundScoring()
    # @__g.gameManager.makeGuess(@__guessChar)
    # @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"round-end"}))
    # @__removeInteractivity()

  # __onAlertCancelClick:()=>
    # @__getButtonWithName("guess-a").classList.remove("selected")
    # @__getButtonWithName("guess-b").classList.remove("selected")
    # $(@__getButtonWithName("guess-a")).removeClass("selected")
    # $(@__getButtonWithName("guess-b")).removeClass("selected")

  __showFrame1:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-1").get(0)

    if @__previousFrame is $(".frame-2").get(0)
      TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
      TweenMax.to(@__previousFrame, 0.25, {scaleX:0.8, scaleY:0.8, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
      TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})
    else
      TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
      TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})

    @__releaseNavigation()
    @__g.navigationBar.drawNavigationButtons(["back"])

  __showFrame2:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-2").get(0)

    log = @__g.localStorageManager.getLog()
    $(@__activeFrame).find("textarea").val(log)

    TweenMax.set(@__activeFrame, {scaleX:0.8, scaleY:0.8, opacity:0, display: "block"})
    TweenMax.to(@__previousFrame, 0.25, {scaleX:1.3, scaleY:1.3, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, delay:0.1, force3D:true, ease:Sine.easeOut})
    

    @__hijackNavigation()
    @__g.navigationBar.drawNavigationButtons(["back"])



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

  __killTweenMax:()->
    $(".frame").each ()->
      TweenMax.killTweensOf this

  __onBackClick:()=>
    #@__g.localStorageManager.resetLog()
    @__showFrame1()
    
  __hijackNavigation:()->
    @__g.rootViewController.setListenToNavigationEvents(false)
    @__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)

  __releaseNavigation:()->
    @__g.rootViewController.setListenToNavigationEvents(true)
    @__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)

  #PUBLIC
  #_______________________________________________________________________________________
  screenStart:()->
    super
    #window.log("screenStart() #{@__name}")

  introStart:()->
    super

    if masquerade.Globals.isDebugging is true
      $(@__domNode).find(".button-log").show()
      $(@__domNode).find(".button-reset-log").show()
    else
      $(@__domNode).find(".button-log").hide()
      $(@__domNode).find(".button-reset-log").hide()

    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.GREEN then 100 else 1000

    @__fadeColorTo(masquerade.ColourManager.GREEN)

    #set character limit toggle colour

    cl = @__g.localStorageManager.getCharacterLimit()
    @__toggleCharacterLimitButtons(cl)

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
    @__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    #@__g.rootViewController.removeEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)
