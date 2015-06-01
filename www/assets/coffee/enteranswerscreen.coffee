masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.EnterAnswerScreen extends masquerade.Screen

  __textArea:{}
  __bonus:0
  __intervalID:0
  __bonusSeconds:0
  __bonusInitialSeconds:0
  __bonusInitialScore:0
  __bonus:0
  __maxChars:-1

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() -> #override
    super
    @__bonusInitialSeconds = @__g.gameManager.getScoreDataValue("quickAnswerBonusSeconds")
    @__bonusInitialScore = @__g.gameManager.getScoreDataValue("quickAnswerBonus")
    
  __build:() -> #override
    super
    @__textArea = @__domNode.getElementsByTagName('textarea')[0]
    @__textArea.addEventListener("focus",@__onTextAreaOnFocus,false)
    @__textArea.addEventListener("blur",@__onTextAreaOnBlur,false)
    @__textArea.addEventListener("input",@__onTextAreaOnChange,false)

    phaseIndex = @__g.gameManager.getPhaseIndex()
    switch phaseIndex
      when 1
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
      when 2
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "Answer honestly as " + "<span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"

    @__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (@__g.gameManager.getQuestionIndex()+1) + " <span class='spanBold'>" + @__g.gameManager.getCurrentQuestion() + "</span>"


    @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (@__g.gameManager.getQuestionIndex()+1))

    @__maxChars = parseInt($(@__textArea).attr("maxlength"))
    @__updateCharCount()

    if @__g.gameManager.getMode() isnt masquerade.GameManager.GAME_OPTION_THREE_ROUNDS
      @__domNode.getElementsByClassName("count-down-wrapper")[0].style.visibility = "hidden"

    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)-> #override
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        @__saveData()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"ready"}))
        @__removeInteractivity()
      else
        @__displayIncompleteFormData()


  __onTextAreaOnFocus:(event) =>
    @__updateCharCount()

  __onTextAreaOnBlur:(event) =>
    @__updateCharCount()

  __onTextAreaOnChange:(event)=>
    @__updateCharCount()

  __validate:()->
    if @__textArea.value is ""
      return false
    return true

  __displayIncompleteFormData:()->
    window.log "IN-VALID"
    @__g.rootViewController.alert {message:"Please enter your answer"}

  __saveData:()->
    @__bonus = Math.round((@__bonusSeconds / @__bonusInitialSeconds) * @__bonusInitialScore)
    @__g.gameManager.setPlayerText(@__textArea.value,@__bonus)
    @__g.gameManager.incrementPhaseIndex()

  __introComplete:()-> #override
    super
    @__intervalID = setInterval(@__secondTick,1000)

  __secondTick:()=>
    @__bonusSeconds--
    if @__bonusSeconds is 0
      clearInterval(@__intervalID)
    @__updateTime()

  __updateTime:()->
    @__domNode.getElementsByClassName("count-down-timer")[0].innerHTML = @__formatSecondsToTime(@__bonusSeconds)
    degrees = 360 - ((@__bonusSeconds / @__bonusInitialSeconds) * 360)
    @__domNode.getElementsByClassName("svg-clock-hand")[0].attributes.transform.value = "rotate(#{degrees},65,65)"

  __formatSecondsToTime:(seconds)->
      d = new Date(0)
      d.setSeconds(seconds)
      s = String(d.getSeconds())
      if s.length is 1
        s = "0" + s
      m = String(d.getMinutes())
      if m.length is 1
        m = "0" + m
      return m + ":" + s

  __updateCharCount:()->
    charsLeft = @__maxChars - @__textArea.value.length
    $('.char-count').html(charsLeft)


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()-> #override
    super
    @__bonusSeconds = @__bonusInitialSeconds
    @__updateTime()
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause","help"])
    if @__g.showPlaceholderData is true
      @__textArea.value = "This is my answer"

    #@__domNode.classList.add("fadeInEnable")
    setTimeout ()=>
      @__cueIntroAnimation()
    ,100


  outroStart:()-> #override
    super
    clearInterval(@__intervalID)
    #@__domNode.classList.add("fadeOutEnable")
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()-> #override
    super
