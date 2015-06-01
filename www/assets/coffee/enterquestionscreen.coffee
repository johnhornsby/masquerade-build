masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.EnterQuestionScreen extends masquerade.Screen

  __textArea:{}
  __maxChars:-1

  constructor: (domNode)->
    super domNode
    #@__heights = []







  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    @__textArea = @__domNode.getElementsByTagName('textarea')[0]
    @__textArea.addEventListener("focus",@__onTextAreaOnFocus,false)
    @__textArea.addEventListener("blur",@__onTextAreaOnBlur,false)
    @__textArea.addEventListener("input",@__onTextAreaOnChange,false)
    @__domNode.getElementsByTagName('h3')[0].innerHTML += " <span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"

    @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (@__g.gameManager.getQuestionIndex()+1))
    @__maxChars = parseInt($(@__textArea).attr("maxlength"))
    @__updateCharCount()
    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)->
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
    sections = @__domNode.getElementsByTagName("section")
    @__updateCharCount()
    #sections[0].style.opacity = "0";
    #sections[2].style.opacity = "0";


  __onTextAreaOnBlur:(event) =>
    sections = @__domNode.getElementsByTagName("section")
    @__updateCharCount()
    #sections[0].style.opacity = "1";
    #sections[2].style.opacity = "1";
    #document.getElementsByTagName("body")[0].scrollTop = 0

  __onTextAreaOnChange:(event)=>
    @__updateCharCount()

  __validate:()->
    if @__textArea.value is ""
      return false
    return true

  __displayIncompleteFormData:()->
    window.log "IN-VALID"
    @__g.rootViewController.alert {message:"Please enter your question"}

  __saveData:()->
    @__g.gameManager.setPlayerText(@__textArea.value)
    @__g.gameManager.incrementPhaseIndex()

  __updateCharCount:()->
    charsLeft = @__maxChars - @__textArea.value.length
    $('.char-count').html(charsLeft)



  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    @__updateCharCount()
    
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause","help"])
    # sections = @__domNode.getElementsByTagName("section")
    # @__heights = [sections[0].clientHeight + "px",sections[2].clientHeight + "px"]
    # sections[0].style.height = @__heights[0];
    # sections[2].style.height = @__heights[1];
    if @__g.showPlaceholderData is true
      @__textArea.value = "AS A MAN, WHAT IS THE WORST THING ABOUT HAVING TO SHAVE?"

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
