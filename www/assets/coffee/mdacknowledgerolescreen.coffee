masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDAcknowledgeRoleScreen extends masquerade.MDScreen

  __hasAcknowledgedRole:false
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
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"

      @__removeInteractivity()
      @__g.mdGameManager.setHasAcknowledgedRole()
      
      #use __checkWithGameManager to update view
      #we want to update the view to waiting if phaseIndex is still on 2
      #if its on 3 then we will be forwarded due to the above call. 
      #this will show the waiting for a fraction of a second before we animate.
      #so we either check for phaseIndex here or have __checkWithGameManager called
      #on SERVER_UPDATE and then if we navigate this listener will be culled
      #stopping the call. Phew lets just check for phaseIndex here, this is a classic
      #of calls begin made after RVC chooses to navigate.
      #Rememeber avoid updated view after a function that may result in a change of view

      #eh correct me if I'm wrong, and that the above function will automatically generate
      #a SERVER_UPDATE event therefore automatically call __checkWithGameManager,
      #so I',m commeting below out

      #this acknowledgement does generate an event, because it does it in MDGM, 
      #and therefore does do a SERVER_UPDATE

      #the code below is to allow the views to update to waiting if on phase 2
      #however on a three round game we need not check as the above setHasAcknowledgedRole
      #will change view for us
      if @__g.guid isnt @__g.mdGameManager.getRoleGUID("judge")
        if @__g.mdGameManager.getPhaseIndex() < 3
          @__checkWithGameManager()

  __checkWithGameManager: () =>
    super
    @__g.debug "MDAcknowledgeRoleScreen __checkWithGameManager()"
    if @__g.mdGameManager.hasAcknowledgedRole() 
      @__hasAcknowledgedRole = true

    if @__hasAcknowledgedRole || @__g.mdGameManager.hasAcknowledgedRole() #show
      @__showWaitingForServer()
    else #hide
      @__hideWaitingForServer()






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
    players  = @__g.mdGameManager.getPlayers()
    otherPlayerNumber = 1
    otherPlayerClassName = ""
    otherPlayerString = ""
    titleImageIndex = 0
    for player in players
      if player.guid is @__g.guid
        html = $("h2").html()
        $("h2").html("#{html} #{player.name}")
        switch player.role
          when "judge"
            titleImageIndex = 0
          when "pretender"
            titleImageIndex = 1
          when "non-pretender"
            titleImageIndex = 2
        $(@__domNode.getElementsByClassName("title-image")[titleImageIndex]).removeClass("hide")
      else
        otherPlayerNumber++
        otherPlayerClassName = "player-#{otherPlayerNumber}-role"
        # if player.name != "" || player.name != null
        otherPlayerString = "" + player.name + " <span class='spanBold'>" + player.role + "</span>"
        $("." + otherPlayerClassName).html(otherPlayerString)


  outroStart:()->
    super

    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    @__hideWaitingCircle()
    super
