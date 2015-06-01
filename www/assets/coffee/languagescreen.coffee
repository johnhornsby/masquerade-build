masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.LanguageScreen extends masquerade.Screen

  __uiListView:{}


  constructor: (domNode)->
    super domNode







  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super

  __build:() ->
    super
    #$(@__domNode).addClass("fade-init")

  __onListItemSelect:(event) =>
    dropdownView = event.data.currentTarget
    index = event.data.index
    dataValue = $(dropdownView.getDomNode()).find("a").eq(index).attr("data-value")
    @__g.localStorageManager.setLanguage(parseInt(dataValue,10))
    @__g.translationManager.updateLanguage()

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-confirm"
      @__g.navigationBar.goBack()
    # if $(button).hasClass "button-character-short"
    #   @__toggleCharacterLimitButtons(150)
    # if $(button).hasClass "button-character-long"
    #   @__toggleCharacterLimitButtons(400)
    # if $(button).hasClass "button-reset-scores"
    #   setTimeout ()=>
    #     @__g.rootViewController.alert {message:"Are you sure?",ok:"Yes",cancel:"No"}
    #   ,33
    # if $(button).hasClass "button-language"
    #   @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"language"}))
    # if $(button).hasClass "button-profile"
    #   @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"profile"}))

    # @__removeInteractivity()

  


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.RED then 100 else 1000

    @__fadeColorTo(masquerade.ColourManager.RED)

    localStorageValue = undefined
    itemValue = undefined

    for tableView in @__domNode.getElementsByClassName("ui-table-view")
      for listItem in tableView.getElementsByTagName("a")
        localStorageValue = parseInt(@__g.localStorageManager.getLanguage())
        itemValue = parseInt($(listItem).attr("data-value"))
        if itemValue is localStorageValue
          $(listItem).addClass("selected")


    options = 
      domNode:@__domNode.getElementsByClassName("ui-table-view")[0]
    @__uiListView = new masquerade.UIListView(options)
    @__uiListView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK, @__onListItemSelect)
    #this corrects the height inaccuracey, because @__listView.updateFrameDimensions() takes into account the border of the frame
    @__uiListView.updateFrameDimensions()

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super

