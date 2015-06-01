masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ChooseQuestionsScreen extends masquerade.Screen

  __question:""
  __questionIndex:-1
  __select:{}

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    #@__select = @__domNode.getElementsByTagName('select')[0]
    #@__select.addEventListener("change",@__onSelectChange,false)
    #@__g.translationManager.translateDomNode(@__domNode)
    str = " <span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
    @__g.translationManager.replaceTag(@__domNode, "{CHARACTERISTIC}", str)

    #@__domNode.getElementsByTagName('h4')[0].innerHTML += " <span class='spanBold'>'"+ @__g.gameManager.getRoundCharacteristic() + "'</span>"
    @__g.navigationBar.setNavigationTitle(@__domNode.getAttribute("data-navigation-title") + " " + (@__g.gameManager.getQuestionIndex()+1))
    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        @__saveData()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"reveal"}))
        @__removeInteractivity()
      else
        @__displayIncompleteFormData()

  __onListItemSelect:(event)=>
    #@__textInputs[0].value = ""
    @__question = event.data.text
    @__questionIndex = event.data.index

  __validate:()->
    if @__question is ""
      return false
    return true

  __displayIncompleteFormData:()->
    window.log "IN-VALID"
    @__g.rootViewController.alert {message:"You have not chosen a question"}

  __saveData:()->
    questionData = @__g.gameManager.getTrainingQuestionWithIndex(@__questionIndex)
    @__g.gameManager.setPlayerText(@__question)
    @__g.gameManager.incrementPhaseIndex()
    @__g.gameManager.setPlayerText(questionData.p)
    @__g.gameManager.incrementPhaseIndex()
    @__g.gameManager.setPlayerText(questionData.np)
    @__g.gameManager.incrementPhaseIndex()







  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    #we can't go back to reveal once we have started asking questions
    if @__g.gameManager.getQuestionIndex() > 0
      @__g.navigationBar.drawNavigationButtons(["pause"])
    else
      @__g.navigationBar.drawNavigationButtons(["back"])

    #@__question = @__select.options[@__select.selectedIndex].value

    dropdownContentString = ''
    for questionData in @__g.gameManager.getTrainingQuestions()
      selectedClass = ""
      dropdownContentString += "<li class='ui-table-view-item'><a href='#'#{selectedClass}>#{questionData.j}</a></li>"
    $(".ui-table-view-content").eq(0).append(dropdownContentString)

    options = 
      domNode:@__domNode.getElementsByClassName("ui-table-view")[0]
    @__uiListView = new masquerade.UIListView(options)
    @__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK,@__onListItemSelect)



    setTimeout ()=>
      @__cueIntroAnimation()
    ,100

    #if @__g.showPlaceholderData is true
      #@__select.selectedIndex = 1

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super
