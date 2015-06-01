masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDChooseCharacteristicScreen extends masquerade.MDScreen

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

    # if @__g.useTweenMax
    #   $(@__domNode).css("opacity","0")
    # else
    #   $(@__domNode).addClass("fade-init")

    

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      if(@__validate())
        # @__saveData()
        # @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"ready"}))
        @__removeInteractivity()
        @__g.mdGameManager.confirmCharacteristic(@__characteristic)
      else
        #if not valid ensure animation has been removed
        @__removeAllServerActiveAnimation()
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
    @__g.debug "IN-VALID"
    @__g.rootViewController.alert {message:"You have not chosen a characteristic"}

  # __saveData:()->
  #   @__g.gameManager.setRoundCharacteristic(@__characteristic)







  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super

    targetColour = masquerade.ColourManager.GREEN
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    options = 
      domNode:@__domNode.getElementsByClassName("ui-table-view")[0]
    @__uiListView = new masquerade.UIListView(options)
    @__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, @__onListItemSelect)

    if @__g.showPlaceholderData is true
      @__uiListView.setSelectedIndex(0)
      @__characteristic = @__uiListView.getSelectedText()
    @__textInputs[0].value = ""

    #PATCH for Android 2.2 2.3 swap out svg for canvas render using 
    if @__g.platform is "android" and @__g.osVersion < 4
      $(".ui-table-view").css("margin-top","10px")

    @__g.navigationBar.drawNavigationButtons(["pause"])

    timeout = 100

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
