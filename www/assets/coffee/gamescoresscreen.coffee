masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.GameScoresScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    #show who won
    result = @__g.gameManager.getEndRoundResult()
    message = "You are "
    if result.won
      message += "correct!, "
    else 
      message += "wrong!, "
    message += "" + result.pretender + " was the Pretender"
    @__domNode.getElementsByClassName('text-message')[0].innerHTML = message

    nextButton = @__domNode.getElementsByClassName('button-next')[0]
    if @__g.gameManager.isGameOver()
      nextButton.innerHTML = "Play Again"
    else
      nextButton.innerHTML = "Next Round"
    #$(@__domNode).addClass("fade-init")
    

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_THREE_ROUNDS
        @__g.gameManager.newRound()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-characteristic"}))
      else if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_SINGLE_ROUND
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND)
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"who-is-playing"}))
      else
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE)
        @__g.gameManager.setPlayerNames("Judge", "A", "B")
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-characteristic"}))
    if $(button).hasClass "button-home"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"home"}))





  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["help"])
    setTimeout ()=>
      @__cueIntroAnimation()
    ,100

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super