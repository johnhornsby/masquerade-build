masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ReadyScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    phaseIndex = @__g.gameManager.getPhaseIndex()
    @__domNode.getElementsByTagName('h2')[0].innerHTML += @__g.gameManager.getCurrentPlayerName()
    switch phaseIndex
      when 0
        @__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to enter your question?"
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "The characteristic is " + "<span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
      when 1
        @__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to enter your answer?"
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
      when 2
        @__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to answer your question?"
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "YOU MUST ANSWER HONESTLY AS " + "<span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
      when 3
        @__domNode.getElementsByTagName('h3')[0].innerHTML = "Are you ready to judge?"

    titleImageIndex = if phaseIndex is 3 then 0 else phaseIndex
    #@__domNode.getElementsByClassName("title-image")[titleImageIndex].classList.remove("hide")
    $(@__domNode.getElementsByClassName("title-image")[titleImageIndex]).removeClass("hide")
    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      #window.log "where to next"
      if @__g.gameManager.getPhaseIndex() is 0
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"enter-question"}))
      else if @__g.gameManager.getPhaseIndex() < 3
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"enter-answer"}))
      else
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"reveal"}))
    @__removeInteractivity()



  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause"],false)

    phaseIndex = @__g.gameManager.getPhaseIndex()
    switch phaseIndex
      when 1
        @__fadeColorTo(masquerade.ColourManager.YELLOW)
      when 2
        @__fadeColorTo(masquerade.ColourManager.NAVY)
      else
        @__fadeColorTo(masquerade.ColourManager.RED)

    #document.getElementsByTagName('body')[0].classList.add("greenToRedEnable")
    #@__domNode.classList.add("fadeInEnable")
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