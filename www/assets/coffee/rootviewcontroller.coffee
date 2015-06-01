#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')




class masquerade.RootViewController extends display.EventDispatcher

  __currentScreen:undefined
  __previousScreen:undefined
  __domNodes:{}
  __g:masquerade.Globals
  __screenContainerElement:{}
  __screensTransitionsIncrement:0   #increments through animation an out and or in, not really used
  __navigationBar:{}
  __screenHistory:[]
  __pauseScreen:{}
  __isPauseActive:false
  __alertScreen:{}
  __isAlertActive:false
  __isAnimating:false             #used to detect if screen are animating in or out, briefly set to false between animation in an out to reflect MDGM state
  __isAnimatingForward:false



  __mdAckJoinGame:true
  __mdPhaseIndex:-1
  __mdStateUpdatedWhileAnimating:false
  __mdScreenTransitionPhase:"screenTransitionPhaseIntroComplete"
  __mdSkipQuitGameAlertFlag:false
  __mdIsInGame:false            #RVC uses this to determine if we are actively involved in playng a multi device game, used to check against MDGM and see if game has quit
  __mdErrorOccuredWhileAnimating:false
  #__mdTestIncrement:0

  constructor: ()->
    super
    @__init()





  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    if @__g.platform is "ios" and @__g.osVersion >= 7
      #document.getElementsByTagName('body')[0].classList.add("status-bar-offset")
      $('body').addClass("status-bar-offset")

    @__screenHistory = []
    @__g.screenWidth = window.innerWidth
    @__g.screenHeight = window.innerHeight
    @__screenContainerElement = document.getElementById("wrapper")

    if @__g.platform is "android" and @__g.osVersion < 4
      $(".color-background-floodable").addClass("switch-color-background-floodable")
      $(".switch-color-background-floodable").removeClass("color-background-floodable")
      $(".switch-color-background-floodable").addClass("color-background-floodable-android2")
      $(".switch-color-background-floodable").removeClass("switch-color-background-floodable")

      $(".color-color-floodable").addClass("switch-color-color-floodable")
      $(".switch-color-color-floodable").removeClass("color-color-floodable")
      $(".switch-color-color-floodable").addClass("color-color-floodable-android2")
      $(".switch-color-color-floodable").removeClass("switch-color-color-floodable")

    @__addScreenDomNodes()                                          #removes all screens from the dom
    @__g.navigationBar = @__navigationBar = new masquerade.NavigationBar(@__domNodes["navigation-bar"])
    @setListenToNavigationEvents(true)
    document.getElementsByTagName('body')[0].prependChild(@__navigationBar.getDomNode())
    
    @__pauseScreen = new masquerade.PauseScreen(@__domNodes["pause"].cloneNode(true))
    @__pauseScreen.addEventListener(masquerade.PauseScreen.EXIT_GAME_CLICK,@__onPauseExitClick)
    @__pauseScreen.addEventListener(masquerade.PauseScreen.RESUME_GAME_CLICK,@__onPauseResumeClick)
    document.getElementsByTagName('body')[0].appendChild(@__pauseScreen.getDomNode())
    @__isPauseActive = false

    @__alertScreen = new masquerade.AlertScreen(@__domNodes["alert"].cloneNode(true))
    @__alertScreen.addEventListener(masquerade.AlertScreen.OK_CLICK,@__onAlertOkClick)
    @__alertScreen.addEventListener(masquerade.AlertScreen.CANCEL_CLICK,@__onAlertCancelClick)
    document.getElementsByTagName('body')[0].appendChild(@__alertScreen.getDomNode())

    @__g.debugElement = document.createElement('div')
    $(@__g.debugElement).addClass("debug-output")
    $(@__g.debugElement).addClass("status-bar-offset")
    document.getElementsByTagName('body')[0].appendChild(@__g.debugElement)
    
    @__isAlertActive = false

    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_SERVER, @__mdUpdatedServer)
    @__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, @__mdUpdatedServerError)


  __addScreenDomNodes:()->
    screenClass = ""
    className = ""
    parent = {}
    nodes = document.getElementsByClassName("template")
    for node in nodes
      className = node.className
      screenClass = className.substring(className.indexOf("-")+1)
      screenClass = screenClass.split(" ")[0]
      @__domNodes[screenClass] = node
    parent = node.parentNode
    parent.removeChild parent.firstChild while parent.firstChild

  __returnScreenInstance:(keyString)->
    switch keyString
      when "home"
        return new masquerade.HomeScreen(@__domNodes[keyString].cloneNode(true))
      when "game-options"
        return new masquerade.GameOptionsScreen(@__domNodes[keyString].cloneNode(true))
      when "how-to-play"
        return new masquerade.HowToPlayScreen(@__domNodes[keyString].cloneNode(true))
      when "high-scores"
        return new masquerade.HighScoresScreen(@__domNodes[keyString].cloneNode(true))
      when "who-is-playing"
        return new masquerade.WhoIsPlayingScreen(@__domNodes[keyString].cloneNode(true))
      when "choose-characteristic"
        return new masquerade.ChooseCharacteristicScreen(@__domNodes[keyString].cloneNode(true))
      when "choose-roles"
        return new masquerade.ChooseRolesScreen(@__domNodes[keyString].cloneNode(true))
      when "ready"
        return new masquerade.ReadyScreen(@__domNodes[keyString].cloneNode(true))
      when "enter-question"
        return new masquerade.EnterQuestionScreen(@__domNodes[keyString].cloneNode(true))
      when "enter-answer"
        return new masquerade.EnterAnswerScreen(@__domNodes[keyString].cloneNode(true))
      when "reveal"
        return new masquerade.RevealScreen(@__domNodes[keyString].cloneNode(true))
      when "round-end"
        return new masquerade.RoundEndScreen(@__domNodes[keyString].cloneNode(true))
      when "choose-questions"
        return new masquerade.ChooseQuestionsScreen(@__domNodes[keyString].cloneNode(true))
      when "game-scores"
        return new masquerade.GameScoresScreen(@__domNodes[keyString].cloneNode(true))
      when "review"
        return new masquerade.ReviewScreen(@__domNodes[keyString].cloneNode(true))
      when "game-over"
        return new masquerade.GameOverScreen(@__domNodes[keyString].cloneNode(true))
      when "settings"
        return new masquerade.SettingsScreen(@__domNodes[keyString].cloneNode(true))
      when "profile"
        return new masquerade.ProfileScreen(@__domNodes[keyString].cloneNode(true))
      when "language"
        return new masquerade.LanguageScreen(@__domNodes[keyString].cloneNode(true))
      when "choose-device"
        return new masquerade.ChooseDeviceScreen(@__domNodes[keyString].cloneNode(true))
      when "multi-device"
        return new masquerade.MultiDeviceScreen(@__domNodes[keyString].cloneNode(true))
      when "md-join-game"
        return new masquerade.MDJoinGameScreen(@__domNodes[keyString].cloneNode(true))
      when "md-choose-roles"
        return new masquerade.MDChooseRolesScreen(@__domNodes[keyString].cloneNode(true))
      when "md-choose-characteristic"
        return new masquerade.MDChooseCharacteristicScreen(@__domNodes[keyString].cloneNode(true))
      when "md-acknowledge-role"
        return new masquerade.MDAcknowledgeRoleScreen(@__domNodes[keyString].cloneNode(true))
      when "md-acknowledge-characteristic"
        return new masquerade.MDAcknowledgeCharacteristicScreen(@__domNodes[keyString].cloneNode(true))
      when "md-enter-question"
        return new masquerade.MDEnterQuestionScreen(@__domNodes[keyString].cloneNode(true))
      when "md-waiting-for-players"
        return new masquerade.MDWaitingForPlayersScreen(@__domNodes[keyString].cloneNode(true))
      when "md-enter-answer"
        return new masquerade.MDEnterAnswerScreen(@__domNodes[keyString].cloneNode(true))
      when "md-waiting"
        return new masquerade.MDWaitingScreen(@__domNodes[keyString].cloneNode(true))
      when "md-reveal"
        return new masquerade.MDRevealScreen(@__domNodes[keyString].cloneNode(true))
      when "md-round-game-end"
        return new masquerade.MDRoundGameEndScreen(@__domNodes[keyString].cloneNode(true))
      when "md-waiting-for-judgement"
        return new masquerade.MDWaitingForJudgementScreen(@__domNodes[keyString].cloneNode(true))
        

  __transitionOutInit:()->
    @__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_INIT
    @__isAnimating = true       #now activated here
    @__previousScreen.outroStart()

  __transitionOutComplete:()=>
    @__g.debug "rootviewcontroller __transitionOutComplete()"
    @__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE
    @__isAnimating = false #moved @__isAnimating before @__mdUpdatedServer() because @__mdUpdatedServer() returns false if @__isAnimating

    @__previousScreen.removeEventListener(masquerade.Screen.INTRO_COMPLETE,@__transitionInComplete)
    @__previousScreen.removeEventListener(masquerade.Screen.OUTRO_COMPLETE,@__transitionOutComplete)
    @__previousScreen.removeEventListener(masquerade.Screen.NAVIGATE_TO,@__onNavigateTo)
    #screenEnd() removes all listeners, click events and domNode from dom
    @__previousScreen.screenEnd()
    @__previousScreen = undefined
    @__screensTransitionsIncrement++

    if @__mdErrorOccuredWhileAnimating
      return true

    # check before we create the screen that its still the correct one.
    hasViewChanged = false
    #check if in Multi Device game and state needs to be updated before authorising transitionInInit
    if @__g.mdGameManager.isActive() and @__mdStateUpdatedWhileAnimating
      hasViewChanged = @__mdUpdatedServer()
    #internal view changes should be managed by the view
    if hasViewChanged is true
      return true
    else
      #if we are not in a MD game and MD state has not updated while animating then perform the normal In Init
      @__transitionInInit()

  __transitionInInit:()->
    @__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_INIT
    @__isAnimating = true       #now reinactivated here
    if @__currentScreen is undefined
      console.error "rootviewcontroller Error @__currentScreen is undefined"
    @__screenContainerElement.appendChild(@__currentScreen.getDomNode())
    @__currentScreen.addEventListener(masquerade.Screen.INTRO_COMPLETE,@__transitionInComplete)
    @__currentScreen.addEventListener(masquerade.Screen.OUTRO_COMPLETE,@__transitionOutComplete)
    @__currentScreen.addEventListener(masquerade.Screen.NAVIGATE_TO,@__onNavigateTo)
    @__currentScreen.introStart()

  __transitionInComplete:()=>
    @__g.debug "rootviewcontroller __transitionInComplete()"
    @__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_COMPLETE
    @__screensTransitionsIncrement++
    #moved @__isAnimating before @__mdUpdatedServer() because @__mdUpdatedServer() returns false if @__isAnimating
    @__isAnimating = false

    if @__mdErrorOccuredWhileAnimating
      return true

    #need to check here with MD Game Manager to see if we need to reflect MDGM state
    hasViewChanged = false
    if @__g.mdGameManager.isActive() and @__mdStateUpdatedWhileAnimating
      hasViewChanged = @__mdUpdatedServer()
    #screenStart is used crucially for Multi Device screens to offically attach listeners to MDGM
    #internal view changes should be managed by the view
    if hasViewChanged is true
      return true
    #if the view has changed this must not be called 
    #because @__currentScreen will now be the new one, created in __onNavigateTo
    #and we don't want to run code on anothing that has or will be killed
    @__currentScreen.screenStart()
    @__isAnimatingForward = true
    

  __onNavigateTo:(e) =>
    name = e.data.name

    @__mdTestIncrement++
    @__g.debug "rootviewcontroller __onNavigateTo() to:#{e.data.name} __isAnimating:#{@__isAnimating} __mdScreenTransitionPhase:#{@__mdScreenTransitionPhase}"
    return if @__isAnimating is true

    #if we are currently on that screen do nothing
    if @__currentScreen
      if @__currentScreen.getName() is name
        return false

    #if we are in the middle of animation, then before we set currentScreen to previousScreen we need to end it,
    #if outro_complete then we are redirecting navigation during a transition
    if @__mdScreenTransitionPhase is masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE
      @__currentScreen.removeEventListener(masquerade.Screen.INTRO_COMPLETE,@__transitionInComplete)
      @__currentScreen.removeEventListener(masquerade.Screen.OUTRO_COMPLETE,@__transitionOutComplete)
      @__currentScreen.removeEventListener(masquerade.Screen.NAVIGATE_TO,@__onNavigateTo)
      #screenEnd() removes all listeners, click events and domNode from dom
      @__currentScreen.screenEnd()
      @__currentScreen = undefined

    #@__isAnimating = true                     #now this is set before each init and set to false at the end
    @__mdStateUpdatedWhileAnimating = false   #reset this before animating __transitionInInit
    @__mdErrorOccuredWhileAnimating = false   #reset this before animating __transitionInInit
    
    clearHistory = if e.data.clearHistory then true else false
    if clearHistory is true
      @__screenHistory = ["home"]
    @__screenHistory.push(name)
    @__previousScreen = @__currentScreen
    @__currentScreen = @__returnScreenInstance(name)
    @__screensTransitionsIncrement = 0
    #either @__previousScreen is undefined because its the first screen or we have killed @__currentScreen before above and we are redirecting navigation  
    if @__previousScreen isnt undefined
      @__transitionOutInit()
    else
      @__transitionInInit()

  __getCurrentScreenName:()->
    return @__currentScreen.getName()

  __onBackClick:(e) =>
    return false if @__isAnimating
    @__g.debug @__screenHistory
    @__screenHistory.pop()                        #remove current
    previousLocation = @__screenHistory.pop()     #remove previous, this will be naturally added again in onNavigateTo
    @__isAnimatingForward = false
    @__onNavigateTo({data:{name:previousLocation}})

  __onPauseClick:(e) =>
    return false if @__isAnimating
    if @__isPauseActive
      @__isPauseActive = false
      @__pauseScreen.outroStart()
    else 
      @__isPauseActive = true
      @__pauseScreen.introStart()

  __onPauseResumeClick:(e)=>
    @__onPauseClick()

  __onPauseExitClick:(e)=>
    if @__g.mdGameManager.isActive()
      #Don't need the flag not to skip showing the alert, because we set the MDGM below, this cancelled the response 
      #coming back from the server to even try to show an alert. Essentiall for a user initiated kill
      #everything is handled here, we send off the response to advise the other players and then just reset the server
      #cancelling everything and culling repsonses
      @__g.mdGameManager.quitGame()
      @__onPauseClick()
      @__onNavigateTo({data:{name:"home"}})
      @__g.mdGameManager.reset()
    else
      @__onPauseClick()
      @__onNavigateTo({data:{name:"home"}})
    

  __onHelpClick:(e) =>
    return false if @__isAnimating

  __onAlertOkClick:(e)=>
    @__isAlertActive = false
    @__alertScreen.outroStart()
    @dispatchEvent(e)
    #check properly for MDGM error and handle
    if e.data.label
      if e.data.label.search("serverError") isnt -1
        match = e.data.label.match(/\d+/)
        if match.length > 0
          responseCode = parseInt(match[0])
          if responseCode isnt null
            @__mdPostUserAcknowledgeError(responseCode)

  __onAlertCancelClick:(e)=>
    @__isAlertActive = false
    @__alertScreen.outroStart()
    @dispatchEvent(e)



  #PRIVATE MULTI DEVICE METHODS
  #______________________________________________________________________________________

  __mdPostUserAcknowledgeError:(code)->
    switch code
      when 0  #unkown error, server did not even return anything
        @__onNavigateTo({data:{name:"home", clearHistory:true}})
        #Just to avoid unknown complication of not resetting, I am resetting here. 
        @__g.mdGameManager.reset()
      when 2 #game full
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 3 #game not found
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 4 #player not found
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 5 #round not initialised
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 6 #question not initialised
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 7 #answers not enough
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 8 #player has already awsered
        @__onNavigateTo({data:{name:"multi-device", clearHistory:true}})
      when 10 #leave game
        @__onNavigateTo({data:{name:"home", clearHistory:true}})
        #now we are truly finished with MDGM, reset so we don't try to reconnect
        @__g.mdGameManager.reset()
      when 11 #game over
        @__onNavigateTo({data:{name:"home", clearHistory:true}})
        #now we are truly finished with MDGM, reset so we don't try to reconnect
        @__g.mdGameManager.reset()


  #After an error has occured, RVC decideds what to do, MDGM does not start to make decisions about resetting or anything
  __mdUpdatedServerError:(e) =>
    @__g.debug "serverError-#{e.data.code} response:#{@__g.mdGameManager.getResponseHistoryLast()}"
    if @__isAnimating
      @__mdErrorOccuredWhileAnimating = true      # set to true
    code = e.data.code
    switch code
      when 0  #unkown error, server did not even return anything
        #generate an alert for any and every server error, this will fire from
        #bad repsonses and no repsonses
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 2 #game full
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 3 #game not found
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 4 #player not found
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 5 #round not initialised
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 6 #question not initialised
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 7 #answers not enough
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 8 #player has already awsered
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 10 #leave game
        #trip has been removed, if a leaveGame response is being handled then its because it has not
        #been initiated by this player, therefore show the alert
        if @__currentScreen.ignoreMDGM  #choose device screen does not inherit from MDScreen
          @__currentScreen.ignoreMDGM()
        @alert({message:"The current game has ended", label:"serverError-#{e.data.code}"})
      when 11 #end game
        @alert({message:"The game has ended", label:"serverError-#{e.data.code}"})
        #@__g.debug "rootviewcontroller Server Confirmed Game Over"
      when 100 #Timeout
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 101 #Server Error
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})
      when 102 #Server Error
        @alert({message:e.data.message, label:"serverError-#{e.data.code}"})


  #function that aims to reflect MDGM state, called upon learning that MDGM state has changed and called by itself if knowing
  #MDGM has updated state during view animation  
  __mdUpdatedServer: () =>
    @__g.debug "rootviewcontroller __mdUpdatedServer() phaseIndex:#{@__g.mdGameManager.getPhaseIndex()}"
    if @__isAnimating
      @__mdStateUpdatedWhileAnimating = true      # set to true, this then ensures @__mdUpdatedServer is called when animation is complete
      return false

    #Set if the view is changing, initiate at false
    hasViewChanged = false

    #detect change of state and save
    phaseIndex = @__g.mdGameManager.getPhaseIndex()

    #handle a change in MDGM phase index
    switch phaseIndex

      when 0 # Waiting For Players
        #@__g.debug "RootViewController "
        #Need to handle new rounds and new games, views will have to remain on round over or game over untill all user has pressed play again or next round
        
        if @__mdAckJoinGame is true  #set to false when in game over screen to ensure client screens only change to reflect phaseindex after they have confirmed
          if @__getCurrentScreenName() isnt "md-join-game"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-join-game"}})

      when 1 # Select Roles
        #@__g.debug phaseIndex
        if @__getCurrentScreenName() isnt "md-choose-roles"
          hasViewChanged = true
          @__onNavigateTo({data:{name:"md-choose-roles"}})

      when 2 # Select Characteristic
        #@__g.debug phaseIndex
        if @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) is @__g.guid
          if @__g.mdGameManager.isSingleRound()
            if @__getCurrentScreenName() isnt "md-choose-characteristic"
              hasViewChanged = true
              @__onNavigateTo({data:{name:"md-choose-characteristic"}})
          else
            if @__g.mdGameManager.hasAcknowledgedRole()
              if @__getCurrentScreenName() isnt "md-choose-characteristic"
                hasViewChanged = true
                @__onNavigateTo({data:{name:"md-choose-characteristic"}})
            else
              if @__getCurrentScreenName() isnt "md-acknowledge-role"
                hasViewChanged = true
                @__onNavigateTo({data:{name:"md-acknowledge-role"}})
        else
          if @__getCurrentScreenName() isnt "md-acknowledge-role"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-acknowledge-role"}})

      when 3  # Enter Question
        #@__g.debug phaseIndex
        if @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) is @__g.guid
          if @__getCurrentScreenName() isnt "md-enter-question"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-enter-question"}})
        else
          if @__g.mdGameManager.getQuestionIndex() > 0
            if @__getCurrentScreenName() isnt "md-waiting"
              hasViewChanged = true
              @__onNavigateTo({data:{name:"md-waiting"}})
          else
            if @__g.mdGameManager.hasAcknowledgedRole()
              if @__getCurrentScreenName() isnt "md-acknowledge-characteristic"
                hasViewChanged = true
                @__onNavigateTo({data:{name:"md-acknowledge-characteristic"}})
            else
              if @__getCurrentScreenName() isnt "md-acknowledge-role"
                hasViewChanged = true
                @__onNavigateTo({data:{name:"md-acknowledge-role"}})

      when 4  # Waiting For Player Acknowledgement
        #@__g.debug phaseIndex
        if @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) is @__g.guid
          if @__getCurrentScreenName() isnt "md-waiting-for-players"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-waiting-for-players"}})
        else
          if @__g.mdGameManager.hasAcknowledgedCharacteristic()
            if @__getCurrentScreenName() isnt "md-waiting-for-players"
              hasViewChanged = true
              @__onNavigateTo({data:{name:"md-waiting-for-players"}})
          else if @__g.mdGameManager.hasAcknowledgedRole()
            if @__getCurrentScreenName() isnt "md-acknowledge-characteristic"
              hasViewChanged = true
              @__onNavigateTo({data:{name:"md-acknowledge-characteristic"}})
          else
            if @__getCurrentScreenName() isnt "md-acknowledge-role"
              hasViewChanged = true
              @__onNavigateTo({data:{name:"md-acknowledge-role"}})

      when 5
        #@__g.debug phaseIndex
        if @__getCurrentScreenName() isnt "md-enter-answer"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-enter-answer"}})

      when 6
        #@__g.debug phaseIndex
        if @__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) is @__g.guid
          if @__getCurrentScreenName() isnt "md-reveal"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-reveal"}})
        else
          if @__getCurrentScreenName() isnt "md-waiting-for-judgement"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-waiting-for-judgement"}})

      when 7
        #@__g.debug phaseIndex
        if @__getCurrentScreenName() isnt "md-round-game-end"
            hasViewChanged = true
            @__onNavigateTo({data:{name:"md-round-game-end"}})

      # when 8
      #   #@__g.debug phaseIndex
      #   #if still a player then display a message
      #   #maybe leave game or force ignore leave game
      #   hasViewChanged = true
      #   #if @__getCurrentScreenName() isnt "home"

      #   #simple trip set when player actively clicks quit, to avoid two alerts showing
      #   if @__mdSkipQuitGameAlertFlag is false
      #     if @__currentScreen.ignoreMDGM  #choose device screen does not inherit from MDScreen
      #       @__currentScreen.ignoreMDGM()
      #     @__alertScreen.addEventListener(masquerade.AlertScreen.OK_CLICK, @__onAcknowledgeKilledGame)
      #     @alert({message:"The current game has ended",label:"acknowledgedKillGame"})
      #   else
      #     @__mdSkipQuitGameAlertFlag = false  #reset if true
      #     @__onNavigateTo({data:{name:"home"}})

    return hasViewChanged



  # #Event called from the closing of the alert window
  # __onAcknowledgeKilledGame: (e) =>
  #   if e.data.label is "acknowledgedKillGame"
  #     @__alertScreen.removeEventListener(masquerade.AlertScreen.OK_CLICK, @__onAcknowledgeKilledGame)
  #     @__onNavigateTo({data:{name:"home", clearHistory:true}})
  #     #now we are truly finished with MDGM, reset so we don't try to reconnect
  #     @__g.mdGameManager.reset()




    #update view if necessary




    #if @__isAnimating
      #
    #check if current screen needs updating

    #if animating wait until finish untill check latest

    #if waiting for client to acknowledge, wait untill they do until we check

    #view can send messages directly to server

    #root need to process logic and determin destination view state, this is saved

    #if view is static (non animating) views are updated to latest

    #if view is animating, view are only updated upon them coming to a rest












  #PUBLIC
  #_______________________________________________________________________________________
  beginGame:() ->
    $("body").css("visibility","visible")
    @__onNavigateTo({data:{name:"home"}})

  getHistoryLength:()->
    @__screenHistory.length

  alert:(contentObject)->
    @__isAlertActive = true
    @__alertScreen.setContent(contentObject)
    @__alertScreen.introStart()

  showLoading: () ->
    @__navigationBar.showLoading()

  hideLoading: () ->
    @__navigationBar.hideLoading()

  setListenToNavigationEvents:(should)->
    if should
      @__navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK,@__onBackClick)
      @__navigationBar.addEventListener(masquerade.NavigationBar.PAUSE_CLICK,@__onPauseClick)
      @__navigationBar.addEventListener(masquerade.NavigationBar.HELP_CLICK,@__onHelpClick)
    else
      @__navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK,@__onBackClick)
      @__navigationBar.removeEventListener(masquerade.NavigationBar.PAUSE_CLICK,@__onPauseClick)
      @__navigationBar.removeEventListener(masquerade.NavigationBar.HELP_CLICK,@__onHelpClick)


  isAnimatingForward:()->
    return @__isAnimatingForward







  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________

masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_INIT = "screenTransitionPhaseIntroInit"
masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_COMPLETE = "screenTransitionPhaseIntroComplete"
masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_INIT = "screenTransitionPhaseOutroInit"
masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE = "screenTransitionPhaseOutroComplete"

