masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.GameOverScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    #show who won
    #draw the scrore table
    table = @__domNode.getElementsByTagName('table')[0]

    scoreData = @__g.gameManager.getFinalScoreData()
    scoreCells = @__domNode.getElementsByClassName('cell-score')
    nameCells = @__domNode.getElementsByClassName('cell-name')
    i = -1 + scoreCells.length 
    for scoreCell in scoreCells
      scoreCell.innerHTML = scoreData[i].score
      i--
    i = -1 + scoreCells.length
    for nameCell in nameCells
      nameCell.innerHTML = scoreData[i].name
      i--
    #$(@__domNode).addClass("fade-init")


  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-home"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"home",clearHistory:true}))
    if $(button).hasClass "button-high-scores"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"high-scores",clearHistory:true}))
    @__removeInteractivity()



  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons([],false)
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