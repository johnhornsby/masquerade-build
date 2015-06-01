masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.GameOptionsScreen extends masquerade.MDScreen


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
    if $(button).hasClass "button-training-mode"
      @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE)
      @__g.gameManager.setPlayerNames("Judge", "Player A", "Player B")
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-characteristic"}))
    if $(button).hasClass "button-single-round"
       
      @__g.isSingleRound = true
      if @__g.isMultiDevice
        #reset here as this is distinctly a direct user action and are wanting a new game
        @__g.mdGameManager.reset()
        @__g.mdGameManager.createGame()
        @__removeInteractivity()
      else
        @__removeAllServerActiveAnimation() #override the server animation that was added in super
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND)
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"who-is-playing"}))
        @__removeInteractivity()

    if $(button).hasClass "button-three-rounds"
      @__g.isSingleRound = false
      if @__g.isMultiDevice
        #reset here as this is distinctly a direct user action and are wanting a new game
        @__g.mdGameManager.reset()
        @__g.mdGameManager.createGame()
        @__removeInteractivity()
      else
        @__removeAllServerActiveAnimation() #override the server animation that was added in super
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_THREE_ROUNDS)
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"who-is-playing"}))
        @__removeInteractivity()


  __onBackClick:()=>
    #why is this here, this part of clean up operations.
    #if the user has pressed one of the buttons and its beginning to contact the server
    #if they press back then we need to cancel this if before RVC navigates away

    #hmmm not thought this through properly
    #i've been testing with the ip address to server being wrong
    #@__g.mdGameManager.reset()
    
  __checkWithGameManager:(e)=> #override
    super

  __onServerError:(e)=>
    super
    @__removeAllServerActiveAnimation() #override the server animation that was added in super
    @__addInteractivity()

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
  screenStart:()->
    super
    @__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)

  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    
    @__g.navigationBar.drawNavigationButtons(["back"])


    #need to hide training mode if multi device
    if @__g.isMultiDevice is true
      $(".menu li:first-child").hide().next().hide()
      targetColour = masquerade.ColourManager.BLUE
    else
      targetColour = masquerade.ColourManager.GREEN

    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)


    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  outroStart:()->
    super
    #window.log "not yet please"
    setTimeout ()=>
      #window.log "wait to remove untill it can be called then pressing the back"
      @__cueOutroAnimation()
      @__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)
    ,0

  screenEnd:()->
    super
