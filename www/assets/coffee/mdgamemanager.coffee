#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')






class masquerade.MDGameManager extends display.EventDispatcher

  __g:masquerade.Globals
  __isSingleRound:false
  __isComplete:false  #show denote the game has come to its full conclusion
  __roundResult:false
  __roundIndex:0
  __roundQuestionAnswers:[]
  __questionIndex:0
  __heartbeatMS:3000
  __pin:""
  __guid:""
  __phaseIndex:-1
  __characteristic:""
  __players:[]
  __isCreator:false
  __isPrivate:true
  __useNodeServer:false
  # __useNodeServer:false
  __nodeServerHost:"192.168.1.2" #HOME
  # __nodeServerHost:"192.168.128.69" #WORK
  __nodeServerPort:"6789"
  # __liveServerHost: "192.168.128.97" #// Remals Machine
  # __liveServerHost: "stoneywheezy.chapter.dom:9000"
  # __liveServerHost: "dev.masquerade.cfuni.hosting.sequence.co.uk"
  __liveServerHost: "live.masquerade.cfuni.hosting.sequence.co.uk"
  __heartbeatTimeout:0
  __textLimit:150
  __isInActiveGame:false  #shows if player is in active play, joined and server not in phaseIndex-8 (killed)
  __hasAcknowledgedRole:false
  __hasAcknowledgedCharacteristic:false
  __order:["pretender", "non-pretender"]
  __resetIgnoreRemainingResponses:false   #this allows us when on to cull any unwanted incoming server responses
  __responseHistory:[]
  __wasQuit:false
  __hasEnded:false
  __actionTimeout:20000





  constructor: (domNode)->
    super
    @__init()






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    @__guid = @__g.guid

  __randomiseRolePosition:()->
    r = true if Math.random() > 0.5
    if r
      @__order = ["pretender", "non-pretender"]
    else
      @__order = ["non-pretender", "pretender"]

  getAnswerAtPositionWithIndex:(isLeft, index)->
    if isLeft
      role = @__order[0]
    else
      role = @__order[1]
    for answer in @__roundQuestionAnswers[index].answers
      if @getGUIDRole(answer.guid) is role
        return answer.answer

  __cullCallsToServer:()->
    @__resetIgnoreRemainingResponses = true
    clearTimeout(@__heartbeatTimeout)
    #this seems to cause a lot of problems, one in that it generates an ajax error it self
    # if @__responseHistory.length > 0
    #   @__responseHistory[@__responseHistory.length - 1].ajax.abort()

  __getRandomAlphaString: (length) ->
    a = 'abcdefghijklmnopqrstuvwxyz'
    r = 0
    d = length
    str = ""
    while d--
      r = Math.floor(Math.random() * a.length)
      str += a[r]
    return str

  __s4: () ->
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    # return @__getRandomAlphaString(4)

  __generateGUID: () ->
    str = @__s4() + @__s4() + @__s4() + @__s4()
    return str

  __trim:(str) ->
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')

  __getResponseDataWithResponseID:(responseID) ->
    d = @__responseHistory.length
    while d--
      if @__responseHistory[d].query.responseID is responseID
        return @__responseHistory[d]


  __sendCallToServer: (callString, query) ->

    #generate a response ID so we can track the server calls and ignore everything but the last made
    query.responseID = @__generateGUID()
    responseObject = {query:query, callString:callString}
    @__responseHistory.push(responseObject)
    if @__responseHistory.length > 100
      @__responseHistory.shift()
    #$outputElement = $("." + selector + " .output-result")
    @__resetIgnoreRemainingResponses = false  #un-choke server commuincation


    if @__useNodeServer is false

      url = "http://#{@__liveServerHost}/api/game/"
      switch callString
        when "getState"
          #http://masqueradeserver/api/game/getstate/3nYbjSzY
          url += "getstate/#{query.responseID}/#{query.pin}"

        when "createGame"
          #http://masqueradeserver/api/game/create/48a32d21fb8b531c/400/true
          url += "create/#{query.responseID}/#{query.guid}/#{query.textLimit}/#{query.isSingleRound}"

        when "joinGame"
          #http://masqueradeserver/api/game/join/9d19aebbc58cf68f/3nYbjSzY/Tomos%20Hornsby/false
          #http://masqueradeserver/api/game/join/3213213/9d19aebbc58cf68f/3nYbjSzY/Tomos%20Hornsby/false/21/male
          playerName = encodeURIComponent(@__trim(query.playerName))
          playerAge = encodeURIComponent(query.age)
          playerGender = encodeURIComponent(@__trim(query.gender))
          url += "join/#{query.responseID}/#{query.guid}/#{query.pin}/#{playerName}/#{query.privacy}/#{playerAge}/#{playerGender}"

        when "confirmRoles"
          #http://masqueradeserver/api/game/ConfirmRoles/3nYbjSzY/48a32d21fb8b531c/9d19aebbc58cf68f/57e7bad414bee7c5
          url += "ConfirmRoles/#{query.responseID}/#{query.pin}/#{query.judge}/#{query.nonPretender}/#{query.pretender}"

        when "confirmCharacteristic"
          #http://masqueradeserver/api/game/ChooseCharacteristic/3nYbjSzY/A%20Designer
          characteristic = encodeURIComponent(@__trim(query.characteristic))
          url += "ChooseCharacteristic/#{query.responseID}/#{query.pin}/#{characteristic}"

        when "confirmReadyToAnswer"
          #http://masqueradeserver/api/game/confirmReadyToAnswer/3nYbjSzY/57e7bad414bee7c5
          url += "confirmReadyToAnswer/#{query.responseID}/#{query.pin}/#{query.guid}"

        when "enterQuestion"
          #http://masqueradeserver/api/game/EnterQuestion/3nYbjSzY/Hi%20s
          question = encodeURIComponent(@__trim(query.question))
          url += "EnterQuestion/#{query.responseID}/#{query.pin}/#{question}"

        when "enterAnswer"
          #http://masqueradeserver/api/game/enteranswer/3nYbjSzY/57e7bad414bee7c5/34/Efans%20answer
          answer = encodeURIComponent(@__trim(query.answer))
          url += "enteranswer/#{query.responseID}/#{query.pin}/#{query.guid}/#{query.bonus}/#{answer}"

        when "makeAGuess"
          #http://masqueradeserver/api/game/makeguess/3nYbjSzY/57e7bad414bee7c5
          url += "makeguess/#{query.responseID}/#{query.pin}/#{query.guess}"

        when "askAnotherQuestion"
          #"http://masqueradeserver/api/game/askanotherquestion/response234/BDE7B/guid123"
          url += "askanotherquestion/#{query.responseID}/#{query.pin}/#{query.guid}"

        when "nextRound"
          #TODO Next Round
          #"http://masqueradeserver/api/game/nextround/response234/BDE7B/guid444"
          url += "nextround/#{query.responseID}/#{query.pin}/#{query.guid}"

        when "quitGame"
          #http://masqueradeserver/api/game/quit/32321323/BDE7B/guid123
          url += "quit/#{query.responseID}/#{query.pin}/#{query.guid}"

        when "leaveGame"
          #"http://masqueradeserver/api/game/leave/response345/BDE7B/guid123"
          url += "leave/#{query.responseID}/#{query.pin}/#{query.guid}"

      options =
        type: 'GET',
        url: url,
        async: false,
        timeout:@__actionTimeout,
        jsonpCallback: "jsonCallback#{query.responseID}",
        contentType: "application/json",
        dataType: 'jsonp',
        success: @__sendCallToServerSuccess,
        error: @__sendCallToServerError
      if callString isnt "getState"
        console.log url
      responseObject.ajax = $.ajax options

    else
      #for debugging add a latency to query to be used by server
      minLatency = 0.2
      maxLatency = 2
      if @__g.latencyDelay is 0
        query.seconds = minLatency + (Math.random() * (maxLatency - minLatency))#@__g.latencyDelay
      else
        query.seconds = @__g.latencyDelay
      
      url = "http://" + @__nodeServerHost + ":" + @__nodeServerPort + "/#{callString}/"
      options =
        type: 'GET',
        url: url,
        async: false,
        timeout:@__actionTimeout,
        jsonpCallback: "jsonCallback#{query.responseID}",
        contentType: "application/json",
        dataType: 'jsonp',
        data: query,
        success: @__sendCallToServerSuccess,
        error: @__sendCallToServerError
      responseObject.ajax = $.ajax options

    responseObject.url = url
    @dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER, responseObject))


  __sendDataToServerSuccess:(json, resultString, o)=>
    @__g.debug "mdgm __sendDataToServerSuccess"


  # __sendCallToServerError:(e)=>
  #   @__g.debug "mdgm __sendCallToServerError"


  __sendCallToServerSuccess:(json, resultString, o)=>

    #Response checking
    #check response Object from hash table and save json, if response is not the last one expected then ignore
    #save the data anyway for debugging
    responseObject = @__getResponseDataWithResponseID(json.responseID)

    if responseObject is undefined
      # Sometimes the json.responceID returns "The underlying provider failed on Open.Unable to connect to any of the specified MySQL hosts."
      # this obviously can't get any response data

      if typeof(json.responseID) == "string"
        code = 102
        message = masquerade.MDGameManager["RESPONSE_CODE_#{code}"] + " #{json.responseID}"
      else
        code = 101
        responseID = String(json.responseID)
        message = masquerade.MDGameManager["RESPONSE_CODE_#{code}"] + " #{responseID}"

      @__g.debug "mdgm __sendCallToServerSuccess Responce ERROR:#{code}"
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:message, code:code}))
      return false

    else
      responseObject.response = json

    if json.responseID is undefined
      console.log json

    if @__responseHistory[@__responseHistory.length - 1].query.responseID isnt json.responseID
      
      @__g.debug "mdgm ignored response query:"+JSON.stringify(responseObject.query) + " and json" + JSON.stringify(responseObject.response)
      @dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS))
      return false
    #check trap to ignore any incoming responses if MDGM has been reset
    if @__resetIgnoreRemainingResponses
      @__g.debug "mdgm ignore all remaining response"
      @dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS))
      return false
    #clear any timeout that is about to happen to minimise stress on server
    clearTimeout(@__heartbeatTimeout)
    #this may not been needed as heartbeat is
    @dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS))
  
  
    code = parseInt(json.responseCode)
    if code is 3 or code is 4
      #game error
      @__g.debug "mdgm __sendCallToServerSuccess Responce ERROR:#{json.responseCode}"
      #@reset()
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:masquerade.MDGameManager["RESPONSE_CODE_#{code}"], code:code}))
      
    if code is 2 or code is 5 or code is 6 or code is 7 or code is 8
      @__g.debug "mdgm __sendCallToServerSuccess Responce ERROR:#{json.responseCode}"
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:masquerade.MDGameManager["RESPONSE_CODE_#{code}"], code:code}))

    if code is 10
      #game has ended
      @__g.debug "mdgm __sendCallToServerSuccess Responce ENDED:#{json.responseCode}"
      @__wasQuit = true
      # @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER))
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:masquerade.MDGameManager["RESPONSE_CODE_#{code}"], code:code}))
    #need to check with Remal about how this might work
    if code is 11
      @__g.debug "mdgm __sendCallToServerSuccess Responce ENDED:#{json.responseCode}"
      #@__hasEnded = true
      #@reset()
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:masquerade.MDGameManager["RESPONSE_CODE_#{code}"], code:code}))
    
      #how to we handle
      # 1. an attempt to join a game that has already ended, this is an error
        #display message as above
      # 2. a response back from a game where a player has informed they have left it
        #if reset is called immediaely after then response will be ingnored so no message
      # 3. a response back that informs the game has been killed
        #no reset as RVC may be animating
        #hmmmm maybe have to


    if code is 1
      #only process if response is 1
      # 1. Try to update state
      # 2. If joined set up another heart beat
      # 3. If Updated dispatch event

      hasUpdated = false
      hasUpdated = true if @__setPin(json.pin)
      hasUpdated = true if @__setTextLimit(json.textLimit)
      hasUpdated = true if @__setIsSingleRound(json.isSingleRound)
      hasUpdated = true if @__setRoundIndex(json.roundIndex)
      hasUpdated = true if @__setIsComplete(json.isComplete)
      hasUpdated = true if @__setCharacteristic(json.characteristic)
      hasUpdated = true if @__setQuestionIndex(json.questionIndex)
      hasUpdated = true if @__setRoundResult(json.roundResult)
      hasUpdated = true if @__setPhaseIndex(json.phaseIndex)
      hasUpdated = true if @__setRoundQuestionAnswers(json.roundQuestionAnswers)
      hasUpdated = true if @__setPlayers(json.players)

      #begin heart beat once player has joined the game, so miss if player has not
      if @hasJoined() and @__phaseIndex isnt 8
        @__isInActiveGame = true
        @__heartbeatTimeout = setTimeout @__getServerState, @__heartbeatMS
        @__g.debug("mdgm __sendCallToServerSuccess()")

      #else
        #set to false if game is quite or finished, when rejoined needs to resume
        #@__isInActiveGame = false
        #clear out the saved pin and active state so a killed game is ignored if returned
        #@clearLocalStorageGameData()
        #don't clean up MDGM as RVC may need state after animation
        #@reset()

      @dispatchEvent(new events.Event(masquerade.MDGameManager.HEART_BEAT))
      if hasUpdated
        @__g.debug "mdgm updated json "+ JSON.stringify(json)
        @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER))
  

  # Event on ajax error dispatched from ajax object
  #
  # @rivate
  # @param {Object} xhr Browser xhr object
  # @param {String} errorType
  # @param {?} error
  #
  __sendCallToServerError:(xhr, errorType, error)=>
    @__g.debug "mdgm __sendCallToServerError:#{errorType}"
    code = 0
    if errorType == "timeout"
      code = 100
    #hold off reseting, allow the UI to redirect back to home and then users may reconnect
    #@reset()

    @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {message:masquerade.MDGameManager["RESPONSE_CODE_#{code}"], code:code}))
    return


  __getServerState:() =>
    #@__pin = $("#game-pin").val()
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "getState", query




  __setPin:(pin)->
    if pin isnt undefined and pin isnt @__pin
      @__pin = pin
      @__g.localStorageManager.setActivePin(@__pin)
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PIN))
      return true
    return false

  __setPhaseIndex:(phaseIndex)->
    if phaseIndex isnt undefined and phaseIndex isnt @__phaseIndex
      @__phaseIndex = phaseIndex
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PHASE_INDEX))
      return true
    return false

  __setRoundIndex:(roundIndex)->
    if roundIndex isnt undefined and roundIndex isnt @__roundIndex
      @__roundIndex = roundIndex
      # reset acknowledged role
      @__hasAcknowledgedRole = false
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ROUND_INDEX))
      return true
    return false

  __setQuestionIndex:(questionIndex)->
    if questionIndex isnt undefined and questionIndex isnt @__questionIndex
      @__questionIndex = questionIndex
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_QUESTION_INDEX))
      return true
    return false

  __setCharacteristic:(characteristic)->
    if characteristic is null
      characteristic = ""
    if characteristic isnt undefined and characteristic isnt @__characteristic
      @__characteristic = characteristic
      #do this every round, setting charateristic is done every round
      @__randomiseRolePosition()
      #this need to be reset for every round
      @__hasAcknowledgedCharacteristic = false
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_CHARACTERISTIC))
      return true
    return false

  __setPlayers:(players)->
    if players isnt undefined and JSON.stringify(players) isnt JSON.stringify(@__players)
      @__players = players
      @__g.localStorageManager.setIsInActiveGame(@hasJoined())
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PLAYERS))
      return true
    return false

  __setRoundQuestionAnswers:(roundQuestionAnswers)->
    if roundQuestionAnswers is null
      roundQuestionAnswers = []
    if roundQuestionAnswers isnt undefined and JSON.stringify(roundQuestionAnswers) isnt JSON.stringify(@__roundQuestionAnswers)
      @__roundQuestionAnswers = roundQuestionAnswers
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_QUESTIONS_AND_ANSWERS))
      return true
    return false

  __setIsSingleRound:(isSingleRound)->
    #convert to boolean
    isSingleRound = JSON.parse(isSingleRound)
    if isSingleRound isnt undefined and isSingleRound isnt @__isSingleRound
      @__isSingleRound = isSingleRound
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_IS_SINGLE_ROUND))
      return true
    return false

  __setRoundResult:(roundResult)->
    if roundResult isnt undefined and roundResult isnt @__roundResult
      @__roundResult = roundResult
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ROUND_RESULT))
      return true
    return false

  __setIsComplete:(isComplete)->
    if isComplete isnt undefined and isComplete isnt @__isComplete
      @__isComplete = isComplete
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_IS_COMPLETE))
      return true
    return false

  __setTextLimit:(textLimit)->
    if textLimit isnt undefined and textLimit isnt @__textLimit
      @__textLimit = textLimit
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_TEXT_LIMIT))
      return true
    return false





  #PUBLIC METHODS
  #_______________________________________________________________________________________

  reconnect: () ->
    @__pin = @__g.localStorageManager.getActivePin()
    @__getServerState()

  createGame: () ->
    @__g.debug "mdgm createGame()"
    @__isCreator = true #TODO is this important, will this be updated when player presses play again and becomes the creator, er no
    @__isSingleRound = @__g.isSingleRound
    @__characterLimit = @__g.localStorageManager.getCharacterLimit()
    query =
      guid: @__guid
      textLimit: @__g.localStorageManager.getCharacterLimit()
      isSingleRound: @__g.isSingleRound
    @__sendCallToServer "createGame", query

  joinGame: (pin) ->
    @__g.debug "mdgm joinGame()"
    query =
      guid: @__guid
      pin: pin
      privacy: @__g.localStorageManager.getPrivacy()
      playerName: @__g.localStorageManager.getName()
      age: @__g.localStorageManager.getAgeString(@__g.localStorageManager.getAge())
      gender: @__g.localStorageManager.getGenderString(@__g.localStorageManager.getGender())
    @__sendCallToServer "joinGame", query

  confirmRoles: (judgeGUID, nonPretenderGUID, pretenderGUID) ->
    @__g.debug "mdgm confirmRoles()"
    query =
      guid: @__guid
      pin: @__pin
      judge: judgeGUID
      nonPretender: nonPretenderGUID
      pretender: pretenderGUID
    @__sendCallToServer "confirmRoles", query

  confirmCharacteristic: (characteristic) ->
    @__g.debug "mdgm confirmCharacteristic()"
    query =
      guid: @__guid
      pin: @__pin
      characteristic: characteristic
    @__sendCallToServer "confirmCharacteristic", query

  enterQuestion: (question) ->
    @__g.debug "mdgm enterQuestion()"
    query =
      guid: @__guid
      pin: @__pin
      question: question
    @__sendCallToServer "enterQuestion", query

  confirmReadyToAnswer:() ->
    @__g.debug "mdgm confirmReadyToAnswer()"
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "confirmReadyToAnswer", query

  enterAnswer: (answer, bonus) ->
    @__g.debug "mdgm enterAnswer()"
    query =
      guid: @__guid
      pin: @__pin
      answer: answer
      bonus: bonus
    @__sendCallToServer "enterAnswer", query

  makeAGuess: (guessIsLeft) ->
    @__g.debug "mdgm makeAGuess()"
    role = ""
    if guessIsLeft
      role = @__order[0]
    else
      role = @__order[1]
    guessGUID = @getRoleGUID(role)
    query =
      guid: @__guid
      pin: @__pin
      guess: guessGUID
      guessIsLeft: guessIsLeft
    @__sendCallToServer "makeAGuess", query

  askAnotherQuestion: () ->
    @__g.debug "mdgm askAnotherQuestion()"
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "askAnotherQuestion", query

  nextRound: () ->
    @__g.debug "mdgm nextRound()"
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "nextRound", query

  hasJoined: () ->
    for player in @__players
      if player.guid is @__guid
        return true
    return false

  setGUID: (guid)->
    @__guid = guid

  getRoleGUID:(roleString)->
    for player in @__players
      if player.role.toLowerCase() is roleString
        return player.guid
    return undefined

  getGUIDRole:(guid)->
    for player in @__players
      if player.guid is guid
        return player.role.toLowerCase()
    return undefined

  getGUIDName:(guid)->
    for player in @__players
      if player.guid is guid
        return player.name
    return undefined

  getRoleName:(roleString)->
    for player in @__players
      if player.role.toLowerCase() is roleString
        return player.name
    return undefined

  getGUIDIsReadyForNextRound:()->
    for player in @__players
      if player.guid is @__g.guid
        if player.readyForNextRound isnt undefined
          return player.readyForNextRound
    return false

  quitGame:()->
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "quitGame", query

  leaveGame:()->
    query =
      guid: @__guid
      pin: @__pin
    @__sendCallToServer "leaveGame", query

  shouldTryToRecconect:()->
    activePin = @__g.localStorageManager.getActivePin()
    isInActiveGame = @__g.localStorageManager.getIsInActiveGame()
    @__g.debug "mdgm shouldTryToRecconect() activePin:#{activePin} isInActiveGame:#{isInActiveGame}"
    if activePin isnt undefined and isInActiveGame
      return true
    else
      @reset()
      return false

  clearLocalStorageGameData:()->
    @__g.localStorageManager.clearActivePin()
    @__g.localStorageManager.setIsInActiveGame(false)

  getFinalScoreData:()->
    scoreData = [{name:"",score:0},{name:"",score:0},{name:"",score:0}]
    increment = 0
    if @__players.length > 0
      for player in @__players
        scoreData[increment].name = player.name
        scoreData[increment].score = Math.round(player.score)
        increment++
    scoreData.sort (a,b)->
      a.score - b.score
    
    return scoreData

  wasQuit:()->
    return @__wasQuit

  hasEnded:()->
    return @__hasEnded

  #used for debugging to get last repsonse
  getResponseHistoryLast:()->
    obj = {}
    if @__responseHistory.length > 0
      obj = @__responseHistory[@__responseHistory.length-1]
    return JSON.stringify(obj)



  #called when we navigate away from game on MDRoundGameOverScreen, and on user actively pressing the Join Game and Create Game button
  reset:()->
    @__wasQuit = false
    @__hasEnded = false
    @__isSingleRound = false
    @__isComplete = false
    @__roundResult = false
    @__roundIndex = 0
    @__roundQuestionAnswers = []
    @__questionIndex = 0
    @__pin = ""
    @__phaseIndex = -1
    @__characteristic = ""
    @__players = []
    @__isCreator = false
    @__isPrivate = true
    @__textLimit = @__g.localStorageManager.getCharacterLimit()
    @__isInActiveGame = false
    @__hasAcknowledgedRole = false
    @__hasAcknowledgedCharacteristic = false
    @__cullCallsToServer()
    @clearLocalStorageGameData()

  sendSingleDeviceGameData:(json)->
    if @__g.localStorageManager.getPrivacy() is false
      if @__useNodeServer is false
        url = "http://#{@__liveServerHost}/api/game/sendData/"
      else
        url = "http://" + @__nodeServerHost + ":" + @__nodeServerPort + "/sendData/"
          
      options =
        type: 'POST',
        url: url,
        async: false,
        timeout:10000,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        data: json,
        success: @__sendDataToServerSuccess,
        error: @__sendDataToServerError
      $.ajax options



  #PUBLIC GETTERS / SETTERS
  #_______________________________________________________________________________________
  isSingleRound: () ->
    return @__isSingleRound
  isCreator: () ->
    return @__isCreator
  getPin: () ->
    return @__pin
  getPhaseIndex: () ->
    return @__phaseIndex
  getRoundIndex: () ->
    return @__roundIndex
  getPlayers: () ->
    return @__players
  getIsComplete: () ->
    return @__isComplete
  getCharacteristic: () ->
    return @__characteristic
  getRoundResult: () ->
    return @__roundResult
  getRoundQuestionAnswers: () ->
    return @__roundQuestionAnswers
  getQuestionIndex: () ->
    return @__questionIndex
  getTextLimit: () ->
    return @__textLimit
  isActive:()->
    return @__isInActiveGame
  hasAcknowledgedCharacteristic:()->
    return @__hasAcknowledgedCharacteristic
  setHasAcknowledgedCharacteristic:(bool=true)->
    @__g.debug "mdgm setHasAcknowledgedCharacteristic()"
    hasUpdated = false
    if bool isnt @__hasAcknowledgedCharacteristic
      hasUpdated = true
    @__hasAcknowledgedCharacteristic = bool
    #if hasUpdated
      #@dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER))
    @confirmReadyToAnswer()
  hasAcknowledgedRole:()->
    return @__hasAcknowledgedRole
  setHasAcknowledgedRole:(bool=true)->
    @__g.debug "mdgm setHasAcknowledgedRole()"
    hasUpdated = false
    if bool isnt @__hasAcknowledgedRole
      hasUpdated = true
    @__hasAcknowledgedRole = bool
    if hasUpdated
      @dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER))
  
  hasAnsweredQuestion:()->
    if @__roundQuestionAnswers[@__questionIndex] isnt undefined
      if @__roundQuestionAnswers[@__questionIndex].answers isnt undefined
        if @__roundQuestionAnswers[@__questionIndex].answers.length > 0
          for answer in @__roundQuestionAnswers[@__questionIndex].answers
            if answer.guid is @__g.guid
              if answer.answer isnt ""
                return true
    return false


    






#PUBLIC CONSTANTS
#_______________________________________________________________________________________
masquerade.MDGameManager.UPDATED_PIN = "updatedPin"
masquerade.MDGameManager.UPDATED_PHASE_INDEX = "updatedPhaseIndex"
masquerade.MDGameManager.UPDATED_ROUND_INDEX = "updatedRoundIndex"
masquerade.MDGameManager.UPDATED_QUESTION_INDEX = "updatedQuestionIndex"
masquerade.MDGameManager.UPDATED_CHARACTERISTIC = "updatedCharacteristic"
masquerade.MDGameManager.UPDATED_PLAYERS = "updatedPlayers"
masquerade.MDGameManager.UPDATED_QUESTIONS_AND_ANSWERS = "updatedroundQuestionAnswers"
masquerade.MDGameManager.UPDATED_IS_SINGLE_ROUND = "updatedIsSingleRound"
masquerade.MDGameManager.UPDATED_ROUND_RESULT = "updatedRoundResult"
masquerade.MDGameManager.UPDATED_IS_COMPLETE = "updatedIsComplete"
masquerade.MDGameManager.UPDATED_TEXT_LIMIT = "updatedTextLimit"
masquerade.MDGameManager.UPDATED_SERVER = "updatedServer"
masquerade.MDGameManager.UPDATED_ERROR = "updatedError"
masquerade.MDGameManager.UPDATED_IS_READY_FOR_NEXT_ROUND = "updatedIsReadyForNextRound"

# known server errors
masquerade.MDGameManager.RESPONSE_CODE_0 = "Opps! there was a problem, please try again later"
masquerade.MDGameManager.RESPONSE_CODE_1 = "OK"
masquerade.MDGameManager.RESPONSE_CODE_2 = "GAME FULL"
masquerade.MDGameManager.RESPONSE_CODE_3 = "GAME NOT FOUND"
masquerade.MDGameManager.RESPONSE_CODE_4 = "PLAYER NOT FOUND"
masquerade.MDGameManager.RESPONSE_CODE_5 = "ROUND NOT INITIALISED"
masquerade.MDGameManager.RESPONSE_CODE_6 = "QUESTION NOT INITIALISED"
masquerade.MDGameManager.RESPONSE_CODE_7 = "ANSERS NOT ENOUGH"
masquerade.MDGameManager.RESPONSE_CODE_8 = "PLAYER HAS ALREADY ANSWERED"
masquerade.MDGameManager.RESPONSE_CODE_9 = "GAME HAS ENDED"
masquerade.MDGameManager.RESPONSE_CODE_10 = "GAME IS COMPLETE"

# internal errors
masquerade.MDGameManager.RESPONSE_CODE_100 = "Opps timeout! Please ensure you have a healthy netwwork connection."
masquerade.MDGameManager.RESPONSE_CODE_101 = "Opps! Unrecognised response ID"
masquerade.MDGameManager.RESPONSE_CODE_102 = "Opps server error!"


masquerade.MDGameManager.CREATE_GAME_COMPLETE = "createGameComplete"
masquerade.MDGameManager.JOIN_GAME_COMPLETE = "joinGameComplete"
masquerade.MDGameManager.HEART_BEAT = "heartbeat"
masquerade.MDGameManager.SEND_TO_SERVER = "sendToServer"
masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS = "sendToServerSuccess"

masquerade.MDGameManager.ROLE_JUDGE = "judge"
masquerade.MDGameManager.ROLE_PRETENDER = "pretender"
masquerade.MDGameManager.ROLE_NON_PRETENDER = "non-pretender"



# masquerade.InteractiveElement.OUTRO_START = "outroStart"
# masquerade.InteractiveElement.OUTRO_COMPLETE = "outroComplete"
# masquerade.InteractiveElement.BUTTON_CLICK = "buttonClick"
# masquerade.InteractiveElement.NAVIGATE_TO = "navigateTo"

# masquerade.InteractiveElement.ANIMATION_MODE_IN = "animationIn"
# masquerade.InteractiveElement.ANIMATION_MODE_OUT = "animationOut"
# masquerade.InteractiveElement.ANIMATION_MODE_NONE = "animationNone"
