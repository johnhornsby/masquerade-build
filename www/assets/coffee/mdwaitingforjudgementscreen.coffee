masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDWaitingForJudgementScreen extends masquerade.MDScreen

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________




  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    @__showWaitingForServer()
    super
    switch @__g.mdGameManager.getGUIDRole(@__g.guid)
      when masquerade.MDGameManager.ROLE_PRETENDER
        targetColour = masquerade.ColourManager.YELLOW
      when masquerade.MDGameManager.ROLE_NON_PRETENDER
        targetColour = masquerade.ColourManager.NAVY
    timeout = if @__g.colourManager.getCurrentColour() is targetColour then 100 else 1000
    @__fadeColorTo(targetColour)

    @__g.navigationBar.drawNavigationButtons(["pause"],false)

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