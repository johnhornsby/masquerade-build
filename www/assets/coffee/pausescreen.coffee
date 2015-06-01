#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.PauseScreen extends masquerade.InteractiveElement




  constructor: (domNode)->
    super domNode
    @__domNode = domNode





  #PRIVATE
  #_______________________________________________________________________________________
  __init:()->
    super

  __build:()->
    super
    @__addInteractivity()
    $(@__domNode).css("width",window.innerWidth + "px") #patch to force android 2.3 to full width
    @__setInitStyle()

  __handleButtonEvent:(mouseEvent)->
    super
    mouseEvent.stopPropagation()
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-resume"
      @dispatchEvent(new events.Event(masquerade.PauseScreen.RESUME_GAME_CLICK))
    if $(button).hasClass "button-exit"
      @dispatchEvent(new events.Event(masquerade.PauseScreen.EXIT_GAME_CLICK))
    #@__removeInteractivity()

  __introComplete:()->
    super

  __outroComtplete:()->
    super
    #@__domNode.classList.remove("fadeOutEnable")
    $(@__domNode).removeClass("fadeOutEnable")
    @__domNode.style.display = "none"

  __setInitStyle:()->
    TweenMax.set(@__domNode, {opacity:1, perspective: 500})
    @__container = $(@__domNode).find(".lightbox-content-container")
    TweenMax.set(@__container, {scaleX:1.2, scaleY:1.2, force3D:true})


  __cueIntroAnimation:()->
    TweenMax.to(@__domNode, 0.5, {opacity:1, ease:Strong.easeOut, onStart:@__animationStart, onComplete:@__animationEnd})
    TweenMax.to(@__container, 0.5, {scaleX:1, scaleY:1, ease:Expo.easeOut})

  __cueOutroAnimation:()->
    TweenMax.to(@__domNode, 0.2, {opacity:0, ease:Strong.easeOut, onStart:@__animationStart, onComplete:@__animationEnd})
    TweenMax.to(@__container, 0.2, {scaleX:1.2, scaleY:1.2, ease:Expo.easeOut})

  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    if @__g.mdGameManager.isActive()
      $(@__domNode).find("h6").html(@__g.mdGameManager.getPin())
      $(@__domNode).find("h6").show()
    else
      $(@__domNode).find("h6").hide()
    setTimeout ()=>
       @__domNode.style.display = "block"
    ,300
    setTimeout ()=>
      #timeout are used to make enought delay for touch to leave the device so any 
      @__cueIntroAnimation()
    ,350


  outroStart:()->
    super
    setTimeout ()=>
      @__cueOutroAnimation()
    ,350
    #@__domNode.classList.remove("fadeInEnable")
    #@__domNode.classList.add("fadeOutEnable")
    self = @__domNode
    #@__domNode.style.webkitTransform = "translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0)"


  screenEnd:()->
    super
    



masquerade.PauseScreen.EXIT_GAME_CLICK = "exitGame"
masquerade.PauseScreen.RESUME_GAME_CLICK = "resumeGame"