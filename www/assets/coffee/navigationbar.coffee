#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.NavigationBar extends masquerade.InteractiveElement

  __helpButton:{}
  __pauseButton:{}
  __backButton:{}
  __isHelpActive:false
  __helpContentContainer:{}
  __isHelpAvailable:false

  __helpButtonOffSVG:""
  __helpButtonOnSVG:""
  __helpCanvas:{}
  __serverBusy:false



  constructor: (domNode)->
    super domNode
    @__domNode = domNode





  #PRIVATE
  #_______________________________________________________________________________________
  __init:()->
    super

    @__isHelpActive = false


  __build:()->
    super
    if @__g.platform is "ios" and @__g.osVersion >= 7
      $(@__domNode).addClass("status-bar-offset")
    $(@__domNode).css("width",window.innerWidth + "px") #patch to force android 2.3 to full width
    @__domNode.getElementsByClassName("help")[0].style.height = window.innerHeight + "px"
    @__helpButton = @__domNode.getElementsByClassName("button-help")[0]

    @__pauseButton = @__domNode.getElementsByClassName("button-pause")[0]
    @__backButton = @__domNode.getElementsByClassName("button-back")[0]
    @__helpContentContainer = @__domNode.getElementsByClassName("lightbox-content-container")[0]
    @__isHelpAvailable = false
    #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
    if @__g.platform is "android" and @__g.osVersion < 4
      @__convertSVGToCanvas() #patch android 2.2 2.3 lack of SVG support
    else
      $(@__helpButton).find("path").css("visibility","visible")
      $(@__helpButton).find("polygon").css("visibility","hidden")

    @__addInteractivity()
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER, @__sendToServer)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS, @__sendToServerComplete)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__sendToServerComplete)

    # hide all at very start
    @drawNavigationButtons([],false)

  __convertSVGToCanvas:()->
    @__convertButtonSVGToCanvas(@__backButton,15,15,0.7)
    @__convertButtonSVGToCanvas(@__pauseButton,15,15,0.7)
    @__convertHelpButtonSVGToCanvas(0,15,0.7)

  __drawHelpCanvasFromSVG:(svgString)->

  __convertHelpButtonSVGToCanvas:(offsetX,offsetY,scaleXY)->
    $svg = $(@__helpButton).find("svg")
    $(@__helpButton).css("-webkit-transform","scale(1)")
    $group = $(@__helpButton).find("svg > g")
    $group.attr("transform","translate(#{offsetX}px,#{offsetY}px) scale(#{scaleXY})")
    @__helpCanvas = {}
    @__helpCanvas = document.createElement("canvas");
    @__helpCanvas.setAttribute("style", "height:" + "60px" + ";width:" + "60px;");
    @__helpCanvas.setAttribute("height","60px")
    @__helpCanvas.setAttribute("width","60px")
    $(@__helpButton).append(@__helpCanvas)
    $svg = $(@__helpButton).find("svg")
    helpSVGString = @__helpButton.innerHTML
    helpSVGString = helpSVGString.substring(0,helpSVGString.indexOf("<canvas"))
    helpSVGString = helpSVGString.substring(helpSVGString.indexOf("<svg"))
    #remove newline / carriage return
    helpSVGString = helpSVGString.replace(/\n/g, "");
    #remove whitespace (space and tabs) before tags
    helpSVGString = helpSVGString.replace(/[\t ]+\</g, "<");
    #remove whitespace between tags
    helpSVGString = helpSVGString.replace(/\>[\t ]+\</g, "><");
    #remove whitespace after tags
    helpSVGString = helpSVGString.replace(/\>[\t ]+$/g, ">");
    #remove question mark from svg
    @__helpButtonOnSVG = helpSVGString.replace(/\<path(.*)path\>/, "")
    #remove cross from svg
    @__helpButtonOffSVG = helpSVGString.replace(/\<polygon(.*)polygon\>/, "")
    canvg(@__helpCanvas,@__helpButtonOffSVG)
    $svg.css({display:"none"})


  __convertButtonSVGToCanvas:(buttonElement,offsetX,offsetY,scaleXY)->
    $svg = $(buttonElement).find("svg")

    $(buttonElement).css("-webkit-transform","scale(1)")

    $group = $(buttonElement).find("svg > g")
    $group.attr("transform","translate(#{offsetX}px,#{offsetY}px) scale(#{scaleXY})")

    canvas = {}

    canvas = document.createElement("canvas");
    canvas.setAttribute("style", "height:" + "60px" + ";width:" + "60px;");
    canvas.setAttribute("height","60px")
    canvas.setAttribute("width","60px")

    $(buttonElement).append(canvas)
    $svg = $(buttonElement).find("svg")
    svgString = buttonElement.innerHTML
    svgString = svgString.substring(0,svgString.indexOf("<canvas"))
    svgString = svgString.substring(svgString.indexOf("<svg"))
    $svg.css({display:"none"})
    canvg(canvas,svgString)


  __handleButtonEvent:(mouseEvent)->
    super
    if @__serverBusy is true
      return true
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-help"
      @dispatchEvent(new events.Event(masquerade.NavigationBar.HELP_CLICK))
      if @__isHelpAvailable
        if @__isHelpActive
          @__isHelpActive = false
          @__helpContentContainer.parentNode.style.display = "none"
          #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
          if @__g.platform is "android" and @__g.osVersion < 4
            canvg(@__helpCanvas,@__helpButtonOffSVG) #patch android 2.2 2.3 lack of SVG support
          else
            $(@__helpButton).find("path").css("visibility","visible")
            $(@__helpButton).find("polygon").css("visibility","hidden")
        else
          @__isHelpActive = true
          @__helpContentContainer.parentNode.style.display = "block"
          #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
          if @__g.platform is "android" and @__g.osVersion < 4
            canvg(@__helpCanvas,@__helpButtonOnSVG) #patch android 2.2 2.3 lack of SVG support
          else
            $(@__helpButton).find("path").css("visibility","hidden")
            $(@__helpButton).find("polygon").css("visibility","visible")

    if $(button).hasClass "button-pause"
      @dispatchEvent(new events.Event(masquerade.NavigationBar.PAUSE_CLICK))
    if $(button).hasClass "button-back"
      @dispatchEvent(new events.Event(masquerade.NavigationBar.BACK_CLICK))


  __sendToServer:(e)=>
    #do not deactivate on getState
    if e.data.callString isnt "getState"
      @__serverBusy = true
      buttons = @__domNode.getElementsByClassName("button")
      for button in buttons
          TweenMax.killTweensOf(button,{opacity:true})
          TweenMax.to(button,1,{opacity:0.1})
      #@__removeInteractivity()

  __sendToServerComplete:()=>
    buttons = @__domNode.getElementsByClassName("button")
    @__serverBusy = false
    for button in buttons
        TweenMax.killTweensOf(button,{opacity:true})
        TweenMax.to(button,1,{opacity:1})
    #@__addInteractivity()



  #PUBLIC
  #_______________________________________________________________________________________
  drawNavigationButtons:(buttonNameArray=[],showNavBar=true)->
    for button in @__buttonInstances
      if buttonNameArray.indexOf(button.name) > -1
        if button.name is "back" && @__g.rootViewController.getHistoryLength() > 0
          button.style.display = "block"
        else if button.name isnt "back"
          button.style.display = "block"
      else
        button.style.display = "none"
    @__domNode.getElementsByClassName("nav-back")[0].style.display = if showNavBar then "block" else "none"

  setNavigationTitle:(text="")->
    #ensure help is closed upon every screen
    if @__isHelpActive
      @__isHelpActive = false
      @__helpContentContainer.parentNode.style.display = "none"
    headerH2 = @__domNode.getElementsByClassName("nav-header-title")[0]
    headerH2.innerHTML = text

  setHelpContentNode:(node)->
    if @__helpContentContainer.childNodes.length > 0
      @__helpContentContainer.removeChild @__helpContentContainer.firstChild while @__helpContentContainer.firstChild
    if node is undefined
      @__isHelpAvailable = false
    else
      @__isHelpAvailable = true
      @__helpContentContainer.appendChild(node)

  goBack: ()->
    @dispatchEvent(new events.Event(masquerade.NavigationBar.BACK_CLICK))

  showLoading: () ->
    $(".connect-to-server .loading").show()

  hideLoading: () ->
    $(".connect-to-server .loading").hide()
    




masquerade.NavigationBar.BACK_CLICK = "backClick"
masquerade.NavigationBar.PAUSE_CLICK = "pauseClick"
masquerade.NavigationBar.HELP_CLICK = "helpClick"