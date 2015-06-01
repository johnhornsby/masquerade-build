#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.AlertScreen extends masquerade.InteractiveElement


  __useLabel:""
  __clickedOK:true
  __container:{}


  constructor: (domNode)->
    super domNode
    @__useLabel = ""
    @__clickedOK = true
    @__container = {}
    @__domNode = domNode





  #PRIVATE
  #_______________________________________________________________________________________
  __init:()->
    super

  __build:()->
    super
    @__addInteractivity()
    $(@__domNode).css("width",window.innerWidth + "px") #patch to force android 2.3 to full width
    if @__g.platform is "android" and @__g.osVersion < 4
      $(@__domNode).addClass("android2");
    @__setInitStyle()

  
  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-ok"
      @__clickedOK = true
      # setTimeout ()=>
      @dispatchEvent(new events.Event(masquerade.AlertScreen.OK_CLICK, {label: @__useLabel}))
      # ,200
    if $(button).hasClass "button-cancel"
      @__clickedOK = false
      # setTimeout ()=>
      @dispatchEvent(new events.Event(masquerade.AlertScreen.CANCEL_CLICK, {label: @__useLabel}))
      # ,200
      

  __introComplete:()->
    super

  __outroComtplete:()->
    super
    @__domNode.style.display = "none"


  __setInitStyle:()->
    TweenMax.set(@__domNode, {opacity:1, perspective: 500})
    @__container = $(@__domNode).find(".lightbox-content-container")
    TweenMax.set(@__container, {scaleX:0.85, scaleY:0.85, force3D:true})


  __cueIntroAnimation:()->
    TweenMax.to(@__domNode, 0.5, {opacity:1, ease:Strong.easeOut, onStart:@__animationStart, onComplete:@__animationEnd})
    TweenMax.to(@__container, 0.5, {scaleX:1, scaleY:1, ease:Elastic.easeOut})

  __cueOutroAnimation:()->
    TweenMax.to(@__domNode, 0.2, {opacity:0, ease:Strong.easeOut, onStart:@__animationStart, onComplete:@__animationEnd})
    TweenMax.to(@__container, 0.2, {scaleX:0.85, scaleY:0.85, ease:Expo.easeOut})

  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    setTimeout ()=>
       @__domNode.style.display = "block"
    ,300
    setTimeout ()=>
      #timeout are used to make enought delay for touch to leave the device so any 
      @__cueIntroAnimation()
    ,350

  outroStart:()->
    super
    self = @__domNode
    setTimeout ()=>
      @__cueOutroAnimation()
    ,350

  screenEnd:()->
    super
    $(@__domNode).find(".message").html("")
  
  #called berfore introStart()
  setContent:(contentObject={})->
    messageHTML = if contentObject.message isnt undefined then contentObject.message else ""
    $(@__domNode).find(".message").html(messageHTML)

    ok = if contentObject.ok isnt undefined then contentObject.ok else "OK"
    $(@__domNode).find(".button-ok").html(ok)

    cancel = if contentObject.cancel isnt undefined then contentObject.cancel else "CANCEL"
    $(@__domNode).find(".button-cancel").html(cancel)

    if contentObject.cancel
      $(@__domNode).find(".button-cancel").css({display:"inline-block"})
    else
      $(@__domNode).find(".button-cancel").css({display:"none"})

    @__useLabel = if contentObject.label isnt undefined then contentObject.label else ""



masquerade.AlertScreen.OK_CLICK = "okClick"
masquerade.AlertScreen.CANCEL_CLICK = "cancelClick"