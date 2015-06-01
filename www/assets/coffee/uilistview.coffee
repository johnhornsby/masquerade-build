#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.UIListView extends display.EventDispatcher

  __g:masquerade.Globals
  __inputElement:{}
  __tableViewElement:{}
  __scrollPanelViewController:{}
  __domNode:{}
  __tableViewItemInstances:[]
  __fastClickInstances:[]
  __selectedIndex:-1


  constructor: (options)->
    super
    @__domNode = options.domNode
    @__init()









  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    @__build()
    
  __build:() ->

    options =
      frameElement:@__domNode
      contentElement:@__domNode.getElementsByClassName("ui-table-view-content")[0]
      horizontalThumbFrame:@__domNode.getElementsByClassName("thumb-horizontal-frame")[0]
      horizontalThumb:@__domNode.getElementsByClassName("thumb-horizontal")[0]
      verticleThumbFrame:@__domNode.getElementsByClassName("thumb-verticle-frame")[0]
      verticleThumb:@__domNode.getElementsByClassName("thumb-verticle")[0]

      scrollDirection:ScrollPanelController.SCROLL_DIRECTION_VERTICLE
    @__scrollPanelViewController = new ScrollPanelViewController(options)

    @__tableViewItemInstances = []
    tableViewItems = @__domNode.querySelectorAll(".ui-table-view-item a")
    index = 0
    for tableViewItem in tableViewItems
      @__tableViewItemInstances.push(tableViewItem)
      @__fastClickInstances.push(new FastClick(tableViewItem))
      tableViewItem.addEventListener("click",@__onTableViewItemClick,false)
      #if tableViewItem.classList.contains("selected")
      if $(tableViewItem).hasClass("selected")
        @__selectedIndex = index
      index++
    @updateColour()


  __onTableViewItemClick:(mouseEvent)=>
    selectedTableViewItem = mouseEvent.currentTarget
    index = @__tableViewItemInstances.indexOf(selectedTableViewItem)
    @__setSelectedIndex(index)
    @dispatchEvent(new events.Event(masquerade.UIListView.LIST_VIEW_ITEM_CLICK,{text:@getSelectedText(), index:index, currentTarget:this}))

  __setSelectedIndex:(index)->
    @__selectedIndex = index
    selectedTableViewItem = if (@__selectedIndex > -1 && @__selectedIndex < @__tableViewItemInstances.length) then @__tableViewItemInstances[index] else undefined
    for tableViewItem in @__tableViewItemInstances
      if selectedTableViewItem is tableViewItem
        $(tableViewItem).addClass("selected")
       # tableViewItem.classList.add("color-background-floodable")
        #tableViewItem.classList.remove("color-color-floodable")
          
        tableViewItem.style.backgroundColor = @__g.colourManager.getCurrentColour()
        tableViewItem.style.color = @__g.colourManager.getInvertBaseColour()
      else
        $(tableViewItem).removeClass("selected")
        #tableViewItem.classList.remove("color-background-floodable")
        #tableViewItem.classList.add("color-color-floodable")
        tableViewItem.style.backgroundColor = @__g.colourManager.getInvertBaseColour()
        tableViewItem.style.color = @__g.colourManager.getCurrentColour()




  #PUBLIC
  #_______________________________________________________________________________________
  updateColour:()->
    for tableViewItem in @__tableViewItemInstances
      if $(tableViewItem).hasClass("selected")
        #tableViewItem.classList.add("color-background-floodable")
        #tableViewItem.classList.remove("color-color-floodable")
        tableViewItem.style.backgroundColor = @__g.colourManager.getCurrentColour()
        tableViewItem.style.color = @__g.colourManager.getInvertBaseColour()
      else
        #tableViewItem.classList.remove("color-background-floodable")
        #tableViewItem.classList.add("color-color-floodable")
        tableViewItem.style.backgroundColor = @__g.colourManager.getInvertBaseColour()
        tableViewItem.style.color = @__g.colourManager.getCurrentColour()


  setStyle:(object)->
    for s of object
      @__domNode.style[s] = object[s]
    #Cue scrollPanelViewController to update frame and content dimensions
    


  getSelectedIndex:()->
    return @__selectedIndex

  setSelectedIndex:(index=-1)->
    @__setSelectedIndex(index)

  getLength:()->
    return @__tableViewItemInstances.length

  getSelectedText:()->
    if @__selectedIndex > -1
      return $(@__tableViewItemInstances[@__selectedIndex]).text()
    else 
      return ""

  getDomNode:()->
    return @__domNode

  updateFrameDimensions: ()->
    @__scrollPanelViewController.updateFrameDimensions()





masquerade.UIListView.LIST_VIEW_ITEM_CLICK = "listViewItemClick"
