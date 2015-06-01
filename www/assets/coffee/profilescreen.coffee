masquerade = Namespace('SEQ.masquerade')
events = Namespace('SEQ.events')

class masquerade.ProfileScreen extends masquerade.MDScreen

  __textInput:{}
  __uiDropdownViews:[]
  __prepareToSaveNickName: null
  __prepareToSaveAge: null
  __prepareToSaveGender: null
  __prepareToSavePrivacy: null

  constructor: (domNode)->
    super domNode







  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    # @__prepareToSaveNickName = ""
    # @__prepareToSaveAge = ""
    # @__prepareToSaveGender = ""
    super

  __build:() ->
    super
    #$(@__domNode).addClass("fade-init")
    @__textInput = @__domNode.getElementsByTagName('input')[0]
    @__textInput.addEventListener("change", @__onTextFieldOnChange,false)
    $(@__textInput).val(@__g.localStorageManager.getName())
    #$(".ui-checkbox").bind("change", @__checkboxChange)
    $(@__domNode).find(".ui-checkbox").change(@__checkboxChange)

  __checkboxChange:()=>
    # isOK = $(".ui-checkbox").attr("checked")
    isOK = $('.ui-checkbox').prop("checked")
    @__prepareToSavePrivacy = isOK is false
    # @__g.localStorageManager.setPrivacy(isOK is false)

  __onTextFieldOnChange:(event) =>
    name = $(@__textInput).val()
    @__prepareToSaveNickName = name
    # @__g.localStorageManager.setName(name)
      
  __handleButtonEvent:(mouseEvent)->
    super
    button = mouseEvent.currentTarget
    if $(button).hasClass "button-apply"
      @__applySavedData()
      if @__g.localStorageManager.isProfileValid()
        @__g.navigationBar.goBack()
      else
        @__g.rootViewController.alert {message:"Your player profile is incomplete!"}
    # @__removeInteractivity()

  __dropdownChange:(event) =>
    dropdownView = event.data.currentTarget
    index = event.data.index
    dataValue = $(dropdownView.getDomNode()).find("a").eq(index).attr("data-value")
    if $(dropdownView.getDomNode()).hasClass("ui-dropdown-age")
      @__prepareToSaveAge = parseInt(dataValue,10)
      # @__g.localStorageManager.setAge(parseInt(dataValue,10))
    else
      @__prepareToSaveGender = parseInt(dataValue,10)
      # @__g.localStorageManager.setGender(parseInt(dataValue,10))


  __dropdownOpen:(event) =>
    dropdownView = event.data.currentTarget
    for d in @__uiDropdownViews
      if d isnt dropdownView && d.isOpen() is true
        d.close()


  __applySavedData: ->
    if @__prepareToSaveNickName?
      @__g.localStorageManager.setName(@__prepareToSaveNickName)
    if @__prepareToSaveAge?
      @__g.localStorageManager.setAge(@__prepareToSaveAge)
    if @__prepareToSaveGender?
      @__g.localStorageManager.setGender(@__prepareToSaveGender)
    if @__prepareToSavePrivacy?
      @__g.localStorageManager.setPrivacy(@__prepareToSavePrivacy)

  # __setInitStyle:()->
  #   $(@__domNode).css("opacity","0")
  #   slideOffsetX = 50
  #   if @__g.rootViewController.isAnimatingForward() is false
  #     slideOffsetX *= -1
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   for element in elements
  #     TweenMax.set(element, {x:slideOffsetX, opacity:0, force3D:true})
  #     index++

  # __cueIntroAnimation:()->
  #   TweenMax.to(@__domNode, 1, {opacity:1, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeOut})
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   length = elements.length
  #   for element in elements
  #     TweenMax.to(element, 0.75, {x:0, opacity:1, delay:index * 0.05, ease:Expo.easeOut})
  #     index++

  # __cueOutroAnimation:()->
  #   TweenMax.to(@__domNode, 0.5, {opacity:0, onStart:@__animationStart, onComplete:@__animationEnd, ease:Expo.easeIn})
  #   slideOffsetX = -50
  #   if @__g.rootViewController.isAnimatingForward() is false
  #     slideOffsetX *= -1
  #   index = 0
  #   elements = $(@__domNode).find(".animation-slide")
  #   length = elements.length

  #   $(@__domNode).find(".animation-slide").css({"-webkit-transform":"translate3d(0px, 0px, 0px)", "transform":"translate3d(0px, 0px, 0px)"})
  #   setTimeout ()=>
  #     for element in elements
  #     #TweenMax.set(element, {x:0, opacity:1, force3D:true})
  #       TweenMax.to(element, 0.375, {x:slideOffsetX, opacity:0, delay:((length-1)-index) * 0.025, ease:Expo.easeIn})
  #       index++
  #   ,0

  # __animationEnd:()=>
  #   $(@__domNode).find(".animation-slide").css({"-webkit-transform":"none", "transform":"none"})
  #   super



  #PUBLIC
  #_______________________________________________________________________________________
    


  introStart:()->
    super
    #advise navigation bar
    @__g.navigationBar.drawNavigationButtons(["back"])
    
    timeout = if @__g.colourManager.getCurrentColour() is masquerade.ColourManager.BLUE then 100 else 1000
    @__fadeColorTo(masquerade.ColourManager.BLUE)

    @__uiDropdownViews = []
    dropdownView = undefined
    dropdownContentString = ''
    selectedClass = ''
    index = 0
    isAgeDropDown = false
    localStorageValue = undefined
    itemValue = undefined
    $(".ui-dropdown-input").addClass("enabled")
    for dropdown in @__domNode.getElementsByClassName("ui-dropdown")
      if $(dropdown).hasClass("ui-dropdown-age")
        isAgeDropDown = true
      else
        isAgeDropDown = false
      for listItem in dropdown.getElementsByTagName("a")
        if isAgeDropDown
          localStorageValue = parseInt(@__g.localStorageManager.getAge())
        else
          localStorageValue = parseInt(@__g.localStorageManager.getGender())
        itemValue = parseInt($(listItem).attr("data-value"))
        if itemValue is localStorageValue
          $(listItem).addClass("selected")
      dropdownView = new masquerade.UIDropdownView({domNode:dropdown})
      dropdownView.addEventListener(masquerade.UIDropdownView.CHANGE,@__dropdownChange)
      dropdownView.addEventListener(masquerade.UIDropdownView.OPEN,@__dropdownOpen)
      @__uiDropdownViews.push(dropdownView)

    $(@__domNode).find(".ui-checkbox").prop("checked", not @__g.localStorageManager.getPrivacy())

    setTimeout ()=>
      @__cueIntroAnimation()
    ,timeout

  outroStart:()->
    super
    #@__domNode.classList.add("fadeOutEnable")
    setTimeout ()=>
      @__cueOutroAnimation()
    ,0

  screenEnd:()->
    super

