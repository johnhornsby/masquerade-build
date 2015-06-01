masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.HowToPlayScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    #$(@__domNode).addClass("fade-init")






  #PUBLIC
  #_______________________________________________________________________________________
  screenStart:()->
    super
   #window.log("screenStart() #{@__name}")

  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    @__g.navigationBar.drawNavigationButtons(["back"],false)
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.RED then 100 else 1000
    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout
    @__fadeColorTo(masquerade.ColourManager.RED)


  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
