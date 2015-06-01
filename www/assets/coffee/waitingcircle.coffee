masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')

class masquerade.WaitingCircle extends display.EventDispatcher


  __g:masquerade.Globals
  __canvasID:""
  __canvas:{}
  __stage:{}
  __strokeWidth:4
  __circleBottom:{}
  __circleTop:{}
  __radius:0
  __increment:0
  __isFlip:false
  __startAngle:0
  __endAngle:0
  __scale:0
  __width:0
  __step:0.001
  __scaleFactor: 0



  constructor: (@__canvasID) ->
    @__init()
    #Create a stage by getting a reference to the canvas
    




  #PRIVATE
  #_______________________________________________________________________________________
  __init:()->

    element = $("#wrapper > .screen").get(0)

    paddingLeftInt = parseInt($(element).css("padding-left").replace(/[^-\d\.]/g, ''))
    width = $(element).width() - (paddingLeftInt * 2)
    if $(document).width() < 500
      maxWidth = 220
      @__strokeWidth = 3
    else
      maxWidth = 400
      @__strokeWidth = 4


    width = Math.min(width, maxWidth)
    #canvasWidth = $("#" + @__canvasID).parent().width()


    @__scaleFactor = 1
    if @__g.platform is "ios"
      @__scaleFactor = 2

    canvasWidth = width * @__scaleFactor

    $("#" + @__canvasID).attr("width","#{canvasWidth}px").attr("height","#{canvasWidth}px")
    $("#" + @__canvasID).css({'width':"#{width}", 'height':"#{width}"})
    @__stage = new createjs.Stage(@__canvasID)
    createjs.Ticker.setFPS(50)
    #@__width = $("#waiting-for-server").width()

    @__width = canvasWidth
    @__radius = (@__width) / 2
    @__container = new createjs.Container()
    # @__container.x = @__width / 2
    # @__container.y = @__width / 2
    @__circleBottom = new createjs.Shape()
    @__circleBottom.graphics.setStrokeStyle(@__strokeWidth * @__scaleFactor,"butt").beginStroke("rgba(0, 0, 0, 0.1)")
    @__circleBottom.graphics.arc(0, 0, (@__radius) - ((@__strokeWidth * @__scaleFactor) / 2), 0, Math.PI * 2)
    @__container.addChild(@__circleBottom)
    @__circleTop = new createjs.Shape()
    @__circleTop.graphics.setStrokeStyle(@__strokeWidth * @__scaleFactor,"butt").beginStroke("#FFFFFF")
    @__circleTop.graphics.arc(0, 0, (@__radius) - ((@__strokeWidth * @__scaleFactor) / 2), 0, 0)
    @__container.addChild(@__circleTop)

    #@__circle.setTransform(@__circle.x, @__circle.y, 0.5, 0.5)
    @__stage.addChild(@__container)
    @__increment -= @__step
    @__container.setTransform(@__width / 2, @__width / 2, 1, 1)
    @__tick()
    
  __tick:()=>
    @__circleTop.graphics.clear()
    @__increment += @__step
    # if @__increment > 2 - @__step
      # window.log "chjeck"
    if @__increment > 2
      @__isFlip = @__isFlip is false
      @__increment = @__increment - 2
    if @__isFlip
      @__endAngle = 0
      if @__increment > 2 - @__step
        # window.log "chjeck"
        @__startAngle = 0
        @__endAngle = 0
      else
        @__startAngle = @__increment
    else
      @__startAngle = 0
      @__endAngle = @__increment
    @__circleTop.graphics.setStrokeStyle(@__strokeWidth * @__scaleFactor,"butt").beginStroke("#FFFFFF")
    @__circleTop.graphics.arc(0, 0, (@__radius) - ((@__strokeWidth * @__scaleFactor) / 2), Math.PI * @__startAngle, Math.PI * @__endAngle)
    @__stage.update()

  __in: () =>
    #@__container.setTransform(@__width/2, @__width/2, @__scale, @__scale)

  __complete: ()=>




  #PUBLIC
  #_______________________________________________________________________________________
  stop:()->
    createjs.Ticker.removeEventListener("tick", @__tick)
    #Animator.removeTween(this, {__scale:1, time:1, onUpdate:@__in, onComplete:@__complete, transition:"easeOutBack"})

  start:()->
    createjs.Ticker.addEventListener("tick", @__tick)
    #Animator.addTween(this, {__scale:1, time:1, onUpdate:@__in, onComplete:@__complete, transition:"easeOutBack"})


