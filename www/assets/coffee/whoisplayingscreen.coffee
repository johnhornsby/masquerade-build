masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.WhoIsPlayingScreen extends masquerade.Screen


  constructor: (domNode)->
    super domNode






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    super
    

  __build:() ->
    super
    @__textInputs = []
    textInputs = @__domNode.getElementsByTagName('input')
    for textInput in textInputs
      textInput.addEventListener("blur",@__onTextFieldOnBlur,false)
      @__textInputs.push(textInput)
    #$(@__domNode).addClass("fade-init")

  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-next"
      validationCode = @__validate()
      if(validationCode is 0)
        @__saveData()
        @dispatchEvent(new events.Event(masquerade.Screen.NAVIGATE_TO,{name:"choose-roles"}))
        @__removeInteractivity()
      else
        @__displayIncompleteFormData(validationCode)

  __onTextFieldOnBlur:(event) =>
    index = @__textInputs.indexOf(event.currentTarget)

  __validate:()->
    duplicateNameCheckArray = []
    for textInput in @__textInputs
      if textInput.value is ""
        return 1
      if duplicateNameCheckArray.indexOf(textInput.value) isnt -1
        return 2
      duplicateNameCheckArray.push(textInput.value)
    return 0

  __displayIncompleteFormData:(code)->
    window.log "IN-VALID"
    switch code
      when 1
        @__g.rootViewController.alert {message:"Please enter all three player names"}
      when 2
        @__g.rootViewController.alert {message:"Please ensure all player names are unique"}

  __saveData:()->
    @__g.gameManager.setPlayerNames(@__textInputs[0].value, @__textInputs[1].value, @__textInputs[2].value)






  #PUBLIC
  #_______________________________________________________________________________________
  introStart:()->
    super
    #@__domNode.classList.add("fadeInEnable")
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])

    if @__g.showPlaceholderData is true
      @__textInputs[0].value = "Efan"
      @__textInputs[1].value = "Poppy"
      @__textInputs[2].value = "Tom"

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
