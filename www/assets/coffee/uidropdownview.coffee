#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.UIDropdownView extends display.EventDispatcher


  __inputElement:{}
  __listView:{}


  __domNode:{}
  __fastClickInstances:[]
  __selectedIndex:-1
  __isOpen:false


  constructor: (options)->
    super
    @__domNode = options.domNode
    @__init()









  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    @__build()
    
  __build:() ->

    @__inputElement = @__domNode.getElementsByClassName("ui-dropdown-input")[0]
    @__inputElement.addEventListener("click",@__onInputClick)

    options =
      domNode:@__domNode.getElementsByClassName("ui-dropdown-select")[0]
    #because the uilistview position is absolute we must set the width with JS to get it to fill the relative container
    options.domNode.style.width = @__inputElement.clientWidth+"px";
    @__listView = new masquerade.UIListView(options)
    @__listView.addEventListener(masquerade.UIListView.LIST_VIEW_ITEM_CLICK,@__onListViewItemClick)
    @__close()

  __onListViewItemClick:(event) =>
    @__close()
    @dispatchEvent(new events.Event(masquerade.UIDropdownView.CHANGE,{text:@getSelectedText(),index:@getSelectedIndex(),currentTarget:this}))

  __onInputClick:(event)=>
    @__open()

  __close:()->
    @__isOpen = false
    @__inputElement.getElementsByTagName('input')[0].value = @__listView.getSelectedText()
    @__listView.setStyle({"display":"none"})
    @__listView.setStyle({"z-index":"auto"})

  __open:()->
    @__isOpen = true
    @__listView.setStyle({"display":"block"})
    @__listView.setStyle({"z-index":"999"})
    @__listView.updateFrameDimensions()
    @dispatchEvent(new events.Event(masquerade.UIDropdownView.OPEN,{currentTarget:this}))
  #PUBLIC
  #_______________________________________________________________________________________

  close:()->
    @__close()

  isOpen:()->
    return  @__isOpen

  getSelectedIndex:()->
    return @__listView.getSelectedIndex()

  setSelectedIndex:(index)->
    @__listView.setSelectedIndex(index)
    @__inputElement.getElementsByTagName('input')[0].value = @getSelectedText()

  getLength:()->
    return @__listView.getLength()

  getSelectedText:()->
    return @__listView.getSelectedText()

  getDomNode:()->
    return @__domNode





masquerade.UIDropdownView.CHANGE = "change"
masquerade.UIDropdownView.OPEN = "open"
masquerade.UIDropdownView.CLOSE = "close"
