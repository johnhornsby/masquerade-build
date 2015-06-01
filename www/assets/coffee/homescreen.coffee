masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.HomeScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode
    @__scrollPanelViewController = {}
    





  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    @__g.resetDebugger()

  __build:() ->
    super
    # #patch for usign TweenMax
    # if @__g.useTweenMax
    #   $(@__domNode).css("opacity","0")
    # else
    #   $(@__domNode).addClass("fade-init")

    

    #@__domNode.getElementsByTagName("footer")[0].style.visibility = "hidden"
    #titleImageIndex = if window.innerWidth >= 500 then 0 else 1
    #@__domNode.getElementsByClassName("title-image")[titleImageIndex].classList.remove("hide")


  __handleButtonEvent:(mouseEvent)->
    window.log "home __handleButtonEvent()"
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-choose-device"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-device"}))
    if $(button).hasClass "button-how-to-play"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"how-to-play"}))
    if $(button).hasClass "button-high-scores"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"high-scores"}))
    if $(button).hasClass "button-settings"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"settings"}))
    @__removeInteractivity()

  __introComplete:()->
    super
    ######################
    #LANGUAGE DEACTIVATED#
    ######################
    # if localStorage.language is undefined
    #   @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"language"}))
    window.log "home __introComplete()"
    
  __placeFooter:()->
    footer = @__domNode.getElementsByTagName("footer")[0]
    footerHeight = footer.clientHeight
    footerTop = footer.offsetTop
    screenHeight = window.innerHeight
    footer.style.marginTop = String(screenHeight - (footerHeight+footerTop+@__g.statusBarOffset)) + "px"
    if $(footer).offset().top > $(footer).prev().offset().top + $(footer).prev().height()
      @__domNode.getElementsByTagName("footer")[0].style.visibility = "visible"
    else
      @__domNode.getElementsByTagName("footer")[0].style.visibility = "hidden"

  __sendCallToServerSuccess:(data)->
    $(".debug-output").html(JSON.stringify(data))

  __sendCallToServerError:(data)->
    window.log "error " + data
    for key of data
      window.log "#{key} - " + data[key]
    #$(".debug-output").html(JSON.stringify(data))


  # __setInitStyle:()->
  #   #patch for usign TweenMax
  #   if @__g.useTweenMax
  #     #TweenMax.set(@__domNode.parentNode, {perspective: 500})
  #     TweenMax.set(@__domNode, {transformOrigin:"center center -400px", opacity:0, rotationY:-90})
  #   else
  #     $(@__domNode).addClass("fade-init")

  # __cueIntroAnimation:()->
  #   #patch for usign TweenMax
  #   if @__g.useTweenMax
  #     TweenMax.to(@__domNode, @__g.tweenMaxInTime, {force3D:true, opacity:1, rotationY:0, onStart:@__animationStart, onComplete:@__animationEnd})
  #   else
  #     $(@__domNode).removeClass("fade-init")
  #     $(@__domNode).addClass("fade-complete")


  __setInitStyle:()->
    $(@__domNode).css("opacity","0")

    peelOffsetX = 50
    index = 0
    
    TweenMax.set($(@__domNode).find(".image-home-header"), {scaleX:1.2, scaleY:1.2, force3D:true})
    elements = $(@__domNode).find(".animation-peel")
    for element in elements
      TweenMax.set(element, {y:peelOffsetX, opacity:0, force3D:true})
      index++

  __cueIntroAnimation:()->
    TweenMax.to(@__domNode, 1, {opacity:1, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeOut})
    TweenMax.to($(@__domNode).find(".image-home-header"), 1, {scaleX:1, scaleY:1, ease:Expo.easeOut})
    index = 0
    elements = $(@__domNode).find(".animation-peel")
    length = elements.length
    for element in elements
      TweenMax.to(element, 0.75, {y:0, opacity:1, delay:index * 0.05, ease:Expo.easeOut})
      index++

  __cueOutroAnimation:()->
    TweenMax.to(@__domNode, 0.5, {opacity:0, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeIn})
    TweenMax.to($(@__domNode).find(".image-home-header"), 0.5, {scaleX:1.2, scaleY:1.2, ease:Expo.easeIn})
    peelOffsetX = 50
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



  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #@__domNode.style.webkitTransform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";

    @__waitingCircle = new masquerade.WaitingCircle("waiting-for-server")
    @__waitingCircle.start()

    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.GREEN then 100 else 1000
    #console.log("home introStart()")


    
    
    
    # options = 
    #   type: 'GET',
    #   url: "http://192.168.128.132/api/game/getserverstate/FRIyGd2W",
    #   jsonpCallback: 'jsonCallback',
    #   contentType: "application/json",
    #   dataType: 'jsonp',
    #   data: {"id":"ajsodj"},
    #   success: @__sendCallToServerSuccess,
    #   error: @__sendCallToServerError
    # $.ajax options

    #Create a stage by getting a reference to the canvas

    # stage = new createjs.Stage("waiting-for-server")
    # createjs.Ticker.setFPS(50)
    # strokeWidth = 4
    # width = $("#waiting-for-server").width()
    # height = $("#waiting-for-server").height()
    # centrePoint = new createjs.Point(width / 2, height / 2)
    # circle = new createjs.Shape()
    # circle.graphics.setStrokeStyle(strokeWidth,"butt").beginStroke("#FFFFFF")
    # circle.graphics.arc(0, 0, (width / 2) - (strokeWidth/2), 0, Math.PI * 2)
    # circle.x = width / 2
    # circle.y = height / 2
    # stage.addChild(circle)
    # #Update stage will render next frame
    # increment = 0

    # circle.setTransform(circle.x, circle.y, 0.5, 0.5)

    # stage.update()
    # createjs.Ticker.addEventListener "tick", ()->
    #   circle.graphics.clear()
    #   increment += 0.01
    #   if increment > 2
    #     increment = 0
    #   circle.graphics.setStrokeStyle(strokeWidth,"butt").beginStroke("rgba(0, 0, 0, 0.1)")
    #   circle.graphics.arc(0, 0, (width / 2) - (strokeWidth/2), 0, Math.PI * 2)
    #   circle.graphics.setStrokeStyle(strokeWidth,"butt").beginStroke("#FFFFFF")
    #   circle.graphics.arc(0, 0, (width / 2) - (strokeWidth/2), 0, Math.PI * increment)
      
      #stage.update()
    


    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

    setTimeout ()=>
      @__placeFooter()
      #wc.start()
    ,timeout

    #Advise Navigation Bar
    @__g.navigationBar.drawNavigationButtons([],false)
    @__fadeColorTo(masquerade.ColourManager.GREEN)


  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    #self = @__domNode
    #@__domNode.style.webkitTransform = "translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0)"
    # setTimeout ()->
    #   self.classList.remove("left-complete")
    #   self.classList.add("out-init")
    # ,0
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
