masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ChooseCharacteristicScreen extends masquerade.Screen

  __textInputs:[]
  __characteristic:""
  __select:{}
  __tableViewItemInstances:[]
  __uiListView:undefined

  constructor: (domNode)->
    super domNode
    @__tableViewItemInstances = []







  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    @__textInputs = []
    textInputs = @__domNode.getElementsByTagName('input')
    for textInput in textInputs
      textInput.addEventListener("blur",@__onTextFieldOnBlur,false)
      textInput.addEventListener("focus",@__onTextFieldOnFocus,false)
      @__textInputs.push(textInput)
    if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE
      @__domNode.getElementsByTagName('section')[1].style.display = "none"
    #$(@__domNode).addClass("fade-init")

    

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        @__saveData()
        if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE
          @__g.gameManager.setPlayerRoles("judge","pretender","non-pretender")
          @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-questions"}))
        else 
          @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"ready"}))
        @__removeInteractivity()
      else
        @__displayIncompleteFormData()

  __onTextFieldOnFocus:(event)=>
    @__uiListView.setSelectedIndex(-1)

  __onTextFieldOnBlur:(event) =>
    textInput = @__textInputs[0]
    if textInput.value isnt ""
      @__uiListView.setSelectedIndex(-1)
    @__characteristic = textInput.value

  __onListItemSelect:(event)=>
    @__textInputs[0].value = ""
    @__characteristic = event.data.text

  __validate:()->
    if @__characteristic is ""
      return false
    return true

  __displayIncompleteFormData:()->
    window.log "IN-VALID"
    @__g.rootViewController.alert {message:"You have not chosen a characteristic"}

  __saveData:()->
    @__g.gameManager.setRoundCharacteristic(@__characteristic)







  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super

    #@__fadeColorTo("#445566")

    if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE
      $(".ui-table-view-content").empty()
      dropdownContentString = ''
      for characteristicData in @__g.gameManager.getTrainingCharacteristics()
        selectedClass = ""
        dropdownContentString += "<li class='ui-table-view-item'><a href='#'#{selectedClass}>#{characteristicData.characteristic}</a></li>"
      $(".ui-table-view-content").eq(0).append(dropdownContentString)

    options = 
      domNode:@__domNode.getElementsByClassName("ui-table-view")[0]
    @__uiListView = new masquerade.UIListView(options)
    @__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK,@__onListItemSelect)

    if @__g.showPlaceholderData is true
      @__uiListView.setSelectedIndex(0)
      @__characteristic = @__uiListView.getSelectedText()
    @__textInputs[0].value = ""

    #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
    if @__g.platform is "android" and @__g.osVersion < 4
      $(".ui-table-view").css("margin-top","10px")

    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    #if @__g.gameManager.getRoundIndex() > 0
    @__g.navigationBar.drawNavigationButtons(["pause"])
    #else
      #@__g.navigationBar.drawNavigationButtons(["back","help"])
    timeout = 100
    if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_TRAINING_MODE  
      @__fadeColorTo(masquerade.ColourManager.RED)
      @__uiListView.updateColour()
      timeout = 1000

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  outroStart:()->
    super
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0
    #@__domNode.classList.add("fadeOutEnable")

  screenEnd:()->
    super
