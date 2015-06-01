masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.RoundEndScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    #show who won
    titleImageIndex = 0
    result = @__g.gameManager.getEndRoundResult()

    message = ""
    if result.won
      message += "Well done, you got it right! "
    else 
      message += "Sorry, you got it wrong! "
    message += "<span class='spanBold'>" + result.pretender + "</span> was the Pretender"

    nextButton = @__domNode.getElementsByClassName('button-next')[0]
    nextRoundButton = @__domNode.getElementsByClassName('button-next-round')[0]
    homeButton = @__domNode.getElementsByClassName('button-home')[0]
    reviewButton = @__domNode.getElementsByClassName('button-review')[0]
    
    if @__g.gameManager.isGameOver()
      titleImageIndex = 1
      #nextButton.innerHTML = "Play Again"
      nextRoundButton.innerHTML = "Play Again"
      if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_THREE_ROUNDS
        homeButton.style.display = "none"       #used on game over screen
        nextRoundButton.style.display = "none"  #used on game over screen
        @__sendDataToServer()
      else if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE
        reviewButton.style.display = "none"
        nextButton.style.display = "none"
      else
        nextButton.style.display = "none"
        @__sendDataToServer()
    else
      nextRoundButton.innerHTML = "Next Round"
      nextButton.style.display = "none"
      homeButton.style.display = "none"

    titleImages = @__domNode.getElementsByClassName("title-image")
    #titleImages[titleImageIndex].classList.remove("hide")
    $(titleImages[titleImageIndex]).removeClass("hide")
    @__domNode.getElementsByClassName('text-message')[0].innerHTML = message
    #$(@__domNode).addClass("fade-init")
    


  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next-round"
      if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_SINGLE_ROUND
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_SINGLE_ROUND)
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"who-is-playing",clearHistory:true}))
      else if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE
        @__g.gameManager.newGame(masquerade.GameManager.GAME_OPTION_TRAINING_MODE)
        @__g.gameManager.setPlayerNames("Judge", "Player A", "Player B")
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-characteristic",clearHistory:true}))
      else
        @__g.gameManager.newRound()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-roles",clearHistory:true}))
    if $(button).hasClass "button-next"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"game-over",clearHistory:false}))
    if $(button).hasClass "button-home"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"home",clearHistory:true}))
    if $(button).hasClass "button-review"
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"review",clearHistory:false}))
    @__removeInteractivity()

  __sendDataToServer:()->
    #compile data
    json = @__g.gameManager.getGameDataToSend()
    #try to send it
    @__g.mdGameManager.sendSingleDeviceGameData json


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons([],false)
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