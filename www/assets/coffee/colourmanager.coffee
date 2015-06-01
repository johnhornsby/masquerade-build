masquerade = Namespace('SEQ.masquerade')

class masquerade.ColourManager

  __g:masquerade.Globals
  __currentColour:"#60bca5"

#FF809F nice pink

  constructor: ()->
    @__init()

  __init:() ->



  #PUBLIC
  #_______________________________________________________________________________________
  fadeColorTo:(colour)->
    console.log "fadeColorTo fade to "+colour
    @__currentColour = colour;
    
    elements = document.getElementsByClassName('color-background-floodable')
    for el in elements
      #console.log "color-background-floodable "+elements
      #el.style.backgroundColor = colour

      @stopFadeOnElement(el)
      TweenMax.to(el,0.8, {backgroundColor:colour})

    elements = document.getElementsByClassName('color-color-floodable')
    for el in elements
      el.style.color = colour

    elements = document.getElementsByClassName('selected-color-color-floodable')
    for el in elements
      el.style.color = colour

    elements = document.getElementsByClassName('selected-color-background-floodable')
    for el in elements
      el.style.backgroundColor = colour

    if @__g.platform is "android" and @__g.osVersion < 4
      $(".color-color-floodable-android2").css("color",colour)
      $(".color-background-floodable-android2").css("background-color",colour)

  stopFadeOnElement:(element)->
    if TweenMax.isTweening(element)
        TweenMax.killTweensOf(element,{backgroundColor:true})

    




  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________
  getCurrentColour:()->
    #console.log "currentColour:" + @__currentColour
    return @__currentColour

  getInvertBaseColour:()->
    return "white"

  setCurrentColour:(str)->
    @__currentColour = str

masquerade.ColourManager.GREEN = "#60bca5"
masquerade.ColourManager.RED = "#eb5055"
masquerade.ColourManager.YELLOW = "#ffac35"
masquerade.ColourManager.BLUE = "#449bb5"
masquerade.ColourManager.PURPLE = "#543c52"
masquerade.ColourManager.NAVY = "#3e5667"
masquerade.ColourManager.LIME = "#b3d059"
masquerade.ColourManager.BEIGE = "#d5c6aa"