masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ChooseRolesScreen extends masquerade.Screen

  __uiDropdownViews:[]

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      @__closeAll() #this may invalidate leavig this screen
      if(@__validate())
        @__saveData()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-characteristic"}))
        @__removeInteractivity()
      else
        @__displayIncompleteFormData()

  __dropdownChange:(event) =>
    dropdownView = event.data.currentTarget
    value = dropdownView.getSelectedText()
    options = ["judge","pretender","non-pretender"]
    narrowDownOptions = ["judge","pretender","non-pretender"]

    if value isnt ""
      swapIndex = -1
      index = 0
      compareSelectedText = ""
      compareIndex = -1
      for d in @__uiDropdownViews
        compareSelectedText = d.getSelectedText()
        compareIndex = narrowDownOptions.indexOf(compareSelectedText)
        if compareIndex isnt -1
          narrowDownOptions.splice(compareIndex,1)
        if d isnt dropdownView
          if value is d.getSelectedText()
            #d.setSelectedIndex(-1)
            swapIndex = index
        index++
      if(swapIndex isnt -1)
        @__uiDropdownViews[swapIndex].setSelectedIndex(options.indexOf(narrowDownOptions.pop()))
            #s.selectedIndex = 0

  __dropdownOpen:(event) =>
    dropdownView = event.data.currentTarget
    for d in @__uiDropdownViews
      if d isnt dropdownView && d.isOpen() is true
        d.close()

  __closeAll:() ->
    for d in @__uiDropdownViews
      if d.isOpen() is true
        d.close()

  __validate:()->
    # for d in @__uiDropdownViews
    #   if d.getSelectedText() is ""
    for d in @__domNode.getElementsByTagName("input")
      if d.value is ""
        return false
    return true

  __displayIncompleteFormData:()->
    window.log "IN-VALID"
    @__g.rootViewController.alert {message:"You have not defined each player role"}

  __saveData:()->
    roles = []
    # for d in @__uiDropdownViews
    #   roles.push d.getSelectedText().toLowerCase()
    for input in @__domNode.getElementsByTagName("input")
      roles.push(input.value.toLowerCase())
    @__g.gameManager.setPlayerRoles(roles[0],roles[1],roles[2])

  __writePlayerNames:()->
    # playerNameTags = @__domNode.getElementsByTagName('h3')
    playerNames = @__g.gameManager.getPlayerNames()
    # playerNameTags[0].innerHTML = playerNames[0]
    # playerNameTags[1].innerHTML = playerNames[1]
    # playerNameTags[2].innerHTML = playerNames[2]

    $playerNameTags = $(@__domNode).find("h3")
    $playerNameTags.eq(0).html(playerNames[0])
    $playerNameTags.eq(1).html(playerNames[1])
    $playerNameTags.eq(2).html(playerNames[2])


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #flood the drop down markup with the avaible roles
    avaibleRoles = @__g.gameManager.getAvailableRoles()
    autoSelectedRoles = @__g.gameManager.getAutoCompletedRoles()
    
    if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_SINGLE_ROUND
      @__uiDropdownViews = []
      dropdownView = undefined
      dropdownContentString = ''
      selectedClass = ''
      index = 0
      $(".ui-dropdown-input").addClass("enabled")
      $(".ui-table-view-content").empty()
      for dropdown in @__domNode.getElementsByClassName("ui-dropdown")
        dropdownContentString = ''
        for role in avaibleRoles[index]
          selectedClass = if (role is autoSelectedRoles[index]) then " class='selected'" else ""
          dropdownContentString += "<li class='ui-table-view-item'><a href='#'#{selectedClass}>#{role}</a></li>"
        $(".ui-table-view-content").eq(index).append(dropdownContentString)
        dropdownView = new masquerade.UIDropdownView({domNode:dropdown})
        dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE,@__dropdownChange)
        dropdownView.addEventListener(masquerade.UIDropdownView.OPEN,@__dropdownOpen)
        @__uiDropdownViews.push(dropdownView)
        index++

    inputs = @__domNode.getElementsByTagName("input")
    index = 0
    for role in autoSelectedRoles
      inputs[index].value = role
      index++

    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    if @__g.gameManager.getRoundIndex() > 0
      @__g.navigationBar.drawNavigationButtons(["pause"])
    else
      @__g.navigationBar.drawNavigationButtons(["back"])
    @__writePlayerNames()

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
