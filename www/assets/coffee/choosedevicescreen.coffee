masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ChooseDeviceScreen extends masquerade.MDScreen

  __isNavigatingBack:false

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super

    # @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, @__onAlertOkClick)

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-single-device"
      #reset MDGM clear out localStorage, good housekeeping
      @__g.mdGameManager.reset()
      @__g.isMultiDevice = false
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"game-options"}))

    if $(button).hasClass "button-multi-device"

      @__g.isMultiDevice = true
      if @__g.mdGameManager.shouldTryToRecconect()
        @__g.mdGameManager.reconnect()
      else
        #patch to remove any animation, as this button is a server call button
        @__removeAllServerActiveAnimation()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"multi-device"}))

    @__removeInteractivity()

  # __onAlertOkClick:()=>
  #   @__g.mdGameManager.clearLocalStorageGameData()
  #   @__addInteractivity()
  #   @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"multi-device"}))



  __setInitStyle:()->
    $(@__domNode).css("opacity","0")
    peelOffsetX = -50
    if @__g.rootViewController.isAnimatingForward() is false
      peelOffsetX *= -1
    index = 0
    elements = $(@__domNode).find(".animation-peel")
    for element in elements
      TweenMax.set(element, {y:peelOffsetX, opacity:0, force3D:true})
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

  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])
    # @__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)
    
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.GREEN then 100 else 1000

    @__fadeColorTo(masquerade.ColourManager.GREEN)


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
    # @__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK, @__onAlertOkClick)
