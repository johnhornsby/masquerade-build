masquerade = Namespace('SEQ.masquerade')

class masquerade.GameManager

  __g:masquerade.Globals
  __playerOrderArray:[]
  __turnIndex:0
  __questionIndex:0
  __phaseIndex:0
  __roundIndex:0
  __playerNames:[]
  __playerData:{}
  __gameData:{}
  __playerABeforeB:true
  __is3RoundMode:true
  __isGameOver:false
  __mode:""
  __scoreValues: 
    "judgeWonBonus":50
    "quickAnswerBonusSeconds":60
    "quickAnswerBonus":10
    "quickGuessScorePot":100
    "quickGuessScorePotMultiplier":0.75
    "remainingIncognitoTurnMultiplier":2
    "pretenderWonBonus":50
    "nonPretenderRoundBonus":0
  __quickGuessScore:0
  __roles:["judge","pretender","non-pretender"]
  __data:{}


  constructor: ()->
    @__init()

  __init:() ->
    @__g = masquerade.Globals
    @__loadData()
    
  __loadData:()->
    $.getJSON('data/data.json', @__onLoadDataComplete)
    # $.ajax
    #   type: "GET"
    #   url: "/data/data.json"
      
    #   # type of data we are expecting in return:
    #   dataType: "json"
    #   timeout: 300
    #   success: (data) ->
    #     alert "loaded JSON"

    #   error: (xhr, type) ->
    #     alert "Ajax error!"


  __onLoadDataComplete:(data)=>
    @__data = data

  __gameOver:()->
    @__isGameOver = true

  __getUniqueArrayValues:(a1,a2)->
    a3 = []
    for v in a2
      if a1.indexOf(v) is -1
        a3.push(v)
    return a3


  #PUBLIC
  #_______________________________________________________________________________________

  newGame:(mode) ->
    @__mode = mode
    @__playerOrderArray = []
    @__turnIndex = 0
    @__phaseIndex = 0
    @__questionIndex = 0
    @__roundIndex = -1
    @__playerNames = []
    @__playerData = {}
    @__gameData = {rounds:[]}
    @__is3RoundMode = if (mode is masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) then true else false
    @__isGameOver = false
    @__scoreValues.quickGuessScorePot = 100
    @__quickGuessScore = @__scoreValues.quickGuessScorePot
    @newRound()

  newRound:() ->
    @__playerABeforeB = new Boolean(Math.round(Math.random())).valueOf()
    window.log "Player A Before B, hence Pretender on left:" + @__playerABeforeB
    if @__mode is masquerade.GameManager.GAME_OPTION_THREE_ROUNDS
      if @__roundIndex+1 < 3
        @__roundIndex++
        @__phaseIndex = 0
        @__questionIndex = 0
    else
      if @__roundIndex+1 < 1
        @__roundIndex++

  setPlayerNames:(player1,player2,player3)->
    @__playerNames = [player1,player2,player3]
    @__playerData[@__playerNames[0]] = {name:player1,rounds:[],roles:$.extend([],@__roles)}
    @__playerData[@__playerNames[1]] = {name:player2,rounds:[],roles:$.extend([],@__roles)}
    @__playerData[@__playerNames[2]] = {name:player3,rounds:[],roles:$.extend([],@__roles)}

  #Roles set, order of arguments in order of playerData, as names were entered
  setPlayerRoles:(role1,role2,role3)->
    #need to add round
    player = undefined
    for player of @__playerData
      if @__playerData[player].rounds.length <= @__roundIndex
        @__playerData[player].rounds[@__roundIndex] = {role:undefined,qas:[],score:0}

    index = 0
    for role in arguments
      player = @__playerData[@__playerNames[index]]
      #--Protective Patch to ensure if this function is called twice in one round that the 
      #--soon to be spliced role is put back into the roles array, to be spliced again
      if player.rounds[@__roundIndex].role != undefined
        player.roles.push(player.rounds[@__roundIndex].role)
      #--
      player.rounds[@__roundIndex].role = role              #assign to current round role
      player.roles.splice(player.roles.indexOf(role),1)     #remove role from available roles
      index++

    @__playerOrderArray = []
    for player of @__playerData
      switch @__playerData[player].rounds[@__roundIndex].role
        when "judge"
          @__playerOrderArray[0] = @__playerData[player]
        when "pretender"
          @__playerOrderArray[1] = @__playerData[player]
        when "non-pretender"
          @__playerOrderArray[2] = @__playerData[player]

  #returns an array of uniqie roles from the available ones for each player 
  getAutoCompletedRoles:()->
    a = []

    # if @__roundIndex isnt 1
    #   player1Roles = @__getUniqueArrayValues(a,@__playerData[@__playerNames[0]].roles)
    #   a.push(player1Roles.shift())
    #   player2Roles = @__getUniqueArrayValues(a,@__playerData[@__playerNames[1]].roles)
    #   a.push(player2Roles.shift())
    #   player3Roles = @__getUniqueArrayValues(a,@__playerData[@__playerNames[2]].roles)
    #   a.push(player3Roles.shift())
    # else
    #   player1Roles = @__getUniqueArrayValues(a,@__playerData[@__playerNames[0]].roles)
    #   a.push(player1Roles.shift())
    #   index = 0
    #   for r2 in @__playerData[@__playerNames[1]].roles
    #     if @__playerData[@__playerNames[2]].roles.indexOf(r2) is -1
    #       a.push(r2)
    #   player3Roles = @__getUniqueArrayValues(a,@__playerData[@__playerNames[2]].roles)
    #   a.push(player3Roles.shift())

    #overwrite above with forced roles
    if @__roundIndex is 0
      a = ["judge","pretender","non-pretender"]
    else if @__roundIndex is 1
      a = ["pretender","non-pretender","judge"]
    else
      a = ["non-pretender","judge","pretender"]

    return a

  #return an array of available roles for each player in order of original input
  getAvailableRoles:()->
    return [$.extend([],@__playerData[@__playerNames[0]].roles),$.extend([],@__playerData[@__playerNames[1]].roles),$.extend([],@__playerData[@__playerNames[2]].roles)]

  setRoundCharacteristic:(characteristic)->
    @__gameData.rounds[@__roundIndex] = {characteristic:characteristic,won:undefined}

  getRoundCharacteristic:()->
    return @__gameData.rounds[@__roundIndex].characteristic

  setPlayerText:(text,bonus=0)->
    #if @__playerOrderArray[@__turnIndex].rounds[@__roundIndex].qas.length <= @__questionIndex
    text = text.replace(/\n/g, '<br />')
    @__playerOrderArray[@__turnIndex].rounds[@__roundIndex].qas[@__questionIndex] = {text:text,quickAnswerBonus:bonus,remainingIncognitoBonus:0}
    #add any quick anwser bonus
    @__playerOrderArray[@__turnIndex].rounds[@__roundIndex].score += bonus

    #@__playerOrderArray[@__turnIndex].rounds[@__roundIndex].qas[@__questionIndex].text = text
    #@__playerOrderArray[@__turnIndex].rounds[@__roundIndex].qas[@__questionIndex].bonus = bonus

  incrementPhaseIndex:()->
    @__phaseIndex++
    @__turnIndex++
    if @__turnIndex is 3
      @__turnIndex = 0

  recordRoundScoring:()->
    #degrade judges bonus per question
    @__quickGuessScore = Math.floor(@__quickGuessScore * @__scoreValues.quickGuessScorePotMultiplier)
    #add to pretenders bonus per question
    @__playerOrderArray[1].rounds[@__roundIndex].score += (@__questionIndex+1) * @__scoreValues.remainingIncognitoTurnMultiplier

  signalPhaseEnd:()->
    @__phaseIndex = 0
    @__questionIndex++

  makeGuess:(aOrB)->
    winBool = false
    if aOrB is "b"
      if @__playerABeforeB is true
        winBool = false
      else
        winBool = true
    else
      if @__playerABeforeB is true
        winBool = true
      else 
        winBool = false
    @__gameData.rounds[@__roundIndex].won = winBool
    if winBool
      #add judges win bonus plus whats left of the quick guess bonus
      @__playerOrderArray[0].rounds[@__roundIndex].score += @__scoreValues.judgeWonBonus + @__quickGuessScore
    else
      #add the last bonus for remaining ingneto
      @__playerOrderArray[1].rounds[@__roundIndex].score += (@__questionIndex+1) * @__scoreValues.remainingIncognitoTurnMultiplier
      #add pretneders win bonus
      @__playerOrderArray[1].rounds[@__roundIndex].score += @__scoreValues.pretenderWonBonus
    #add pretneders complementary round bonus
    @__playerOrderArray[2].rounds[@__roundIndex].score += @__scoreValues.nonPretenderRoundBonus
    window.log("End of Round Scores: Judge:"+@__playerOrderArray[0].rounds[@__roundIndex].score+" Pretender:"+@__playerOrderArray[1].rounds[@__roundIndex].score+" Non-pretender:"+@__playerOrderArray[2].rounds[@__roundIndex].score)

    #check for the end of the game
    if @__mode is masquerade.GameManager.GAME_OPTION_THREE_ROUNDS
      if @__roundIndex+1 == 3
        @__gameOver()
    else
      if @__roundIndex+1 == 1
        @__gameOver()


  getPhaseIndex:()->
    return @__phaseIndex

  getTurnIndex:()->
    return @__turnIndex

  getQuestionIndex:()->
    return @__questionIndex

  getRoundIndex:()->
    return @__roundIndex

  getPlayerNames:()->
    return @__playerNames

  getCurrentPlayerName:()->
    return @__playerOrderArray[@__turnIndex].name

  getCurrentQuestion:()->
    return @__playerOrderArray[0].rounds[@__roundIndex].qas[@__questionIndex].text

  getQuestionAtIndex:(index)->
    if index > @__questionIndex
      throw "Error index out of range"
      return ""
    return @__playerOrderArray[0].rounds[@__roundIndex].qas[index].text

  getAnswerAAtIndex:(index)->
    playerIndex = (if (@__playerABeforeB) then 1 else 2)
    if index > @__questionIndex
      throw "Error index out of range"
      return ""
    return @__playerOrderArray[playerIndex].rounds[@__roundIndex].qas[index].text

  getAnswerBAtIndex:(index)->
    playerIndex = (if (@__playerABeforeB) then 2 else 1)
    if index > @__questionIndex
      throw "Error index out of range"
      return ""
    return @__playerOrderArray[playerIndex].rounds[@__roundIndex].qas[index].text

  getEndRoundResult:()->
    return {won:@__gameData.rounds[@__roundIndex].won,pretender:@__playerOrderArray[1].name}

  isThreeRoundGame:()->
    return @__is3RoundMode

  isGameOver:()->
    return @__isGameOver

  getMode:()->
    return @__mode

  getScoreDataValue:(key)->
    return @__scoreValues[key];

  getFinalScoreData:()->
    playerTotalGameScore = 0
    o = {}
    a = []
    for player of @__playerData
      playerTotalGameScore = 0
      for round in @__playerData[player].rounds
        playerTotalGameScore += round.score
      o = {}
      o.name = @__playerData[player].name
      o.score = playerTotalGameScore
      a.push(o)
    a.sort (a, b) ->
      a.score - b.score
    @__g.localStorageManager.addHighScores(a)
    return a

  getTrainingCharacteristics:()->
    return @__data.trainingQuestions

  getTrainingQuestions:()->
    characteristicString = @getRoundCharacteristic()
    questionsArray = undefined
    for c in @__data.trainingQuestions
      if c.characteristic.toLowerCase() is characteristicString.toLowerCase()
        questionsArray = c.questions
    return questionsArray

  getTrainingQuestionWithIndex:(index)->
    questionsData = @getTrainingQuestions()
    return questionsData[index]

  getGameDataToSend:()->
    rounds = []
    round = {}
    roundIndex = 0
    questionAndAnswerObject = {}

    mappedPlayerNames = {}
    playerIndex = 1
    for playerNameKey, playerValue of @__playerData
      mappedPlayerNames[playerNameKey] = "player" + playerIndex
      playerIndex++

    for gameDataRound in @__gameData.rounds
      round = {}
      round.characteristic = gameDataRound.characteristic
      round.roundResult = gameDataRound.won
      round.roundQuestionAnswers = []
      for playerNameKey, playerValue of @__playerData
        questionIndex = 0
        round[playerValue.rounds[roundIndex].role] = mappedPlayerNames[playerNameKey]
        for textObject in playerValue.rounds[roundIndex].qas
          if round.roundQuestionAnswers[questionIndex] is undefined
            round.roundQuestionAnswers[questionIndex] = {}
          questionAndAnswerObject = round.roundQuestionAnswers[questionIndex]
          questionAndAnswerObject[playerValue.rounds[roundIndex].role] = textObject.text
          questionIndex++
      roundIndex++
      rounds.push round
    @__g.debug("gamemanager getGameDataToSend() returns:" + JSON.stringify(rounds))
    return rounds



  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________

masquerade.GameManager.GAME_OPTION_TRAINING_MODE = "trainingMode"
masquerade.GameManager.GAME_OPTION_SINGLE_ROUND = "singleRound"
masquerade.GameManager.GAME_OPTION_THREE_ROUNDS = "threeRounds"
