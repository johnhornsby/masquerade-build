masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.MDWaitingScreen extends masquerade.MDScreen

  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________




  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    @__showWaitingForServer()
    super


    targetColour = masquerade.ColourManager.GREEN
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