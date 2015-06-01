masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDChooseRolesScreen extends masquerade.MDScreen

  __uiDropdownViews:[]
  __players:[]
  # __isWaitingForServer:false
  # __waitingCircle:undefined
  __judgeGUID:""
  __defaultRoles:["judge","pretender","non-pretender"]
  __nonPretenderGUID:""
  __pretenderGUID:""
  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      #confirm roles
      if @__g.mdGameManager.isSingleRound()
        @__closeAll() #this may invalidate leavig this screen
        if(@__validate())
          judgeHasChanged = @__saveData()
          if judgeHasChanged
            @__removeAllServerActiveAnimation()
            @__g.rootViewController.alert {message:"Are you sure you want to resign your role as Judge?",ok:"Yes",cancel:"No", label:"resignAsJudge"}
          else
            @__removeInteractivity()
            @__g.mdGameManager.confirmRoles(@__judgeGUID, @__nonPretenderGUID, @__pretenderGUID)
        else
          #if not valid ensure animation has been removed
          @__removeAllServerActiveAnimation()
          @__displayIncompleteFormData()
      #acknowledge roles
      else
        @__g.debug "acknowledge"


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
    for d in @__domNode.getElementsByTagName("input")
      if d.value is ""
        return false
    return true

  __displayIncompleteFormData:()->
    @__g.debug "IN-VALID"
    @__g.rootViewController.alert {message:"You have not defined each player role", label:"validation"}

  __saveData:()->
    index = 0
    role = ""
    judgeHasChanged = false
    for input in @__domNode.getElementsByTagName("input")
      role = input.value.toLowerCase()
      switch role
        when "judge"
          @__judgeGUID = @__players[index].guid
          if @__judgeGUID isnt @__g.guid
            judgeHasChanged = true
        when "non-pretender"
          @__nonPretenderGUID = @__players[index].guid
        when "pretender"
          @__pretenderGUID = @__players[index].guid
      index++
    return judgeHasChanged


  __writePlayerNames:()->
    playerNameTags = @__domNode.getElementsByTagName('h3')
    playerNames = @__g.gameManager.getPlayerNames()
    playerNameTags[0].innerHTML = @__players[0].name
    playerNameTags[1].innerHTML = @__players[1].name
    playerNameTags[2].innerHTML = @__players[2].name


  #override
  __checkWithGameManager: () =>
    super
    console.log "MDChooseRolesScreen __checkWithGameManager()"

    #judge starts off as ""


    @__players = @__g.mdGameManager.getPlayers()
    if @__judgeGUID isnt @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)
      @__g.debug "updated judge"
      
      #display alert
      if @__judgeGUID isnt "" and @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) is @__g.guid
      #judge has a previous GUID
        previousJudgeName = @__g.mdGameManager.getGUIDName(@__judgeGUID)
        @__g.rootViewController.alert({message:"#{previousJudgeName} has assigned you the role of Judge", label:"reasignedAsJudge"})

      @__judgeGUID = @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE)
    if @__g.mdGameManager.isSingleRound()
      #if judge then display dropdowns
      if @__g.guid is @__judgeGUID
        #display dropdowns
        @__showFrame1()
        @__populateDropdowns()
        @__addInteractivity()
      else
        #display waiting
        @__showFrame2()
    else
      #display role acknowledge
      @__showFrame3()
      @__addInteractivity()

  __showFrame1:()->
    $(".frame-1").show()
    $(".frame-2").hide()
    $(".frame-3").hide()
    @__hideWaitingCircle()

  __showFrame2:()->
    $(".frame-1").hide()
    $(".frame-2").show()
    $(".frame-3").hide()
    @__showWaitingCircle()

  __showFrame3:()->
    $(".frame-1").hide()
    $(".frame-2").hide()
    $(".frame-3").show()
    @__hideWaitingCircle()

  # __showWaitingCircle:()->
  #   #waiting circle may aready exist, roles may have changed, this player may not be affected
  #   if @__waitingCircle is undefined
  #     @__waitingCircle = new masquerade.WaitingCircle("waiting-for-server")
  #     @__waitingCircle.start()

  # __hideWaitingCircle:()->
  #   if @__waitingCircle isnt undefined
  #     @__waitingCircle.stop()
  #   @__waitingCircle = undefined
    
  __populateDropdowns: ()->
    @__uiDropdownViews = []
    dropdownView = undefined
    dropdownContentString = ''
    selectedClass = ''
    index = 0
    $(".ui-dropdown-input").addClass("enabled")
    $(".ui-table-view-content").empty()

    for dropdown in @__domNode.getElementsByClassName("ui-dropdown")
      dropdownContentString = ''
      for role in @__defaultRoles
        selectedClass = if (role is @__players[index].role) then " class='selected'" else ""
        dropdownContentString += "<li class='ui-table-view-item'><a href='#'#{selectedClass}>#{role}</a></li>"
      $(".ui-table-view-content").eq(index).append(dropdownContentString)
      dropdownView = new masquerade.UIDropdownView({domNode:dropdown})
      dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE,@__dropdownChange)
      dropdownView.addEventListener(masquerade.UIDropdownView.OPEN,@__dropdownOpen)
      @__uiDropdownViews.push(dropdownView)
      index++

    inputs = @__domNode.getElementsByTagName("input")
    index = 0
    for player in @__players
      inputs[index].value = player.role
      index++

  __onAlertOkClick:(e)=>
    #ensure alert ok click has been from a confirming resign as judge click, it could be a quit game alert
    if e.data.label is "resignAsJudge"
      @__removeInteractivity()
      @__g.mdGameManager.confirmRoles(@__judgeGUID, @__nonPretenderGUID, @__pretenderGUID)
    #if e.data.label is "validation"


  #__onAlertCancelClick:(e)=>


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    targetColour = masquerade.ColourManager.GREEN
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause"])
    #flood the drop down markup with the avaible roles
    # avaibleRoles = @__g.gameManager.getAvailableRoles()
    # autoSelectedRoles = @__g.gameManager.getAutoCompletedRoles()
    
    # if @__g.gameManager.getMode() is masquerade.GameManager.GAME_OPTION_SINGLE_ROUND
    #   @__uiDropdownViews = []
    #   dropdownView = undefined
    #   dropdownContentString = ''
    #   selectedClass = ''
    #   index = 0
    #   $(".ui-dropdown-input").addClass("enabled")
    #   $(".ui-table-view-content").empty()
    #   for dropdown in @__domNode.getElementsByClassName("ui-dropdown")
    #     dropdownContentString = ''
    #     for role in avaibleRoles[index]
    #       selectedClass = if (role is autoSelectedRoles[index]) then " class='selected'" else ""
    #       dropdownContentString += "<li class='ui-table-view-item'><a href='#'#{selectedClass}>#{role}</a></li>"
    #     $(".ui-table-view-content").eq(index).append(dropdownContentString)
    #     dropdownView = new masquerade.UIDropdownView({domNode:dropdown})
    #     dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE,@__dropdownChange)
    #     dropdownView.addEventListener(masquerade.UIDropdownView.OPEN,@__dropdownOpen)
    #     @__uiDropdownViews.push(dropdownView)
    #     index++

    # inputs = @__domNode.getElementsByTagName("input")
    # index = 0
    # for role in autoSelectedRoles
    #   inputs[index].value = role
    #   index++


    # if @__g.gameManager.getRoundIndex() > 0
    #   @__g.navigationBar.drawNavigationButtons(["pause"])
    # else
    #   @__g.navigationBar.drawNavigationButtons(["back"])
    # @__writePlayerNames()


    #@__checkWithGameManager()
    @__writePlayerNames()
    #dont add listeners yet, check on introStart and then add after complete
    # @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_PLAYERS, @__checkWithGameManager)
    # @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  screenStart:()->
    super
    @__g.rootViewController.addEventListener(masquerade.AlertScreen.OK_CLICK, @__onAlertOkClick)
    #@__checkWithGameManager()
    #@listenToMDGM()


  outroStart:()->
    super
    @__g.rootViewController.removeEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    #@__g.rootViewController.removeEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)
    #@__domNode.classList.add("fadeOutEnable")
    # @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__checkWithGameManager)
    # @__g.mdGameManager.removeEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__checkWithGameManager)
    #@ignoreMDGM()
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    #@__hideWaitingCircle()
    super
