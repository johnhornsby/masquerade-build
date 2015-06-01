masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDEnterAnswerScreen extends masquerade.MDScreen

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
  __init: -> #override
    super
    @__bonusInitialSeconds = @__g.gameManager.getScoreDataValue("quickAnswerBonusSeconds")
    @__bonusInitialScore = @__g.gameManager.getScoreDataValue("quickAnswerBonus")
    
  __build: -> #override
    super
    questionIndex = @__g.mdGameManager.getQuestionIndex()
    question = @__g.mdGameManager.getRoundQuestionAnswers()[questionIndex].question

    @__textArea = @__domNode.getElementsByTagName('textarea')[0]
    @__textArea.addEventListener("focus",@__onTextAreaOnFocus,false)
    @__textArea.addEventListener("blur",@__onTextAreaOnBlur,false)
    @__textArea.addEventListener("input",@__onTextAreaOnChange,false)

    role = @__g.mdGameManager.getGUIDRole(@__g.guid)
    switch role
      when "pretender"
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "You are pretending to be " + "<span class='spanBold'>'"+ @__g.mdGameManager.getCharacteristic() + "'</span>"
        @__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (questionIndex+1) + " <span class='spanBold'>" + question + "</span>"
        @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (questionIndex+1))
      when "non-pretender"
        @__domNode.getElementsByTagName('h4')[0].innerHTML = "Answer honestly as " + "<span class='spanBold'>'"+ @__g.mdGameManager.getCharacteristic() + "'</span>"
        @__domNode.getElementsByTagName('h6')[0].innerHTML = "Q" + (questionIndex+1) + " <span class='spanBold'>" + question + "</span>"
        @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (questionIndex+1))
      when "judge"
        @__g.navigationBar.setNavigationTitle("Answering")

    #@__maxChars = parseInt($(@__textArea).attr("maxlength"))
    @__maxChars = @__g.mdGameManager.getTextLimit()
    $(@__textArea).attr("maxlength","#{@__maxChars}")
    @__updateCharCount()

    if @__g.mdGameManager.isSingleRound()
      @__domNode.getElementsByClassName("count-down-wrapper")[0].style.visibility = "hidden"


  __handleButtonEvent:(mouseEvent)-> #override
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        #@__saveData()
        #@dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"ready"}))
        @__bonus = Math.round((@__bonusSeconds / @__bonusInitialSeconds) * @__bonusInitialScore)
        @__removeInteractivity()
        @__g.mdGameManager.enterAnswer(@__textArea.value, @__bonus)
      else
        #if not valid ensure animation has been removed
        @__removeAllServerActiveAnimation()
        @__displayIncompleteFormData()


  __onTextAreaOnFocus:(event) =>
    @__updateCharCount()

  __onTextAreaOnBlur:(event) =>
    @__updateCharCount()

  __onTextAreaOnChange:(event)=>
    @__updateCharCount()

  __validate: ->
    if @__textArea.value is ""
      return false
    return true

  __displayIncompleteFormData:()->
    @__g.debug "IN-VALID"
    @__g.rootViewController.alert {message:"Please enter your answer", label:"validation"}

  # __saveData:()->
  #   @__bonus = Math.round((@__bonusSeconds / @__bonusInitialSeconds) * @__bonusInitialScore)
  #   @__g.gameManager.setPlayerText(@__textArea.value,@__bonus)


  __introComplete: -> #override
    super
    @__intervalID = setInterval(@__secondTick,1000)

  __secondTick: =>
    @__bonusSeconds--
    if @__bonusSeconds is 0
      clearInterval(@__intervalID)
    @__updateTime()

  __updateTime: ->
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

  __updateCharCount: ->
    charsLeft = @__maxChars - @__textArea.value.length
    $('.char-count').html(charsLeft)

  __checkWithGameManager: =>
    super
    console.log "mdenteranswer __checkWithGameManager()"
    #if @__g.mdGameManager.hasJoined() and @__g.mdGameManager.getPhaseIndex() is 0 #show
    if @__g.guid isnt @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)
      if @__g.mdGameManager.hasAnsweredQuestion() #show
        @__showWaitingForServer()
      else #hide
        @__hideWaitingForServer()
    else
      @__showWaitingForServer()
    





  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()-> #override
    super
    switch @__g.mdGameManager.getGUIDRole(@__g.guid)
      when masquerade.MDGameManager.ROLE_PRETENDER
        targetColour = masquerade.ColourManager.YELLOW
      when masquerade.MDGameManager.ROLE_NON_PRETENDER
        targetColour = masquerade.ColourManager.NAVY
      when masquerade.MDGameManager.ROLE_JUDGE
        targetColour = masquerade.ColourManager.BLUE
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    if @__g.guid isnt @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)
      @__bonusSeconds = @__bonusInitialSeconds
      @__updateTime()
      #advise navigation bar
      @__g.navigationBar.drawNavigationButtons(["pause"])
      if @__g.showPlaceholderData is true
        @__textArea.value = "This is my answer"
      questionIndex = @__g.mdGameManager.getQuestionIndex()
      otherPlayer = masquerade.MDGameManager.ROLE_PRETENDER
      if @__g.guid is @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_PRETENDER)
        otherPlayer = masquerade.MDGameManager.ROLE_NON_PRETENDER
      $(".frame-2 h3").html("waiting for the " + otherPlayer + " to answer question " + (questionIndex+1))
    else
      questionIndex = @__g.mdGameManager.getQuestionIndex()
      $(".frame-2 h3").html("players are answering question " + (questionIndex+1))

    @__updateCharCount()

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout


  outroStart:()-> #override
    super
    clearInterval(@__intervalID)

    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()-> #override
    @__hideWaitingCircle()
    super
