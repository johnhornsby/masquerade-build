masquerade = Namespace('SEQ.masquerade')

class masquerade.Masquerade

  __globals:{}
  __rootViewController:{}

  constructor: ()->
    @__init()



  #PRIVATE
  #________________________________________________________________________
  __init:() ->
    document.addEventListener("deviceready",@__onDeviceReady,false)
    $ ()->
      window.log "ready"
      $('body').on("load",()->
        window.log "loaded"
      )

  __onDeviceReady: () =>
    window.log "Device Ready"
    @__globals = masquerade.Globals
    @__globals.isDebugging = false
    @__globals.statusBarOffset = 0
    @__globals.osVersion = 0
    @__globals.platform = "0"
    if window.device isnt undefined
      @__globals.osVersion = parseFloat(window.device.version)
      @__globals.platform = window.device.platform.toLowerCase()
      @__globals.statusBarOffset = 20
      @__globals.debug "Platform:#{@__globals.platform} Version:#{@__globals.osVersion}"
      #inset viewport tag, removed for android as this uses custom native Java to scale viewport, this is inserted into Masquerade.java,
      #for ios we simple add the tag in here.
      if @__globals.platform is "ios"
        $("title").before('<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />')
    @__globals.showPlaceholderData = false
    @__globals.useTweenMax = true
    @__globals.tweenMaxInTime = 0.15
    @__globals.tweenMaxOutTime = 0.15
    @__globals.latencyDelay = 0
    @__globals.isMultiDevice = false
    @__globals.localStorageManager = new masquerade.LocalStorageManager()
    @__globals.translationManager = new masquerade.TranslationManager()
    @__globals.translationManager.addEventListener(masquerade.TranslationManager.DATA_LOAD_COMPLETE, @__translationLoadComplete)
    @__globals.guid = @__globals.localStorageManager.getGUID()
    @__globals.gameManager = new masquerade.GameManager()
    @__globals.mdGameManager = new masquerade.MDGameManager()
    @__globals.colourManager = new masquerade.ColourManager()
    @__rootViewController = new masquerade.RootViewController()
    @__globals.rootViewController = @__rootViewController
    @__globals.translationManager.load()


  #   $(".select-guid").change(@__onChangeGUID)
  #   @__globals.guid = $(".select-guid").val()
  #   @__globals.mdGameManager.setGUID(@__globals.guid)
    
  # __onChangeGUID: ()=>
  #   @__globals.guid = $(".select-guid").val()
  #   @__globals.mdGameManager.setGUID(@__globals.guid)

  __translationLoadComplete: ()=>
    @__rootViewController.beginGame()

app = new masquerade.Masquerade()
SEQ.app = app #provide global access for debugging
