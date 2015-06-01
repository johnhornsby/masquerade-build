masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDRevealScreen extends masquerade.MDScreen

  __guessChar:""
  __playerSplitGroup:{}
  __confirmSplitGroup:{}
  __guessFlipContainer:{}
  __isButtonGuessOpen:false


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super

    #copy qa node
    templateQaNode = @__domNode.getElementsByClassName('question-and-answer')[0]
    qaNode = {}
    svgNode = {}
    bubbleNode = {}
    rect = {}
    conversationContainer = @__domNode.getElementsByClassName('conversation-container')[0]
    conversationContainer.removeChild(templateQaNode)


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
    #set colour of left bubble A
    $(@__domNode).find(".bubble-left text").attr("fill", masquerade.ColourManager.RED);
    $(@__domNode).find(".text-answer-a").css("color", masquerade.ColourManager.RED);

    @__playerSplitGroup = @__domNode.getElementsByClassName("button-split-group")[0]
    #@__playerSplitGroup.style.visibility = "hidden"

    @__confirmSplitGroup = @__domNode.getElementsByClassName("button-split-group")[1]
    @__confirmSplitGroup.style.visibility = "hidden"
    @__guessFlipContainer = @__domNode.getElementsByClassName("flip-container")[0]

    @__g.navigationBar.setNavigationTitle(@__g.mdGameManager.getCharacteristic())

    if @__g.platform is "android" and @__g.osVersion < 4
      @__playerSplitGroup.style.visibility = "hidden"





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

      #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
      if @__g.platform is "android" and @__g.osVersion < 4
        canvas = document.createElement("canvas");
        canvas.setAttribute("style", "height:" + "#{bubbleNode.clientHeight}px" + ";width:" + "#{bubbleNode.clientWidth}px" + ";position:absolute;top:0px;left:0px;");
        canvas.setAttribute("height","#{bubbleNode.clientHeight}px")
        canvas.setAttribute("width","#{bubbleNode.clientWidth}px")

        $(svg).after(canvas)
        svgString = $(svg.parentNode).html()
        svgString = svgString.substring(0,svgString.indexOf("<canvas"))
        svgString = svgString.substring(svgString.indexOf("<svg"))

        svg.style.display = "none"
        canvg(canvas,svgString)



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
    if $(button).hasClass "button-next-question"
      @__removeInteractivity()
      @__g.mdGameManager.askAnotherQuestion()
      #TODO NEXT QUESTION

    if $(button).hasClass "button-guess"
      #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
      if @__g.platform is "android" and @__g.osVersion < 4
        @__playerSplitGroup.style.visibility = "visible"
        button.style.visibility = "hidden"
        setTimeout ()=>
          @__isButtonGuessOpen = true
        ,500
      else
        @__guessFlipContainer.style.webkitTransform = "rotate3d(1, 0, 0, 180deg)"
        setTimeout ()=>
          @__isButtonGuessOpen = true
        ,500
      
    if $(button).hasClass "button-guess-a"
      return if @__isButtonGuessOpen is false 
      @__guessChar = "a"
      #button.classList.add("selected");
      $(button).addClass("selected")
      #@__getButtonWithName("guess-b").classList.remove("selected")
      $(@__getButtonWithName("guess-b")).removeClass("selected")
      setTimeout ()=>
        @__g.rootViewController.alert {message:"Are you sure?",ok:"Yes",cancel:"No", label:"makeAGuess"}
      ,33
      
    if $(button).hasClass "button-guess-b"
      return if @__isButtonGuessOpen is false
      @__guessChar = "b"
      #button.classList.add("selected");
      $(button).addClass("selected")
      #@__getButtonWithName("guess-a").classList.remove("selected")
      $(@__getButtonWithName("guess-a")).removeClass("selected")
      setTimeout ()=>
        @__g.rootViewController.alert {message:"Are you sure?",ok:"Yes",cancel:"No", label:"makeAGuess"}
      ,33


  __onAlertOkClick:(e)=>
    #ensure alert ok click has been from a make a guess click, it could be a quit game alert
    if e.data.label is "makeAGuess"
      @__removeInteractivity()
      @__g.mdGameManager.makeAGuess(@__guessChar is "a")

  __onAlertCancelClick:(e)=>
    $(@__getButtonWithName("guess-a")).removeClass("selected")
    $(@__getButtonWithName("guess-b")).removeClass("selected")

  __onScrollToBottomComplete:()=>

  __onScrollToBottomUpdate:()=>
    #body = document.getElementsByTagName("body")[0]
    #window.log "body scrollHeight:#{body.scrollHeight} scrollTop:#{body.scrollTop}"

  __introComplete:()->
    super
    #parseInt(document.defaultView.getComputedStyle($("body")[0], '').getPropertyValue('padding-top'));
    body = document.getElementsByTagName("body")[0]
    if window.innerHeight < @__domNode.scrollHeight
      scrollTop = (@__domNode.scrollHeight + @__g.statusBarOffset) - window.innerHeight
      setTimeout ()=>
        Animator.addTween(body,{scrollTop:scrollTop,time:1,onComplete:@__onScrollToBottomComplete,onUpdate:@__onScrollToBottomUpdate,transition:"easeOutExpo"})
      ,100

  #PUBLIC
  #_______________________________________________________________________________________
  screenStart:()->
    super
    @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    @__g.rootViewController.addEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)

  introStart:()->
    super
    targetColour = masquerade.ColourManager.RED
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    @__drawSVG()

    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause"])

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout



  outroStart:()->
    super
    body = document.getElementsByTagName("body")[0]
    Animator.removeTween(body)

    @__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    @__g.rootViewController.removeEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)

    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
    
