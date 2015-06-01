#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.InteractiveElement extends display.EventDispatcher


  __g:masquerade.Globals
  __fastClickInstances:[]
  __buttonInstances:[]
  __domNode:{}
  __animationMode:""
  __name:""


  constructor: (domNode)->
    super
    @__domNode = domNode
    @__fastClickInstances = []
    @__buttonInstances = []
    @__animationMode = ""
    @__name = ""
    @__init()






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->

    @__name = @__domNode.className.substring(@__domNode.className.indexOf("-")+1)
    @__name = @__name.substring(0, @__name.indexOf(" "))

    @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE
    if @__g.useTweenMax is false
      @__domNode.addEventListener("webkitAnimationStart", @__animationStart, false)
      @__domNode.addEventListener("webkitAnimationIteration", @__animationIteration, false)
      @__domNode.addEventListener("webkitAnimationEnd", @__animationEnd, false)
      @__domNode.addEventListener("webkitTransitionStart", @__animationStart, false )
      @__domNode.addEventListener("webkitTransitionEnd", @__animationEnd, false )
    #for Firefox
    # @__domNode.addEventListener("animationstart", @__animationStart, false)
    # @__domNode.addEventListener("animationiteration", @__animationIteration, false)
    # @__domNode.addEventListener("animationend", @__animationEnd, false)
    # @__domNode.addEventListener("transitionStart", @__animationStart, false )
    # @__domNode.addEventListener("transitionEnd", @__animationEnd, false )

    @__build()

  __build:() ->
    @__g.debug("#{@__name} build()")
    @__fastClickInstances = []
    @__buttonInstances = []
    buttons = @__domNode.getElementsByClassName("button")
    for button in buttons
      button.name = button.className.substring(button.className.indexOf("-")+1).split(" ")[0]
      @__buttonInstances.push(button)
      @__fastClickInstances.push(new FastClick(button))
      
      #button.addEventListener("mousedown",@__onButtonMouseDown,false)
      #button.addEventListener("mouseup",@__onButtonMouseUp,false)
      #$(button).on "mousedown", (e) ->
        #$(this).get(0).style.webkitTransform = "translate3d(0,0,-150px)"

      # s = this
      # $(button).on "mousedown", (e) ->
      #   e.preventDefault()
      #   $self = $(this)
      #   $self.one("webkitAnimationEnd", ->
      #     $self.removeClass "pulse"
      #     s.__onButtonClick(e)
      #   ).addClass "pulse"
    @__g.translationManager.translateDomNode(@__domNode)
    return null

  # __onButtonMouseDown:(mouseEvent)=>
  #   buttonNode = mouseEvent.currentTarget
  #   #buttonNode.style.webkitTransform = "translate3d(0,0,-150px)"

  #   #buttonNode.style.opacity = "0.5"
  #   buttonNode.style.backgroundColor = "rgba(0,0,0,0.1)"
  #   window.addEventListener("mouseup",@__onButtonMouseUp,false)

  # __onButtonMouseUp:(mouseEvent)=>
  #   buttonNode = mouseEvent.currentTarget
  #   #buttonNode.style.webkitTransform = "translate3d(0,0,0px)"
  #   buttonNode.style.backgroundColor = "rgba(0,0,0,0)"

  __onButtonClick:(mouseEvent)=>
    buttonNode = mouseEvent.currentTarget
    className = buttonNode.className
    name = className.substring(className.indexOf("-")+1).split(" ")[0]
    @__g.debug "interactiveelement __onButtonClick() Button Clicked:#{name}"
    @__handleButtonEvent(mouseEvent)

  __handleButtonEvent:(mouseEvent)->
    #override


  __animationStart:(e)=>
    #patch for usign TweenMax
    if @__g.useTweenMax is false
      if e.currentTarget isnt e.target
        e.stopPropagation()
        return 0
    #--
    if @__animationMode is masquerade.InteractiveElement.ANIMATION_MODE_IN
      @dispatchEvent(new events.Event(masquerade.InteractiveElement.INTRO_START))
    else if @__animationMode is masquerade.InteractiveElement.ANIMATION_MODE_OUT
      @dispatchEvent(new events.Event(masquerade.InteractiveElement.OUTRO_START))
    #@dispatchEvent(new events.Event(masquerade.InteractiveElement.ANIMATION_START))

  __animationIteration:(e)=>
    #@dispatchEvent(new events.Event(masquerade.InteractiveElement.ANIMATION_MODE_INTERATION))

  __animationEnd:(e)=>
    #patch for usign TweenMax
    if @__g.useTweenMax is false
      if e.currentTarget isnt e.target
        e.stopPropagation()
        return 0
    #--
    # str = "__animationEnd "
    # for key of e
    #   str += key + ":" + e[key] + " "
    # @__g.debug str
    if @__animationMode is masquerade.InteractiveElement.ANIMATION_MODE_IN
      @__introComplete()
    else
      @__outroComtplete()
    @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE
    

  __introComplete:()->
    @dispatchEvent(new events.Event(masquerade.InteractiveElement.INTRO_COMPLETE))
    #clear all animation classes
    $(@__domNode).removeClass("fadeInEnable")
    $(@__domNode).removeClass("pullInEnable")
    $(@__domNode).removeClass("slideInRightEnable")
    $(@__domNode).removeClass("slideUpEnable")
    
    @__addInteractivity()

    #overide

  __outroComtplete:()->
    @dispatchEvent(new events.Event(masquerade.InteractiveElement.OUTRO_COMPLETE))
    #overide

  __getButtonWithName:(name)->
    for button in @__buttonInstances
      if button.name is name
        return button
    return undefined

  __removeInteractivity:(debug=true)->
    # if debug is true
    #   @__g.debug("#{@__name} __removeInteractivity()")
    for fastClickInstance in @__fastClickInstances
      fastClickInstance.destroy()
    @__fastClickInstances = []
    for buttonInstance in @__buttonInstances
      buttonInstance.removeEventListener("click",@__onButtonClick,false)
    @__buttonInstances = []


  __addInteractivity:()->
    # @__g.debug("#{@__name} __addInteractivity()")
    @__removeInteractivity(false)
    buttons = @__domNode.getElementsByClassName("button")
    for button in buttons
      button.name = button.className.substring(button.className.indexOf("-")+1).split(" ")[0]
      @__buttonInstances.push(button)
      @__fastClickInstances.push(new FastClick(button))
    for buttonInstance in @__buttonInstances
      buttonInstance.addEventListener("click",@__onButtonClick,false)
  #PUBLIC
  #_______________________________________________________________________________________
  getDomNode: ()->
    return @__domNode

  getName:() ->
    return @__name;

  introStart:() ->
    @__g.debug("#{@__name} introStart()")
    @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_IN
    #overide

  screenStart:()->
    #overide
    @__g.debug("#{@__name} screenStart()")

  outroStart:() ->
    @__g.debug("#{@__name} outroStart()")
    @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_OUT
    #clear all animation classes
    $(@__domNode).removeClass("fadeOutEnable")
    $(@__domNode).removeClass("pullOutEnable")
    $(@__domNode).removeClass("slideOutLeftEnable")
    #overide

  screenEnd:()->
    #overide
    @__g.debug("#{@__name} screenEnd()")
    @__removeInteractivity()
    @__domNode.removeEventListener("webkitAnimationStart", @__animationStart, false)
    @__domNode.removeEventListener("webkitAnimationIteration", @__animationIteration, false)
    @__domNode.removeEventListener("webkitAnimationEnd", @__animationEnd, false)
    @__domNode.removeEventListener("webkitTransitionStart", @__animationStart, false )
    @__domNode.removeEventListener("webkitTransitionEnd", @__animationEnd, false )
    #for Firefox
    # @__domNode.removeEventListener("animationstart", @__animationStart, false)
    # @__domNode.removeEventListener("animationiteration", @__animationIteration, false)
    # @__domNode.removeEventListener("animationend", @__animationEnd, false)
    # @__domNode.removeEventListener("transitionstart", @__animationStart, false )
    # @__domNode.removeEventListener("transitionend", @__animationEnd, false )

    try
      hasParent = true
      if @__domNode.parentNode is undefined
        hasParent = false
      @__g.debug "#{@__name} screenEnd() @__domNode.className:#{@__domNode.className} hasParent:#{hasParent}"

      #@__domNode.parentNode.removeChild @__domNode
      parent = $(@__domNode).parent()
      if parent.length isnt 0
        $(@__domNode).remove()
    catch e
      message = "#{@__name} #{e} screenEnd() unable to removeChild domeNode:#{@__domNode}"
      console.warn message
      @__g.debug(message)
    
    @__domNode = null







  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________

masquerade.InteractiveElement.INTRO_START = "introStart"
masquerade.InteractiveElement.INTRO_COMPLETE = "introComplete"
masquerade.InteractiveElement.OUTRO_START = "outroStart"
masquerade.InteractiveElement.OUTRO_COMPLETE = "outroComplete"
masquerade.InteractiveElement.BUTTON_CLICK = "buttonClick"
masquerade.InteractiveElement.NAVIGATE_TO = "navigateTo"

masquerade.InteractiveElement.ANIMATION_MODE_IN = "animationIn"
masquerade.InteractiveElement.ANIMATION_MODE_OUT = "animationOut"
masquerade.InteractiveElement.ANIMATION_MODE_NONE = "animationNone"

