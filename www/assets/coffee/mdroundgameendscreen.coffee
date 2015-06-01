masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDRoundGameEndScreen extends masquerade.MDScreen


  __activeFrame:undefined
  __previousFrame:undefined
  __frames:[]
  __frameAnimationTime:0.25
  __scoreData:undefined

  constructor: (domNode)->
    super domNode
    @__tripToSaveScoresOnExit = false






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    
    @__frames = $("frame")


    #
    # Frame 1
    #____________________________________________
    message = ""
    result = @__g.mdGameManager.getRoundResult()
    role = @__g.mdGameManager.getGUIDRole(@__g.guid)
    judgeName = @__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_JUDGE)
    pretenderName = @__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_PRETENDER)
    nonPretenderName = @__g.mdGameManager.getRoleName(masquerade.MDGameManager.ROLE_NON_PRETENDER)
    switch role
      when masquerade.MDGameManager.ROLE_JUDGE
        if result
          message += "Well done, you got it right!"
        else
          message += "Sorry, you got it wrong!"
        message += " <span class='spanBold'>#{pretenderName}</span> was the pretender"
      when masquerade.MDGameManager.ROLE_PRETENDER
        if result
          message += "Oops, busted! <span class='spanBold'>#{judgeName}</span> the judge correctly identified you!"
        else
          message += "Well done, you fooled <span class='spanBold'>#{judgeName}</span> the judge"
      when masquerade.MDGameManager.ROLE_NON_PRETENDER
        if result
          message += "<span class='spanBold'>#{judgeName}</span> the judge correctly identified <span class='spanBold'>#{pretenderName}</span> the pretender"
        else
          message += "<span class='spanBold'>#{pretenderName}</span> the pretender fooled <span class='spanBold'>#{judgeName}</span> the judge"
    @__domNode.getElementsByClassName('text-message')[0].innerHTML = message
    $frame1 = $(@__domNode).find(".frame-1")
    $gameOverButton = $frame1.find('.button-game-over')
    $nextRoundButton = $frame1.find('.button-next-round')
    $homeButton = $frame1.find('.button-home')
    $reviewButton = $frame1.find('.button-review')
    titleImageIndex = 0

    isComplete = false
    if @__g.mdGameManager.isSingleRound() is false and @__g.mdGameManager.getRoundIndex() is 2
      isComplete = true
    else if @__g.mdGameManager.isSingleRound()
      isComplete = true

    if isComplete
    #Game Over
      titleImageIndex = 1
      $nextRoundButton.html("Play Again")
      if @__g.mdGameManager.isSingleRound()
      #Single Round Game
        $gameOverButton.hide()
      else
      #Three Round Game
        #@__tripToSaveScoresOnExit = true
        $homeButton.hide()       #used on game over screen
        $nextRoundButton.hide()  #used on game over screen
        
    else
    #Round Over
      $nextRoundButton.html("Next Round")
      $gameOverButton.hide()
      $homeButton.hide()
    $frame1.find(".title-image").eq(titleImageIndex).removeClass('hide')

    #
    # Frame 2
    #____________________________________________
    if isComplete and @__g.mdGameManager.isSingleRound() is false
      table = $(@__domNode).find(".frame-2 table")[0]
      @__scoreData = @__g.mdGameManager.getFinalScoreData()
      scoreCells = $(table).find('.cell-score')
      nameCells = $(table).find('.cell-name')
      i = -1 + scoreCells.length
      for scoreCell in scoreCells
        scoreCell.innerHTML = @__scoreData[i].score
        i--
      i = -1 + scoreCells.length
      for nameCell in nameCells
        nameCell.innerHTML = @__scoreData[i].name
        i--

    #
    # Frame 3
    #____________________________________________
    #copy qa node
    templateQaNode = @__domNode.getElementsByClassName('question-and-answer')[0]
    qaNode = {}
    svgNode = {}
    bubbleNode = {}
    rect = {}
    conversationContainer = @__domNode.getElementsByClassName('conversation-container')[0]
    conversationContainer.removeChild(templateQaNode)
    # @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    # @__g.rootViewController.addEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)

    #build for each qa
    l = @__g.mdGameManager.getQuestionIndex() + 1
    questionAnswers = @__g.mdGameManager.getRoundQuestionAnswers()

    i = 0
    while i < l
      qaNode = templateQaNode.cloneNode(true)
      #fill question no
      qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " "+(i+1)
      #fill question content
      qaNode.getElementsByClassName('text-question-content')[0].innerHTML = questionAnswers[i].question
      #fill answer 1
      qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = @__g.mdGameManager.getAnswerAtPositionWithIndex(true, i)
      #fill answer 2
      qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = @__g.mdGameManager.getAnswerAtPositionWithIndex(false, i)

      conversationContainer.appendChild(qaNode)
      i++




  __drawSVG:()->
    svgs = @__domNode.getElementsByTagName('svg')
    bubbleNode = {}
    point = {}
    polygonNode = {}
    pathNode = {}
    canvas = {}
    svgString = ""
    for svg in svgs
      bubbleNode = svg.parentNode
      rect = {x:2,y:2,width:bubbleNode.clientWidth-4,height:bubbleNode.clientHeight-30}
      svg.attributes.width.value = "#{bubbleNode.clientWidth}px"
      svg.attributes.height.value = "#{bubbleNode.clientHeight}px"
      svg.attributes.viewBox.value = "0 0 #{bubbleNode.clientWidth} #{bubbleNode.clientHeight}"
      polygonNode = svg.getElementsByTagName('polygon')[0]
      pathNode = svg.getElementsByTagName('path')[0]
      polygonNode.attributes.points.value = @__getBubblePoints(rect)
      #if bubbleNode.classList.contains("bubble-left")
      if $(bubbleNode).hasClass("bubble-left")
        polygonNode.attributes.transform.value = "translate(#{bubbleNode.clientWidth},0) scale(-1,1)"
        pathNode.attributes.transform.value = "translate(5,#{bubbleNode.clientHeight-30}) scale(0.23)"
      else
        pathNode.attributes.transform.value = "translate(#{bubbleNode.clientWidth-35},#{bubbleNode.clientHeight-30}) scale(0.23)"

      # #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
      # if @__g.platform is "android" and @__g.osVersion < 4
      #   canvas = document.createElement("canvas");
      #   canvas.setAttribute("style", "height:" + "#{bubbleNode.clientHeight}px" + ";width:" + "#{bubbleNode.clientWidth}px" + ";position:absolute;top:0px;left:0px;");
      #   canvas.setAttribute("height","#{bubbleNode.clientHeight}px")
      #   canvas.setAttribute("width","#{bubbleNode.clientWidth}px")

      #   $(svg).after(canvas)
      #   svgString = $(svg.parentNode).html()
      #   svgString = svgString.substring(0,svgString.indexOf("<canvas"))
      #   svgString = svgString.substring(svgString.indexOf("<svg"))

      #   svg.style.display = "none"
      #   canvg(canvas,svgString)

  __getBubblePoints:(r)->
    str =  "" + r.x + "," + r.y + " "
    str += "" + (r.x+r.width) + "," + r.y + " "
    str += "" + (r.x+r.width) + "," + (r.y+r.height-12) + " "
    str += "" + (r.x+r.width-40) + "," + (r.y+r.height-12) + " "
    str += "" + (r.x+r.width-40) + "," + (r.y+r.height) + " "
    str += "" + (r.x+r.width-80) + "," + (r.y+r.height-12) + " "
    str += "" + r.x + "," + (r.y+r.height-12) + " "
    str += "" + r.x + "," + r.y + ""


  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    isComplete = false
    if @__g.mdGameManager.isSingleRound() is false and @__g.mdGameManager.getRoundIndex() is 2
      isComplete = true
    else if @__g.mdGameManager.isSingleRound()
      isComplete = true

    if $(button).hasClass "button-next-round"
      if @__g.mdGameManager.isSingleRound()
        #window.log "TODO play again"
        @__removeInteractivity()
        @__g.mdGameManager.leaveGame()
        @__g.mdGameManager.reset()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"multi-device",clearHistory:true}))
      else
        #if @__g.mdGameManager.getIsComplete()
        if isComplete
          #window.log "TODO play again"
          @__removeInteractivity()
          @__g.mdGameManager.leaveGame()
          @__g.mdGameManager.reset()
          @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"multi-device",clearHistory:true}))
        else
          @__removeInteractivity()
          @__g.mdGameManager.nextRound()
    if $(button).hasClass "button-game-over"
      #window.log "TODO show game over screen"
      @__showFrame2()
    if $(button).hasClass "button-home"
      @__removeInteractivity()
      @__g.mdGameManager.leaveGame()
      @__g.mdGameManager.reset()
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"home",clearHistory:true}))
    if $(button).hasClass "button-review"
      #window.log "TODO show review"
      @__showFrame4()
    if $(button).hasClass "button-close-review"
      @__showFrame1()
    if $(button).hasClass "button-high-scores"
      @__removeInteractivity()
      @__g.mdGameManager.leaveGame()
      @__g.mdGameManager.reset()
      @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"high-scores",clearHistory:true}))

  # __showWaitingForServer:()->
  #   if @__isWaitingForServer is false
  #     @__isWaitingForServer = true

  #     $(".frame-1").hide()
      
  #     $(".frame-2").show()

  #     @__showWaitingCircle()

  # __hideWaitingForServer:()->
  #   if @__isWaitingForServer is true
  #     @__isWaitingForServer = false
  #     @__hideWaitingForServer()
  #     $(".frame-1").show()
  #     $(".frame-2").hide()
  #     @__hideWaitingCircle()
  #   # if @__animationMode = masquerade.InteractiveElement.ANIMATION_MODE_NONE
  #   @__addInteractivity()

  __checkWithGameManager: () =>
    super
    @__g.debug "mdroundgameover __checkWithGameManager()"
    #if @__g.mdGameManager.hasJoined() and @__g.mdGameManager.getPhaseIndex() is 0 #show



    if @__g.mdGameManager.getGUIDIsReadyForNextRound(@__g.guid) #show
      if @__activeFrame isnt $(".frame-3")[0]
        @__showFrame3()




  __showFrame1:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-1").get(0)

    if @__previousFrame is $(".frame-4").get(0)
      TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
      TweenMax.to(@__previousFrame, 0.25, {scaleX:0.8, scaleY:0.8, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
      TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})
    if @__previousFrame is $(".frame-2").get(0)
      TweenMax.set(@__activeFrame, {x:"-500px", opacity:0, display: "block"})
      TweenMax.to(@__previousFrame, 0.25, {x:"500px", opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
      TweenMax.to(@__activeFrame, 0.25, {x:"0px", opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})
    else
      TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
      TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})

    @__isWaitingForServer = false
    @__hideWaitingCircle()
    @__releaseNavigation()
    @__g.navigationBar.drawNavigationButtons(["pause"])


  __showFrame2:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-2").get(0)

    TweenMax.set(@__activeFrame, {x:"500px", opacity:0, display: "block"})
    TweenMax.to(@__previousFrame, 0.25, {x:"-500px", opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    TweenMax.to(@__activeFrame, 0.25, {x:"0px", opacity:1, force3D:true, delay:0.1, ease:Sine.easeOut})

    @__hideWaitingCircle()
    @__hijackNavigation()
    @__g.navigationBar.drawNavigationButtons(["back"])


  __showFrame3:()->
    @__killTweenMax()
    # $(".frame-1").hide()
    # $(".frame-2").hide()
    # $(".frame-3").show()
    # $(".frame-4").hide()
    #@__isWaitingForServer = false

    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-3").get(0)

    TweenMax.set(@__activeFrame, {scaleX:1.3, scaleY:1.3, opacity:0, display: "block"})
    TweenMax.to(@__previousFrame, 0.25, {scaleX:0.8, scaleY:0.8, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, delay:0.1, force3D:true, ease:Sine.easeOut})

    @__showWaitingCircle()
    @__releaseNavigation()
    @__g.navigationBar.drawNavigationButtons(["back"])


  __showFrame4:()->
    @__killTweenMax()
    @__previousFrame = @__activeFrame
    @__activeFrame = $(".frame-4").get(0)

    TweenMax.set(@__activeFrame, {scaleX:0.8, scaleY:0.8, opacity:0, display: "block"})
    TweenMax.to(@__previousFrame, 0.25, {scaleX:1.3, scaleY:1.3, opacity:0, force3D:true, onComplete: @__hidePreviousFrame, ease:Sine.easeIn})
    TweenMax.to(@__activeFrame, 0.25, {scaleX:1, scaleY:1, opacity:1, delay:0.1, force3D:true, ease:Sine.easeOut})
    
    @__hideWaitingCircle()
    @__hijackNavigation()
    @__g.navigationBar.drawNavigationButtons(["back"])

  __hidePreviousFrame:()=>
    $(@__previousFrame).hide()
    @__previousFrame = undefined

  __initialiseFrame:()->  #override
    # at the time Zepto calculated width with padding, Jquery doesn't
    # paddingLeftInt = parseInt($(@__domNode).css("padding-left").replace(/[^-\d\.]/g, ''))
    paddingTopString = $(@__domNode).css("padding-top")
    # width = $(@__domNode).width() - (paddingLeftInt * 2)
    width = $(@__domNode).width()

    style =
      x: "0px"
      scaleX:1
      scaleY:1
      opacity:0
      display:"none"
      position:"absolute"
      top:paddingTopString
      width:width+"px"

    TweenMax.set($(".frame-1")[0], style)
    TweenMax.set($(".frame-2")[0], style)
    TweenMax.set($(".frame-3")[0], style)
    TweenMax.set($(".frame-4")[0], style)

    #TweenMax.set(@__activeFrame, {transformOrigin:"center center -400px", x:"0px", scaleX:1.3, scaleY:1.3, opacity:0, display:"block", position:"absolute", top:paddingTopString, width:width+"px"})

    @__showFrame1()

  __killTweenMax:()->
    $(".frame").each ()->
      TweenMax.killTweensOf this

  __onBackClick:()=>
    @__showFrame1()
    
  __hijackNavigation:()->
    @__g.rootViewController.setListenToNavigationEvents(false)
    @__g.navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)

  __releaseNavigation:()->
    @__g.rootViewController.setListenToNavigationEvents(true)
    @__g.navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, @__onBackClick)

  __checkToSaveScores:()->
    if @__scoreData
      @__g.localStorageManager.addHighScores(@__scoreData)

#TODO 
# ways of exiting screen

# play again
# scoreboard
# mainmenu
# pause



  #PUBLIC
  #_______________________________________________________________________________________

    

  introStart:()->
    #ensure __drawSVG is done before __initialiseFrame is called form super
    targetColour = masquerade.ColourManager.RED
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    @__drawSVG()
    super
  
    setTimeout ()=>
      @__cueIntroAnimation()
    ,100

  outroStart:()->
    super
    @__checkToSaveScores()
    #release navigation events
    #moved to MDScreen
    #@__killTweenMax()

    @__releaseNavigation()
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
    

