masquerade = Namespace('SEQ.masquerade')

class masquerade.LocalStorageManager

  __buffer:[]
  __appStartTime:0

  constructor: ()->
    @__buffer = []
    @__init()
    






  #PRIVATE
  #__________________________________________________________________________
  __init:()->
    @__appStartTime = new Date().getTime()
    if localStorage
      console.log("localStorage:" + localStorage)
    if localStorage.scoresDataObject isnt undefined && localStorage.scoresDataObject != ""
      
      @__buffer = $.parseJSON(localStorage.scoresDataObject)

  __sort:()->
    @__buffer.sort (a,b)->
      return b.score - a.score

  __getTop10:()->
    if @__buffer is undefined
      @clearHighScores()
    l = Math.min(@__buffer.length,10)
    a = []
    i = 0
    while i < l
      a.push($.extend(true,{},@__buffer[i]))
      i++
    return a;

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




  #PUBLIC
  #__________________________________________________________________________
  addHighScore:(scoreDataObject)->
    if @__buffer is undefined
      @clearHighScores()

    @__buffer.push($.extend(true,{},scoreDataObject))
    @__sort()
    @__buffer = @__getTop10()
    localStorage.scoresDataObject = @__buffer

  addHighScores:(scoreDataObjectArray)->
    if @__buffer is undefined
      @clearHighScores()
    for scoreDataObject in scoreDataObjectArray
      @__buffer.push($.extend(true,{},scoreDataObject))
    @__sort()
    @__buffer = @__getTop10()
    localStorage.scoresDataObject = JSON.stringify(@__buffer)

  clearHighScores:()->
    @__buffer = []
    delete localStorage.scoresDataObject

  getHighScores:()->
    return @__getTop10()

  getCharacterLimit:() ->
    if localStorage.characterLimit is undefined or localStorage.characterLimit is null
      localStorage.characterLimit = 150
    return parseInt(localStorage.characterLimit)

  setCharacterLimit:(limit) ->
    localStorage.characterLimit = limit

  setPrivacy: (isPrivateBool)->
    localStorage.isPrivate = isPrivateBool

  getPrivacy: ()->
    if localStorage.isPrivate is undefined or localStorage.isPrivate is null
      @setPrivacy(true)
    return JSON.parse(localStorage.isPrivate)

  setName: (name) ->
    localStorage.name = name.toLowerCase()

  getName: () ->
    if localStorage.name is undefined or localStorage.name is null
      localStorage.name = ""
    name = localStorage.name.toLowerCase()
    return name

  setAge: (age) ->
    localStorage.age = age

  getAge: () ->
    # 0 is rather not say
    age = parseInt(localStorage.age)
    if localStorage.age is undefined or localStorage.age is null
      age = -1
    return age

  getAgeString: (index)->
    switch index
      when 0
        return "unknown"
      when 1
        return "under 16"
      when 2
        return "16 - 19"
      when 3
        return "25 - 34"
      when 4
        return "35 - 49"
      when 5
        return "50 - 59"
      when 6
        return "60+"

  getGenderString: (index)->
    switch index
      when 0
        return "unknown"
      when 1
        return "male"
      when 2
        return "female"

  setGender: (gender) ->
    localStorage.gender = gender

  getGender: () ->
    # "denied" is rather not say

    gender = parseInt(localStorage.gender)
    if localStorage.gender is undefined or localStorage.gender is null
      gender = -1
    return gender

  isProfileValid: () ->
    if @getName() isnt "" and @getAge() isnt -1 and @getGender() isnt -1
      return true
    else
      return false

  getLanguage: () ->
    language = parseInt(localStorage.language)
    if localStorage.language is undefined or localStorage.language is null
      language = 0
      @setLanguage(0)
    return language

  setLanguage: (language) ->
    localStorage.language = language

  getGUID: ()  ->
    if localStorage.guid is undefined or localStorage.guid is null
      guid = @__generateGUID()
      localStorage.guid = guid
    return localStorage.guid

  isDataPrivate: () ->
    return false

  setGameProperty: (key, value) ->
    localStorage[key] = value

  getGameProperty: (key) ->
    return localStorage[key]

  setActivePin: (pin) ->
    localStorage.activePin = pin

  clearActivePin: () ->
    delete localStorage.activePin

  getActivePin: () ->
    if localStorage.activePin is undefined or localStorage.activePin is null
      window.log "no active pin"
    else
      window.log "active pin"
    return localStorage.activePin

  setIsInActiveGame: (bool) ->
    localStorage.isInActiveGame = bool

  getIsInActiveGame: () ->
    if localStorage.isInActiveGame is undefined or localStorage.isInActiveGame is null
      localStorage.isInActiveGame = false
    if localStorage.isInActiveGame is "true"
      return true
    else
      return false

  log:(str) ->
    if localStorage.log is undefined or localStorage.log is null
      @resetLog()
    ms = new Date().getTime() - @__appStartTime
    ms /= 1000
    ms = ms.toFixed(3)
    localStorage.log += ms + " " + str + "\n"

  getLog:() ->
    if localStorage.log is undefined or localStorage.log is null
      @resetLog()
    return localStorage.log

  resetLog:()->
    @__appStartTime = new Date().getTime()
    localStorage.log = ""






