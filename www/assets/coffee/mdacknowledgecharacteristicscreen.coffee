masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDAcknowledgeCharacteristicScreen extends masquerade.MDScreen

  __hasAcknowledgedCharacteristic:false
  # __isWaitingForServer:false
  # __waitingCircle:undefined

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
    #use __checkWithGameManager to update view
    
    @__removeInteractivity()
    @__g.mdGameManager.setHasAcknowledgedCharacteristic()
    
    #use __checkWithGameManager to update view
    #we want to update the view to waiting if phaseIndex is still on 3
    #if its on 4 then we will be forwarded due to the above call. 
    #this will show the waiting for a fraction of a second before we animate.
    #so we either check for phaseIndex here or have __checkWithGameManager called
    #on SERVER_UPDATE and then if we navigate this listener will be culled
    #stopping the call. Phew lets just check for phaseIndex here, this is a classic
    #of calls begin made after RVC chooses to navigate.
    #Rememeber avoid updated view after a function that may result in a change of view

    #eh correct me if I'm wrong, and that the above function will automatically generate
    #a SERVER_UPDATE event therefore automatically call __checkWithGameManager,
    #so I',m commeting below out

    #er no we don't get am UPDATE_SERVER event here becuase nothing changes on the server
    #to generate and update. The thing is in the phase diagram we show on phase 4 we go
    #to a different waitng screen. might be easier to just show the waiting screen on this screen
    #I'll comment this all back in
    if @__g.mdGameManager.getPhaseIndex() < 5
      @__checkWithGameManager()


  __checkWithGameManager: () =>
    super
    @__g.debug "MDAcknowledgeRoleScreen __checkWithGameManager()"
    if @__g.mdGameManager.hasAcknowledgedCharacteristic() 
      @__hasAcknowledgedCharacteristic = true

    if @__hasAcknowledgedCharacteristic || @__g.mdGameManager.hasAcknowledgedCharacteristic() #show
      @__showWaitingForServer()
      # if @__isWaitingForServer is false
      #   @__isWaitingForServer = true
      #   @__showWaitingForServer()
    else #hide
      @__hideWaitingForServer()
      # if @__isWaitingForServer is true
      #   @__hideWaitingForServer()
      # @__addInteractivity()


  # __showWaitingForServer:()->
  #   $(".frame-1").hide()
  #   $(".frame-2").show()
  #   @__showWaitingCircle()

  # __hideWaitingForServer:()->
  #   $(".frame-1").show()
  #   $(".frame-2").hide()
  #   @__hideWaitingCircle()

  # __showWaitingCircle:()->
  #   if @__waitingCircle is undefined
  #     @__waitingCircle = new masquerade.WaitingCircle("waiting-for-server")
  #     @__waitingCircle.start()

  # __hideWaitingCircle:()->
  #   if @__waitingCircle isnt undefined
  #     @__waitingCircle.stop()
  #   @__waitingCircle = undefined


  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    #hide by default before __checkWithGameManager()


    @__hideWaitingForServer()
    super
    targetColour = masquerade.ColourManager.GREEN
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)
    
    @__g.navigationBar.drawNavigationButtons(["pause"],false)
    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

    #dom manipulation must go once its on the dom
    $("h2").html(@__g.mdGameManager.getCharacteristic())

    #dom manipulation must go once its on the dom
    players  = @__g.mdGameManager.getPlayers()
    otherPlayerNumber = 1
    otherPlayerClassName = ""
    otherPlayerString = ""
    titleImageIndex = 0
    for player in players
      if player.guid is @__g.guid
        switch player.role
          when "judge"
            titleImageIndex = 0
          when "pretender"
            titleImageIndex = 1
          when "non-pretender"
            titleImageIndex = 2
        $(@__domNode.getElementsByClassName("title-image")[titleImageIndex]).removeClass("hide")



  outroStart:()->
    super

    if @__waitingCircle isnt undefined
      @__waitingCircle.stop()
    @__waitingCircle = undefined

    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    #@__hideWaitingCircle()
    super