masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MultiDeviceScreen extends masquerade.Screen

  __textInput:{}
  # __uiDropdownViews:[]


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

    @__textInput = @__domNode.getElementsByTagName('input')[0]
    # @__textInput.addEventListener("change", @__onTextFieldOnChange,false)
    $(@__textInput).val(@__g.localStorageManager.getName())
    @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, @__onProfileOkClick)
    #@__g.mdGameManager.addEventListener(masquerade.MDGameManager.CREATE_GAME_COMPLETE, @__onCreateGameComplete)

      
  __onProfileOkClick:(e) =>
    #may be an error
    if e.data.label is "validation"
      e = new events.Event(masquerade.Screen.NAVIGATE_TO, {name:"profile"})
      @dispatchEvent(e)

  # __onCreateGameComplete:() =>
  #   @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"md-join-game"}))

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-profile"
      e = new events.Event(masquerade.Screen.NAVIGATE_TO, {name:"profile"})
      @dispatchEvent(e)
      @__removeInteractivity()
    else if $(button).hasClass "button-create"
      if @__g.localStorageManager.isProfileValid() is false
        @__g.rootViewController.alert {message:"Please complete your player profile to play!", label:"validation"}
      else
        #reset here as this is distinctly a direct user action and are wanting a new game
        # @__g.mdGameManager.reset()
        # @__g.mdGameManager.createGame()
        # @__removeInteractivity()

        #@__g.mdGameManager.reset()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"game-options"}))
        @__removeInteractivity()

    else if $(button).hasClass "button-join"
      if @__g.localStorageManager.isProfileValid() is false
        @__g.rootViewController.alert {message:"Please complete your player profile to play!", label:"validation"}
      else
        #reset here as this is distinctly a direct user action and are wanting a new game, rather than join an exiting one
        @__g.mdGameManager.reset()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"md-join-game"}))
        @__removeInteractivity()


  __setInitStyle:()->
    $(@__domNode).css("opacity","0")
    peelOffsetY = -50
    #TODO 
    #back from where ????
    # slideOffsetX = 
    if @__g.rootViewController.isAnimatingForward() is false
      peelOffsetY *= -1
    index = 0
    elements = $(@__domNode).find(".animation-peel")
    for element in elements
      TweenMax.set(element, {y:peelOffsetY, opacity:0, force3D:true})
      index++


  __cueIntroAnimation:()->
    TweenMax.to(@__domNode, 1, {opacity:1, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeOut})
    index = 0
    elements = $(@__domNode).find(".animation-peel")
    length = elements.length
    for element in elements
      TweenMax.to(element, 0.75, {y:0, opacity:1, delay:index * 0.05, ease:Expo.easeOut})
      index++


  __cueOutroAnimation:()->
    TweenMax.to(@__domNode, 0.5, {opacity:0, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeIn})
    peelOffsetX = 50
    if @__g.rootViewController.isAnimatingForward() is false
      peelOffsetX *= -1
    index = 0
    elements = $(@__domNode).find(".animation-peel")
    length = elements.length
    for element in elements
      TweenMax.to(element, 0.375, {y:peelOffsetX, opacity:0, delay:((length-1)-index) * 0.025, ease:Expo.easeIn})
      index++


  #       __setInitStyle:()->
  #   $(@__domNode).css("opacity","0")
  #   slideOffsetX = 50
  #   if @__g.rootViewController.isAnimatingForward() is false
  #     slideOffsetX *= -1
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   for element in elements
  #     TweenMax.set(element, {x:slideOffsetX, opacity:0, force3D:true})
  #     index++

  # __cueIntroAnimation:()->
  #   TweenMax.to(@__domNode, 1, {opacity:1, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeOut})
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   length = elements.length
  #   for element in elements
  #     TweenMax.to(element, 0.75, {x:0, opacity:1, delay:index * 0.05, ease:Expo.easeOut})
  #     index++

  # __cueOutroAnimation:()->
  #   TweenMax.to(@__domNode, 0.5, {opacity:0, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeIn})
  #   slideOffsetX = -50
  #   if @__g.rootViewController.isAnimatingForward() is false
  #     slideOffsetX *= -1
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   length = elements.length
  #   for element in elements
  #     TweenMax.to(element, 0.375, {x:slideOffsetX, opacity:0, delay:((length-1)-index) * 0.025, ease:Expo.easeIn})
  #     index++



  #PUBLIC
  #_______________________________________________________________________________________
  screenStart:()->
    super


  introStart:()->
    super
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])
    
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.BLUE then 100 else 1000
    @__fadeColorTo(masquerade.ColourManager.BLUE)


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
    @__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK,@__onProfileOkClick)
    #@__g.mdGameManager.removeEventListener(masquerade.MDGameManager.CREATE_GAME_COMPLETE, @__onCreateGameComplete)
