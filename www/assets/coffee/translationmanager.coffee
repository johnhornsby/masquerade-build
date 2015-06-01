#IMPORT
#________________________________________________________________________________________
masquerade = Namespace('SEQ.masquerade')
display = Namespace('SEQ.display')
events = Namespace('SEQ.events')


# <a href="#" data-value="0">English</a>
# <a href="#" data-value="1">Francais</a>
# <a href="#" data-value="2">Deutsch</a>
# <a href="#" data-value="3">Espannol</a>
# <a href="#" data-value="4">Italiano</a>


class masquerade.TranslationManager extends display.EventDispatcher

  __path:""
  __languageIndex:0
  __g:{}
  __json:[]


  constructor: ()->
    super
    @__init()






  #PRIVATE
  #_______________________________________________________________________________________
  __init:() ->
    @__g = masquerade.Globals
    @__languageIndex = @__g.localStorageManager.getLanguage()

  __onLoadDataComplete:(json) =>
    @__json = json
    @dispatchEvent(new events.Event(masquerade.TranslationManager.DATA_LOAD_COMPLETE))

  __getLanguageKeyWithIndex:(index)->
    switch index
      when 0
        return "en"
      when 1
        return "fr"
      when 2
        return "de"
      when 3
        return "es"
      when 4
        return "it" 





  #PUBLIC
  #_______________________________________________________________________________________
  load: ()->
    $.getJSON('data/translation.json', @__onLoadDataComplete)

  updateLanguage:()->
    @__languageIndex = @__g.localStorageManager.getLanguage()

  getTextForKey:(key)->
    tranlationObject = @__json[key]
    if tranlationObject is undefined
      window.log "NO TRANSLATION KEY #{key}"
      return ""
    if tranlationObject[@__getLanguageKeyWithIndex(@__languageIndex)] is undefined
      window.log "NO #{@__getLanguageKeyWithIndex(@__languageIndex)} TRANSLATION FOR KEY #{key}"
      return ""
    else
      return tranlationObject[@__getLanguageKeyWithIndex(@__languageIndex)]

  translateDomNode:(domNode)->
    $translationNodes = $(domNode).find("translation")
    self = this
    $translationNodes.each ()->
      key = $(this).attr("data-key")
      translation = self.getTextForKey(key)
      $(this).html(translation)

  replaceTag:(domNode, tag, str) ->
    $(domNode).html (index, html) ->
      return html.replace(tag, str)



  #PUBLIC CONSTANTS
  #_______________________________________________________________________________________

masquerade.TranslationManager.DATA_LOAD_COMPLETE = "dataLoadComplete"

