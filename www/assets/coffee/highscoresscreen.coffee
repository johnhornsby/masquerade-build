masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.HighScoresScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    a = @__g.localStorageManager.getHighScores()
    rows = @__domNode.getElementsByTagName("tr")
    i = 0
    for o in a
      rows[i].childNodes[1].innerHTML = Math.round o.score
      rows[i].childNodes[2].innerHTML = o.name
      i++
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
    
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.PURPLE then 100 else 1000
    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout
    @__fadeColorTo(masquerade.ColourManager.PURPLE)

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
