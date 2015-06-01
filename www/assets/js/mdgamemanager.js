(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.MDGameManager = (function(_super) {
    __extends(MDGameManager, _super);

    MDGameManager.prototype.__g = masquerade.Globals;

    MDGameManager.prototype.__isSingleRound = false;

    MDGameManager.prototype.__isComplete = false;

    MDGameManager.prototype.__roundResult = false;

    MDGameManager.prototype.__roundIndex = 0;

    MDGameManager.prototype.__roundQuestionAnswers = [];

    MDGameManager.prototype.__questionIndex = 0;

    MDGameManager.prototype.__heartbeatMS = 3000;

    MDGameManager.prototype.__pin = "";

    MDGameManager.prototype.__guid = "";

    MDGameManager.prototype.__phaseIndex = -1;

    MDGameManager.prototype.__characteristic = "";

    MDGameManager.prototype.__players = [];

    MDGameManager.prototype.__isCreator = false;

    MDGameManager.prototype.__isPrivate = true;

    MDGameManager.prototype.__useNodeServer = false;

    MDGameManager.prototype.__nodeServerHost = "192.168.1.2";

    MDGameManager.prototype.__nodeServerPort = "6789";

    MDGameManager.prototype.__liveServerHost = "live.masquerade.cfuni.hosting.sequence.co.uk";

    MDGameManager.prototype.__heartbeatTimeout = 0;

    MDGameManager.prototype.__textLimit = 150;

    MDGameManager.prototype.__isInActiveGame = false;

    MDGameManager.prototype.__hasAcknowledgedRole = false;

    MDGameManager.prototype.__hasAcknowledgedCharacteristic = false;

    MDGameManager.prototype.__order = ["pretender", "non-pretender"];

    MDGameManager.prototype.__resetIgnoreRemainingResponses = false;

    MDGameManager.prototype.__responseHistory = [];

    MDGameManager.prototype.__wasQuit = false;

    MDGameManager.prototype.__hasEnded = false;

    MDGameManager.prototype.__actionTimeout = 20000;

    function MDGameManager(domNode) {
      this.__getServerState = __bind(this.__getServerState, this);
      this.__sendCallToServerError = __bind(this.__sendCallToServerError, this);
      this.__sendCallToServerSuccess = __bind(this.__sendCallToServerSuccess, this);
      this.__sendDataToServerSuccess = __bind(this.__sendDataToServerSuccess, this);
      MDGameManager.__super__.constructor.apply(this, arguments);
      this.__init();
    }

    MDGameManager.prototype.__init = function() {
      return this.__guid = this.__g.guid;
    };

    MDGameManager.prototype.__randomiseRolePosition = function() {
      var r;
      if (Math.random() > 0.5) {
        r = true;
      }
      if (r) {
        return this.__order = ["pretender", "non-pretender"];
      } else {
        return this.__order = ["non-pretender", "pretender"];
      }
    };

    MDGameManager.prototype.getAnswerAtPositionWithIndex = function(isLeft, index) {
      var answer, role, _i, _len, _ref;
      if (isLeft) {
        role = this.__order[0];
      } else {
        role = this.__order[1];
      }
      _ref = this.__roundQuestionAnswers[index].answers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        answer = _ref[_i];
        if (this.getGUIDRole(answer.guid) === role) {
          return answer.answer;
        }
      }
    };

    MDGameManager.prototype.__cullCallsToServer = function() {
      this.__resetIgnoreRemainingResponses = true;
      return clearTimeout(this.__heartbeatTimeout);
    };

    MDGameManager.prototype.__getRandomAlphaString = function(length) {
      var a, d, r, str;
      a = 'abcdefghijklmnopqrstuvwxyz';
      r = 0;
      d = length;
      str = "";
      while (d--) {
        r = Math.floor(Math.random() * a.length);
        str += a[r];
      }
      return str;
    };

    MDGameManager.prototype.__s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    MDGameManager.prototype.__generateGUID = function() {
      var str;
      str = this.__s4() + this.__s4() + this.__s4() + this.__s4();
      return str;
    };

    MDGameManager.prototype.__trim = function(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    MDGameManager.prototype.__getResponseDataWithResponseID = function(responseID) {
      var d;
      d = this.__responseHistory.length;
      while (d--) {
        if (this.__responseHistory[d].query.responseID === responseID) {
          return this.__responseHistory[d];
        }
      }
    };

    MDGameManager.prototype.__sendCallToServer = function(callString, query) {
      var answer, characteristic, maxLatency, minLatency, options, playerAge, playerGender, playerName, question, responseObject, url;
      query.responseID = this.__generateGUID();
      responseObject = {
        query: query,
        callString: callString
      };
      this.__responseHistory.push(responseObject);
      if (this.__responseHistory.length > 100) {
        this.__responseHistory.shift();
      }
      this.__resetIgnoreRemainingResponses = false;
      if (this.__useNodeServer === false) {
        url = "http://" + this.__liveServerHost + "/api/game/";
        switch (callString) {
          case "getState":
            url += "getstate/" + query.responseID + "/" + query.pin;
            break;
          case "createGame":
            url += "create/" + query.responseID + "/" + query.guid + "/" + query.textLimit + "/" + query.isSingleRound;
            break;
          case "joinGame":
            playerName = encodeURIComponent(this.__trim(query.playerName));
            playerAge = encodeURIComponent(query.age);
            playerGender = encodeURIComponent(this.__trim(query.gender));
            url += "join/" + query.responseID + "/" + query.guid + "/" + query.pin + "/" + playerName + "/" + query.privacy + "/" + playerAge + "/" + playerGender;
            break;
          case "confirmRoles":
            url += "ConfirmRoles/" + query.responseID + "/" + query.pin + "/" + query.judge + "/" + query.nonPretender + "/" + query.pretender;
            break;
          case "confirmCharacteristic":
            characteristic = encodeURIComponent(this.__trim(query.characteristic));
            url += "ChooseCharacteristic/" + query.responseID + "/" + query.pin + "/" + characteristic;
            break;
          case "confirmReadyToAnswer":
            url += "confirmReadyToAnswer/" + query.responseID + "/" + query.pin + "/" + query.guid;
            break;
          case "enterQuestion":
            question = encodeURIComponent(this.__trim(query.question));
            url += "EnterQuestion/" + query.responseID + "/" + query.pin + "/" + question;
            break;
          case "enterAnswer":
            answer = encodeURIComponent(this.__trim(query.answer));
            url += "enteranswer/" + query.responseID + "/" + query.pin + "/" + query.guid + "/" + query.bonus + "/" + answer;
            break;
          case "makeAGuess":
            url += "makeguess/" + query.responseID + "/" + query.pin + "/" + query.guess;
            break;
          case "askAnotherQuestion":
            url += "askanotherquestion/" + query.responseID + "/" + query.pin + "/" + query.guid;
            break;
          case "nextRound":
            url += "nextround/" + query.responseID + "/" + query.pin + "/" + query.guid;
            break;
          case "quitGame":
            url += "quit/" + query.responseID + "/" + query.pin + "/" + query.guid;
            break;
          case "leaveGame":
            url += "leave/" + query.responseID + "/" + query.pin + "/" + query.guid;
        }
        options = {
          type: 'GET',
          url: url,
          async: false,
          timeout: this.__actionTimeout,
          jsonpCallback: "jsonCallback" + query.responseID,
          contentType: "application/json",
          dataType: 'jsonp',
          success: this.__sendCallToServerSuccess,
          error: this.__sendCallToServerError
        };
        if (callString !== "getState") {
          console.log(url);
        }
        responseObject.ajax = $.ajax(options);
      } else {
        minLatency = 0.2;
        maxLatency = 2;
        if (this.__g.latencyDelay === 0) {
          query.seconds = minLatency + (Math.random() * (maxLatency - minLatency));
        } else {
          query.seconds = this.__g.latencyDelay;
        }
        url = "http://" + this.__nodeServerHost + ":" + this.__nodeServerPort + ("/" + callString + "/");
        options = {
          type: 'GET',
          url: url,
          async: false,
          timeout: this.__actionTimeout,
          jsonpCallback: "jsonCallback" + query.responseID,
          contentType: "application/json",
          dataType: 'jsonp',
          data: query,
          success: this.__sendCallToServerSuccess,
          error: this.__sendCallToServerError
        };
        responseObject.ajax = $.ajax(options);
      }
      responseObject.url = url;
      return this.dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER, responseObject));
    };

    MDGameManager.prototype.__sendDataToServerSuccess = function(json, resultString, o) {
      return this.__g.debug("mdgm __sendDataToServerSuccess");
    };

    MDGameManager.prototype.__sendCallToServerSuccess = function(json, resultString, o) {
      var code, hasUpdated, message, responseID, responseObject;
      responseObject = this.__getResponseDataWithResponseID(json.responseID);
      if (responseObject === void 0) {
        if (typeof json.responseID === "string") {
          code = 102;
          message = masquerade.MDGameManager["RESPONSE_CODE_" + code] + (" " + json.responseID);
        } else {
          code = 101;
          responseID = String(json.responseID);
          message = masquerade.MDGameManager["RESPONSE_CODE_" + code] + (" " + responseID);
        }
        this.__g.debug("mdgm __sendCallToServerSuccess Responce ERROR:" + code);
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
          message: message,
          code: code
        }));
        return false;
      } else {
        responseObject.response = json;
      }
      if (json.responseID === void 0) {
        console.log(json);
      }
      if (this.__responseHistory[this.__responseHistory.length - 1].query.responseID !== json.responseID) {
        this.__g.debug("mdgm ignored response query:" + JSON.stringify(responseObject.query) + " and json" + JSON.stringify(responseObject.response));
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS));
        return false;
      }
      if (this.__resetIgnoreRemainingResponses) {
        this.__g.debug("mdgm ignore all remaining response");
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS));
        return false;
      }
      clearTimeout(this.__heartbeatTimeout);
      this.dispatchEvent(new events.Event(masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS));
      code = parseInt(json.responseCode);
      if (code === 3 || code === 4) {
        this.__g.debug("mdgm __sendCallToServerSuccess Responce ERROR:" + json.responseCode);
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
          message: masquerade.MDGameManager["RESPONSE_CODE_" + code],
          code: code
        }));
      }
      if (code === 2 || code === 5 || code === 6 || code === 7 || code === 8) {
        this.__g.debug("mdgm __sendCallToServerSuccess Responce ERROR:" + json.responseCode);
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
          message: masquerade.MDGameManager["RESPONSE_CODE_" + code],
          code: code
        }));
      }
      if (code === 10) {
        this.__g.debug("mdgm __sendCallToServerSuccess Responce ENDED:" + json.responseCode);
        this.__wasQuit = true;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
          message: masquerade.MDGameManager["RESPONSE_CODE_" + code],
          code: code
        }));
      }
      if (code === 11) {
        this.__g.debug("mdgm __sendCallToServerSuccess Responce ENDED:" + json.responseCode);
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
          message: masquerade.MDGameManager["RESPONSE_CODE_" + code],
          code: code
        }));
      }
      if (code === 1) {
        hasUpdated = false;
        if (this.__setPin(json.pin)) {
          hasUpdated = true;
        }
        if (this.__setTextLimit(json.textLimit)) {
          hasUpdated = true;
        }
        if (this.__setIsSingleRound(json.isSingleRound)) {
          hasUpdated = true;
        }
        if (this.__setRoundIndex(json.roundIndex)) {
          hasUpdated = true;
        }
        if (this.__setIsComplete(json.isComplete)) {
          hasUpdated = true;
        }
        if (this.__setCharacteristic(json.characteristic)) {
          hasUpdated = true;
        }
        if (this.__setQuestionIndex(json.questionIndex)) {
          hasUpdated = true;
        }
        if (this.__setRoundResult(json.roundResult)) {
          hasUpdated = true;
        }
        if (this.__setPhaseIndex(json.phaseIndex)) {
          hasUpdated = true;
        }
        if (this.__setRoundQuestionAnswers(json.roundQuestionAnswers)) {
          hasUpdated = true;
        }
        if (this.__setPlayers(json.players)) {
          hasUpdated = true;
        }
        if (this.hasJoined() && this.__phaseIndex !== 8) {
          this.__isInActiveGame = true;
          this.__heartbeatTimeout = setTimeout(this.__getServerState, this.__heartbeatMS);
          this.__g.debug("mdgm __sendCallToServerSuccess()");
        }
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.HEART_BEAT));
        if (hasUpdated) {
          this.__g.debug("mdgm updated json " + JSON.stringify(json));
          return this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER));
        }
      }
    };

    MDGameManager.prototype.__sendCallToServerError = function(xhr, errorType, error) {
      var code;
      this.__g.debug("mdgm __sendCallToServerError:" + errorType);
      code = 0;
      if (errorType === "timeout") {
        code = 100;
      }
      this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ERROR, {
        message: masquerade.MDGameManager["RESPONSE_CODE_" + code],
        code: code
      }));
    };

    MDGameManager.prototype.__getServerState = function() {
      var query;
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("getState", query);
    };

    MDGameManager.prototype.__setPin = function(pin) {
      if (pin !== void 0 && pin !== this.__pin) {
        this.__pin = pin;
        this.__g.localStorageManager.setActivePin(this.__pin);
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PIN));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setPhaseIndex = function(phaseIndex) {
      if (phaseIndex !== void 0 && phaseIndex !== this.__phaseIndex) {
        this.__phaseIndex = phaseIndex;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PHASE_INDEX));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setRoundIndex = function(roundIndex) {
      if (roundIndex !== void 0 && roundIndex !== this.__roundIndex) {
        this.__roundIndex = roundIndex;
        this.__hasAcknowledgedRole = false;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ROUND_INDEX));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setQuestionIndex = function(questionIndex) {
      if (questionIndex !== void 0 && questionIndex !== this.__questionIndex) {
        this.__questionIndex = questionIndex;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_QUESTION_INDEX));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setCharacteristic = function(characteristic) {
      if (characteristic === null) {
        characteristic = "";
      }
      if (characteristic !== void 0 && characteristic !== this.__characteristic) {
        this.__characteristic = characteristic;
        this.__randomiseRolePosition();
        this.__hasAcknowledgedCharacteristic = false;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_CHARACTERISTIC));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setPlayers = function(players) {
      if (players !== void 0 && JSON.stringify(players) !== JSON.stringify(this.__players)) {
        this.__players = players;
        this.__g.localStorageManager.setIsInActiveGame(this.hasJoined());
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_PLAYERS));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setRoundQuestionAnswers = function(roundQuestionAnswers) {
      if (roundQuestionAnswers === null) {
        roundQuestionAnswers = [];
      }
      if (roundQuestionAnswers !== void 0 && JSON.stringify(roundQuestionAnswers) !== JSON.stringify(this.__roundQuestionAnswers)) {
        this.__roundQuestionAnswers = roundQuestionAnswers;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_QUESTIONS_AND_ANSWERS));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setIsSingleRound = function(isSingleRound) {
      isSingleRound = JSON.parse(isSingleRound);
      if (isSingleRound !== void 0 && isSingleRound !== this.__isSingleRound) {
        this.__isSingleRound = isSingleRound;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_IS_SINGLE_ROUND));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setRoundResult = function(roundResult) {
      if (roundResult !== void 0 && roundResult !== this.__roundResult) {
        this.__roundResult = roundResult;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_ROUND_RESULT));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setIsComplete = function(isComplete) {
      if (isComplete !== void 0 && isComplete !== this.__isComplete) {
        this.__isComplete = isComplete;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_IS_COMPLETE));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.__setTextLimit = function(textLimit) {
      if (textLimit !== void 0 && textLimit !== this.__textLimit) {
        this.__textLimit = textLimit;
        this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_TEXT_LIMIT));
        return true;
      }
      return false;
    };

    MDGameManager.prototype.reconnect = function() {
      this.__pin = this.__g.localStorageManager.getActivePin();
      return this.__getServerState();
    };

    MDGameManager.prototype.createGame = function() {
      var query;
      this.__g.debug("mdgm createGame()");
      this.__isCreator = true;
      this.__isSingleRound = this.__g.isSingleRound;
      this.__characterLimit = this.__g.localStorageManager.getCharacterLimit();
      query = {
        guid: this.__guid,
        textLimit: this.__g.localStorageManager.getCharacterLimit(),
        isSingleRound: this.__g.isSingleRound
      };
      return this.__sendCallToServer("createGame", query);
    };

    MDGameManager.prototype.joinGame = function(pin) {
      var query;
      this.__g.debug("mdgm joinGame()");
      query = {
        guid: this.__guid,
        pin: pin,
        privacy: this.__g.localStorageManager.getPrivacy(),
        playerName: this.__g.localStorageManager.getName(),
        age: this.__g.localStorageManager.getAgeString(this.__g.localStorageManager.getAge()),
        gender: this.__g.localStorageManager.getGenderString(this.__g.localStorageManager.getGender())
      };
      return this.__sendCallToServer("joinGame", query);
    };

    MDGameManager.prototype.confirmRoles = function(judgeGUID, nonPretenderGUID, pretenderGUID) {
      var query;
      this.__g.debug("mdgm confirmRoles()");
      query = {
        guid: this.__guid,
        pin: this.__pin,
        judge: judgeGUID,
        nonPretender: nonPretenderGUID,
        pretender: pretenderGUID
      };
      return this.__sendCallToServer("confirmRoles", query);
    };

    MDGameManager.prototype.confirmCharacteristic = function(characteristic) {
      var query;
      this.__g.debug("mdgm confirmCharacteristic()");
      query = {
        guid: this.__guid,
        pin: this.__pin,
        characteristic: characteristic
      };
      return this.__sendCallToServer("confirmCharacteristic", query);
    };

    MDGameManager.prototype.enterQuestion = function(question) {
      var query;
      this.__g.debug("mdgm enterQuestion()");
      query = {
        guid: this.__guid,
        pin: this.__pin,
        question: question
      };
      return this.__sendCallToServer("enterQuestion", query);
    };

    MDGameManager.prototype.confirmReadyToAnswer = function() {
      var query;
      this.__g.debug("mdgm confirmReadyToAnswer()");
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("confirmReadyToAnswer", query);
    };

    MDGameManager.prototype.enterAnswer = function(answer, bonus) {
      var query;
      this.__g.debug("mdgm enterAnswer()");
      query = {
        guid: this.__guid,
        pin: this.__pin,
        answer: answer,
        bonus: bonus
      };
      return this.__sendCallToServer("enterAnswer", query);
    };

    MDGameManager.prototype.makeAGuess = function(guessIsLeft) {
      var guessGUID, query, role;
      this.__g.debug("mdgm makeAGuess()");
      role = "";
      if (guessIsLeft) {
        role = this.__order[0];
      } else {
        role = this.__order[1];
      }
      guessGUID = this.getRoleGUID(role);
      query = {
        guid: this.__guid,
        pin: this.__pin,
        guess: guessGUID,
        guessIsLeft: guessIsLeft
      };
      return this.__sendCallToServer("makeAGuess", query);
    };

    MDGameManager.prototype.askAnotherQuestion = function() {
      var query;
      this.__g.debug("mdgm askAnotherQuestion()");
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("askAnotherQuestion", query);
    };

    MDGameManager.prototype.nextRound = function() {
      var query;
      this.__g.debug("mdgm nextRound()");
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("nextRound", query);
    };

    MDGameManager.prototype.hasJoined = function() {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.guid === this.__guid) {
          return true;
        }
      }
      return false;
    };

    MDGameManager.prototype.setGUID = function(guid) {
      return this.__guid = guid;
    };

    MDGameManager.prototype.getRoleGUID = function(roleString) {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.role.toLowerCase() === roleString) {
          return player.guid;
        }
      }
      return void 0;
    };

    MDGameManager.prototype.getGUIDRole = function(guid) {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.guid === guid) {
          return player.role.toLowerCase();
        }
      }
      return void 0;
    };

    MDGameManager.prototype.getGUIDName = function(guid) {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.guid === guid) {
          return player.name;
        }
      }
      return void 0;
    };

    MDGameManager.prototype.getRoleName = function(roleString) {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.role.toLowerCase() === roleString) {
          return player.name;
        }
      }
      return void 0;
    };

    MDGameManager.prototype.getGUIDIsReadyForNextRound = function() {
      var player, _i, _len, _ref;
      _ref = this.__players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.guid === this.__g.guid) {
          if (player.readyForNextRound !== void 0) {
            return player.readyForNextRound;
          }
        }
      }
      return false;
    };

    MDGameManager.prototype.quitGame = function() {
      var query;
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("quitGame", query);
    };

    MDGameManager.prototype.leaveGame = function() {
      var query;
      query = {
        guid: this.__guid,
        pin: this.__pin
      };
      return this.__sendCallToServer("leaveGame", query);
    };

    MDGameManager.prototype.shouldTryToRecconect = function() {
      var activePin, isInActiveGame;
      activePin = this.__g.localStorageManager.getActivePin();
      isInActiveGame = this.__g.localStorageManager.getIsInActiveGame();
      this.__g.debug("mdgm shouldTryToRecconect() activePin:" + activePin + " isInActiveGame:" + isInActiveGame);
      if (activePin !== void 0 && isInActiveGame) {
        return true;
      } else {
        this.reset();
        return false;
      }
    };

    MDGameManager.prototype.clearLocalStorageGameData = function() {
      this.__g.localStorageManager.clearActivePin();
      return this.__g.localStorageManager.setIsInActiveGame(false);
    };

    MDGameManager.prototype.getFinalScoreData = function() {
      var increment, player, scoreData, _i, _len, _ref;
      scoreData = [
        {
          name: "",
          score: 0
        }, {
          name: "",
          score: 0
        }, {
          name: "",
          score: 0
        }
      ];
      increment = 0;
      if (this.__players.length > 0) {
        _ref = this.__players;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          scoreData[increment].name = player.name;
          scoreData[increment].score = Math.round(player.score);
          increment++;
        }
      }
      scoreData.sort(function(a, b) {
        return a.score - b.score;
      });
      return scoreData;
    };

    MDGameManager.prototype.wasQuit = function() {
      return this.__wasQuit;
    };

    MDGameManager.prototype.hasEnded = function() {
      return this.__hasEnded;
    };

    MDGameManager.prototype.getResponseHistoryLast = function() {
      var obj;
      obj = {};
      if (this.__responseHistory.length > 0) {
        obj = this.__responseHistory[this.__responseHistory.length - 1];
      }
      return JSON.stringify(obj);
    };

    MDGameManager.prototype.reset = function() {
      this.__wasQuit = false;
      this.__hasEnded = false;
      this.__isSingleRound = false;
      this.__isComplete = false;
      this.__roundResult = false;
      this.__roundIndex = 0;
      this.__roundQuestionAnswers = [];
      this.__questionIndex = 0;
      this.__pin = "";
      this.__phaseIndex = -1;
      this.__characteristic = "";
      this.__players = [];
      this.__isCreator = false;
      this.__isPrivate = true;
      this.__textLimit = this.__g.localStorageManager.getCharacterLimit();
      this.__isInActiveGame = false;
      this.__hasAcknowledgedRole = false;
      this.__hasAcknowledgedCharacteristic = false;
      this.__cullCallsToServer();
      return this.clearLocalStorageGameData();
    };

    MDGameManager.prototype.sendSingleDeviceGameData = function(json) {
      var options, url;
      if (this.__g.localStorageManager.getPrivacy() === false) {
        if (this.__useNodeServer === false) {
          url = "http://" + this.__liveServerHost + "/api/game/sendData/";
        } else {
          url = "http://" + this.__nodeServerHost + ":" + this.__nodeServerPort + "/sendData/";
        }
        options = {
          type: 'POST',
          url: url,
          async: false,
          timeout: 10000,
          jsonpCallback: 'jsonCallback',
          contentType: "application/json",
          dataType: 'jsonp',
          data: json,
          success: this.__sendDataToServerSuccess,
          error: this.__sendDataToServerError
        };
        return $.ajax(options);
      }
    };

    MDGameManager.prototype.isSingleRound = function() {
      return this.__isSingleRound;
    };

    MDGameManager.prototype.isCreator = function() {
      return this.__isCreator;
    };

    MDGameManager.prototype.getPin = function() {
      return this.__pin;
    };

    MDGameManager.prototype.getPhaseIndex = function() {
      return this.__phaseIndex;
    };

    MDGameManager.prototype.getRoundIndex = function() {
      return this.__roundIndex;
    };

    MDGameManager.prototype.getPlayers = function() {
      return this.__players;
    };

    MDGameManager.prototype.getIsComplete = function() {
      return this.__isComplete;
    };

    MDGameManager.prototype.getCharacteristic = function() {
      return this.__characteristic;
    };

    MDGameManager.prototype.getRoundResult = function() {
      return this.__roundResult;
    };

    MDGameManager.prototype.getRoundQuestionAnswers = function() {
      return this.__roundQuestionAnswers;
    };

    MDGameManager.prototype.getQuestionIndex = function() {
      return this.__questionIndex;
    };

    MDGameManager.prototype.getTextLimit = function() {
      return this.__textLimit;
    };

    MDGameManager.prototype.isActive = function() {
      return this.__isInActiveGame;
    };

    MDGameManager.prototype.hasAcknowledgedCharacteristic = function() {
      return this.__hasAcknowledgedCharacteristic;
    };

    MDGameManager.prototype.setHasAcknowledgedCharacteristic = function(bool) {
      var hasUpdated;
      if (bool == null) {
        bool = true;
      }
      this.__g.debug("mdgm setHasAcknowledgedCharacteristic()");
      hasUpdated = false;
      if (bool !== this.__hasAcknowledgedCharacteristic) {
        hasUpdated = true;
      }
      this.__hasAcknowledgedCharacteristic = bool;
      return this.confirmReadyToAnswer();
    };

    MDGameManager.prototype.hasAcknowledgedRole = function() {
      return this.__hasAcknowledgedRole;
    };

    MDGameManager.prototype.setHasAcknowledgedRole = function(bool) {
      var hasUpdated;
      if (bool == null) {
        bool = true;
      }
      this.__g.debug("mdgm setHasAcknowledgedRole()");
      hasUpdated = false;
      if (bool !== this.__hasAcknowledgedRole) {
        hasUpdated = true;
      }
      this.__hasAcknowledgedRole = bool;
      if (hasUpdated) {
        return this.dispatchEvent(new events.Event(masquerade.MDGameManager.UPDATED_SERVER));
      }
    };

    MDGameManager.prototype.hasAnsweredQuestion = function() {
      var answer, _i, _len, _ref;
      if (this.__roundQuestionAnswers[this.__questionIndex] !== void 0) {
        if (this.__roundQuestionAnswers[this.__questionIndex].answers !== void 0) {
          if (this.__roundQuestionAnswers[this.__questionIndex].answers.length > 0) {
            _ref = this.__roundQuestionAnswers[this.__questionIndex].answers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              answer = _ref[_i];
              if (answer.guid === this.__g.guid) {
                if (answer.answer !== "") {
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    };

    return MDGameManager;

  })(display.EventDispatcher);

  masquerade.MDGameManager.UPDATED_PIN = "updatedPin";

  masquerade.MDGameManager.UPDATED_PHASE_INDEX = "updatedPhaseIndex";

  masquerade.MDGameManager.UPDATED_ROUND_INDEX = "updatedRoundIndex";

  masquerade.MDGameManager.UPDATED_QUESTION_INDEX = "updatedQuestionIndex";

  masquerade.MDGameManager.UPDATED_CHARACTERISTIC = "updatedCharacteristic";

  masquerade.MDGameManager.UPDATED_PLAYERS = "updatedPlayers";

  masquerade.MDGameManager.UPDATED_QUESTIONS_AND_ANSWERS = "updatedroundQuestionAnswers";

  masquerade.MDGameManager.UPDATED_IS_SINGLE_ROUND = "updatedIsSingleRound";

  masquerade.MDGameManager.UPDATED_ROUND_RESULT = "updatedRoundResult";

  masquerade.MDGameManager.UPDATED_IS_COMPLETE = "updatedIsComplete";

  masquerade.MDGameManager.UPDATED_TEXT_LIMIT = "updatedTextLimit";

  masquerade.MDGameManager.UPDATED_SERVER = "updatedServer";

  masquerade.MDGameManager.UPDATED_ERROR = "updatedError";

  masquerade.MDGameManager.UPDATED_IS_READY_FOR_NEXT_ROUND = "updatedIsReadyForNextRound";

  masquerade.MDGameManager.RESPONSE_CODE_0 = "Opps! there was a problem, please try again later";

  masquerade.MDGameManager.RESPONSE_CODE_1 = "OK";

  masquerade.MDGameManager.RESPONSE_CODE_2 = "GAME FULL";

  masquerade.MDGameManager.RESPONSE_CODE_3 = "GAME NOT FOUND";

  masquerade.MDGameManager.RESPONSE_CODE_4 = "PLAYER NOT FOUND";

  masquerade.MDGameManager.RESPONSE_CODE_5 = "ROUND NOT INITIALISED";

  masquerade.MDGameManager.RESPONSE_CODE_6 = "QUESTION NOT INITIALISED";

  masquerade.MDGameManager.RESPONSE_CODE_7 = "ANSERS NOT ENOUGH";

  masquerade.MDGameManager.RESPONSE_CODE_8 = "PLAYER HAS ALREADY ANSWERED";

  masquerade.MDGameManager.RESPONSE_CODE_9 = "GAME HAS ENDED";

  masquerade.MDGameManager.RESPONSE_CODE_10 = "GAME IS COMPLETE";

  masquerade.MDGameManager.RESPONSE_CODE_100 = "Opps timeout! Please ensure you have a healthy netwwork connection.";

  masquerade.MDGameManager.RESPONSE_CODE_101 = "Opps! Unrecognised response ID";

  masquerade.MDGameManager.RESPONSE_CODE_102 = "Opps server error!";

  masquerade.MDGameManager.CREATE_GAME_COMPLETE = "createGameComplete";

  masquerade.MDGameManager.JOIN_GAME_COMPLETE = "joinGameComplete";

  masquerade.MDGameManager.HEART_BEAT = "heartbeat";

  masquerade.MDGameManager.SEND_TO_SERVER = "sendToServer";

  masquerade.MDGameManager.SEND_TO_SERVER_SUCCESS = "sendToServerSuccess";

  masquerade.MDGameManager.ROLE_JUDGE = "judge";

  masquerade.MDGameManager.ROLE_PRETENDER = "pretender";

  masquerade.MDGameManager.ROLE_NON_PRETENDER = "non-pretender";

}).call(this);
