masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ReviewScreen extends masquerade.Screen

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    #$(@__domNode).addClass("fade-init")

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
    l = @__g.gameManager.getQuestionIndex() + 1
    i=0
    while i<l
      qaNode = templateQaNode.cloneNode(true)
      #fill question no
      qaNode.getElementsByClassName('text-question-number')[0].innerHTML += " "+(i+1)
      #fill question content
      qaNode.getElementsByClassName('text-question-content')[0].innerHTML = (@__g.gameManager.getQuestionAtIndex(i))
      #fill answer 1
      qaNode.getElementsByClassName('text-answer-a')[0].innerHTML = (@__g.gameManager.getAnswerAAtIndex(i))
      #fill answer 2
      qaNode.getElementsByClassName('text-answer-b')[0].innerHTML = (@__g.gameManager.getAnswerBAtIndex(i))

      conversationContainer.appendChild(qaNode)
      i++

    @__g.navigationBar.setNavigationTitle("Review Dialog")
    

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

  __onScrollToBottomComplete:()=>

  __onScrollToBottomUpdate:()=>

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
  introStart:()->
    super
    @__drawSVG()
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])

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
