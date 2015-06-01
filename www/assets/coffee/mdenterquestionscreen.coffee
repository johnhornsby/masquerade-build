masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDEnterQuestionScreen extends masquerade.MDScreen

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
    @__domNode.getElementsByTagName('h3')[0].innerHTML += " <span class='spanBold'>'"+ @__g.mdGameManager.getCharacteristic() + "'</span>"
    @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (@__g.mdGameManager.getQuestionIndex()+1))
    @__maxChars = @__g.mdGameManager.getTextLimit()
    $(@__textArea).attr("maxlength","#{@__maxChars}")
    @__updateCharCount()


  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        #@__saveData()
        @__removeInteractivity()
        @__g.mdGameManager.enterQuestion(@__textArea.value)
      else
        #if not valid ensure animation has been removed
        @__removeAllServerActiveAnimation()
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
    @__g.debug "IN-VALID"
    @__g.rootViewController.alert {message:"Please enter your question", label:"validation"}


  # __saveData:()->
  #   @__g.gameManager.setPlayerText(@__textArea.value)
  #   @__g.gameManager.incrementPhaseIndex()

  __updateCharCount:()->
    charsLeft = @__maxChars - @__textArea.value.length
    $('.char-count').html(charsLeft)



  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super

    targetColour = masquerade.ColourManager.RED
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    @__updateCharCount()
    
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause","help"])

    if @__g.showPlaceholderData is true
      @__textArea.value = "AS A MAN, WHAT IS THE WORST THING ABOUT HAVING TO SHAVE?"


    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout



  outroStart:()->
    super
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
