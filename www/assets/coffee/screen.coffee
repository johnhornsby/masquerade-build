#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.Screen extends masquerade.InteractiveElement

  __helpNode:{}


  constructor: (domNode)->
    @__helpNode = undefined
    super





  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
   super

  __build:() ->
    super

    if @__g.navigationBar
      navigationTitle = @__domNode.getAttribute("data-navigation-title")
      if navigationTitle is undefined
        @__g.navigationBar.setNavigationTitle()
      else
        @__g.navigationBar.setNavigationTitle(navigationTitle)

    helpContent = @__domNode.getElementsByClassName("help-content")
    if helpContent.length > 0
      @__helpNode = helpContent[0]
      parent = @__helpNode.parentNode
      parent.removeChild(@__helpNode)
    if @__g.navigationBar isnt undefined
      @__g.navigationBar.setHelpContentNode(@__helpNode)

    @__setInitStyle()




  __fadeColorTo:(color)->
    @__g.colourManager.fadeColorTo(color)


  __setInitStyle:()->
    #patch for usign TweenMax
    if @__g.useTweenMax
      $(@__domNode).css("opacity","0")
    else
      $(@__domNode).addClass("fade-init")

  __cueIntroAnimation:()->
    #patch for usign TweenMax
    if @__g.useTweenMax
      TweenMax.to(@__domNode, @__g.tweenMaxInTime, {opacity:1, onStart:@__animationStart, onComplete:@__animationEnd})
    else
      $(@__domNode).removeClass("fade-init")
      $(@__domNode).addClass("fade-complete")

  __cueOutroAnimation:()->
    #patch for usign TweenMax
    if @__g.useTweenMax
      TweenMax.to(@__domNode, @__g.tweenMaxOutTime, {opacity:0, onStart:@__animationStart, onComplete:@__animationEnd})
    else
      $(@__domNode).removeClass("fade-complete")
      $(@__domNode).addClass("fade-outro")

  #PUBLIC
  #_______________________________________________________________________________________
  getHelpNode:()->
    return @__helpNode






  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________
  introStart:()->
    super
    body = document.getElementsByTagName("body")[0]
    body.scrollTop = 0

  screenEnd:()->
    super
    @__g.colourManager.stopFadeOnElement(@__domNode)



