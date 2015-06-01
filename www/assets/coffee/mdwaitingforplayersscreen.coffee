masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDWaitingForPlayersScreen extends masquerade.MDScreen

  # __waitingCircle:undefined

  constructor: (domNode)->
    super domNode


  #PRIVATE
  #_______________________________________________________________________________________

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
  screenStart:()->
    super
    @__showWaitingCircle()

  introStart:()->
    super
    switch @__g.mdGameManager.getGUIDRole(@__g.guid)
      when masquerade.MDGameManager.ROLE_PRETENDER
        targetColour = masquerade.ColourManager.GREEN
      when masquerade.MDGameManager.ROLE_NON_PRETENDER
        targetColour = masquerade.ColourManager.GREEN
      when masquerade.MDGameManager.ROLE_JUDGE
        targetColour = masquerade.ColourManager.BLUE
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["pause"])

    setTimeout ()=>
      @__cueIntroAnimation()
    ,100
    

  outroStart:()->
    super
    # @__hideWaitingCircle()
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0
