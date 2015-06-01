(function() {
  var masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  masquerade = Namespace('SEQ.masquerade');

  masquerade.GameManager = (function() {
    GameManager.prototype.__g = masquerade.Globals;

    GameManager.prototype.__playerOrderArray = [];

    GameManager.prototype.__turnIndex = 0;

    GameManager.prototype.__questionIndex = 0;

    GameManager.prototype.__phaseIndex = 0;

    GameManager.prototype.__roundIndex = 0;

    GameManager.prototype.__playerNames = [];

    GameManager.prototype.__playerData = {};

    GameManager.prototype.__gameData = {};

    GameManager.prototype.__playerABeforeB = true;

    GameManager.prototype.__is3RoundMode = true;

    GameManager.prototype.__isGameOver = false;

    GameManager.prototype.__mode = "";

    GameManager.prototype.__scoreValues = {
      "judgeWonBonus": 50,
      "quickAnswerBonusSeconds": 60,
      "quickAnswerBonus": 10,
      "quickGuessScorePot": 100,
      "quickGuessScorePotMultiplier": 0.75,
      "remainingIncognitoTurnMultiplier": 2,
      "pretenderWonBonus": 50,
      "nonPretenderRoundBonus": 0
    };

    GameManager.prototype.__quickGuessScore = 0;

    GameManager.prototype.__roles = ["judge", "pretender", "non-pretender"];

    GameManager.prototype.__data = {};

    function GameManager() {
      this.__onLoadDataComplete = __bind(this.__onLoadDataComplete, this);
      this.__init();
    }

    GameManager.prototype.__init = function() {
      this.__g = masquerade.Globals;
      return this.__loadData();
    };

    GameManager.prototype.__loadData = function() {
      return $.getJSON('data/data.json', this.__onLoadDataComplete);
    };

    GameManager.prototype.__onLoadDataComplete = function(data) {
      return this.__data = data;
    };

    GameManager.prototype.__gameOver = function() {
      return this.__isGameOver = true;
    };

    GameManager.prototype.__getUniqueArrayValues = function(a1, a2) {
      var a3, v, _i, _len;
      a3 = [];
      for (_i = 0, _len = a2.length; _i < _len; _i++) {
        v = a2[_i];
        if (a1.indexOf(v) === -1) {
          a3.push(v);
        }
      }
      return a3;
    };

    GameManager.prototype.newGame = function(mode) {
      this.__mode = mode;
      this.__playerOrderArray = [];
      this.__turnIndex = 0;
      this.__phaseIndex = 0;
      this.__questionIndex = 0;
      this.__roundIndex = -1;
      this.__playerNames = [];
      this.__playerData = {};
      this.__gameData = {
        rounds: []
      };
      this.__is3RoundMode = mode === masquerade.GameManager.GAME_OPTION_THREE_ROUNDS ? true : false;
      this.__isGameOver = false;
      this.__scoreValues.quickGuessScorePot = 100;
      this.__quickGuessScore = this.__scoreValues.quickGuessScorePot;
      return this.newRound();
    };

    GameManager.prototype.newRound = function() {
      this.__playerABeforeB = new Boolean(Math.round(Math.random())).valueOf();
      window.log("Player A Before B, hence Pretender on left:" + this.__playerABeforeB);
      if (this.__mode === masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) {
        if (this.__roundIndex + 1 < 3) {
          this.__roundIndex++;
          this.__phaseIndex = 0;
          return this.__questionIndex = 0;
        }
      } else {
        if (this.__roundIndex + 1 < 1) {
          return this.__roundIndex++;
        }
      }
    };

    GameManager.prototype.setPlayerNames = function(player1, player2, player3) {
      this.__playerNames = [player1, player2, player3];
      this.__playerData[this.__playerNames[0]] = {
        name: player1,
        rounds: [],
        roles: $.extend([], this.__roles)
      };
      this.__playerData[this.__playerNames[1]] = {
        name: player2,
        rounds: [],
        roles: $.extend([], this.__roles)
      };
      return this.__playerData[this.__playerNames[2]] = {
        name: player3,
        rounds: [],
        roles: $.extend([], this.__roles)
      };
    };

    GameManager.prototype.setPlayerRoles = function(role1, role2, role3) {
      var index, player, role, _i, _len, _results;
      player = void 0;
      for (player in this.__playerData) {
        if (this.__playerData[player].rounds.length <= this.__roundIndex) {
          this.__playerData[player].rounds[this.__roundIndex] = {
            role: void 0,
            qas: [],
            score: 0
          };
        }
      }
      index = 0;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        role = arguments[_i];
        player = this.__playerData[this.__playerNames[index]];
        if (player.rounds[this.__roundIndex].role !== void 0) {
          player.roles.push(player.rounds[this.__roundIndex].role);
        }
        player.rounds[this.__roundIndex].role = role;
        player.roles.splice(player.roles.indexOf(role), 1);
        index++;
      }
      this.__playerOrderArray = [];
      _results = [];
      for (player in this.__playerData) {
        switch (this.__playerData[player].rounds[this.__roundIndex].role) {
          case "judge":
            _results.push(this.__playerOrderArray[0] = this.__playerData[player]);
            break;
          case "pretender":
            _results.push(this.__playerOrderArray[1] = this.__playerData[player]);
            break;
          case "non-pretender":
            _results.push(this.__playerOrderArray[2] = this.__playerData[player]);
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    GameManager.prototype.getAutoCompletedRoles = function() {
      var a;
      a = [];
      if (this.__roundIndex === 0) {
        a = ["judge", "pretender", "non-pretender"];
      } else if (this.__roundIndex === 1) {
        a = ["pretender", "non-pretender", "judge"];
      } else {
        a = ["non-pretender", "judge", "pretender"];
      }
      return a;
    };

    GameManager.prototype.getAvailableRoles = function() {
      return [$.extend([], this.__playerData[this.__playerNames[0]].roles), $.extend([], this.__playerData[this.__playerNames[1]].roles), $.extend([], this.__playerData[this.__playerNames[2]].roles)];
    };

    GameManager.prototype.setRoundCharacteristic = function(characteristic) {
      return this.__gameData.rounds[this.__roundIndex] = {
        characteristic: characteristic,
        won: void 0
      };
    };

    GameManager.prototype.getRoundCharacteristic = function() {
      return this.__gameData.rounds[this.__roundIndex].characteristic;
    };

    GameManager.prototype.setPlayerText = function(text, bonus) {
      if (bonus == null) {
        bonus = 0;
      }
      text = text.replace(/\n/g, '<br />');
      this.__playerOrderArray[this.__turnIndex].rounds[this.__roundIndex].qas[this.__questionIndex] = {
        text: text,
        quickAnswerBonus: bonus,
        remainingIncognitoBonus: 0
      };
      return this.__playerOrderArray[this.__turnIndex].rounds[this.__roundIndex].score += bonus;
    };

    GameManager.prototype.incrementPhaseIndex = function() {
      this.__phaseIndex++;
      this.__turnIndex++;
      if (this.__turnIndex === 3) {
        return this.__turnIndex = 0;
      }
    };

    GameManager.prototype.recordRoundScoring = function() {
      this.__quickGuessScore = Math.floor(this.__quickGuessScore * this.__scoreValues.quickGuessScorePotMultiplier);
      return this.__playerOrderArray[1].rounds[this.__roundIndex].score += (this.__questionIndex + 1) * this.__scoreValues.remainingIncognitoTurnMultiplier;
    };

    GameManager.prototype.signalPhaseEnd = function() {
      this.__phaseIndex = 0;
      return this.__questionIndex++;
    };

    GameManager.prototype.makeGuess = function(aOrB) {
      var winBool;
      winBool = false;
      if (aOrB === "b") {
        if (this.__playerABeforeB === true) {
          winBool = false;
        } else {
          winBool = true;
        }
      } else {
        if (this.__playerABeforeB === true) {
          winBool = true;
        } else {
          winBool = false;
        }
      }
      this.__gameData.rounds[this.__roundIndex].won = winBool;
      if (winBool) {
        this.__playerOrderArray[0].rounds[this.__roundIndex].score += this.__scoreValues.judgeWonBonus + this.__quickGuessScore;
      } else {
        this.__playerOrderArray[1].rounds[this.__roundIndex].score += (this.__questionIndex + 1) * this.__scoreValues.remainingIncognitoTurnMultiplier;
        this.__playerOrderArray[1].rounds[this.__roundIndex].score += this.__scoreValues.pretenderWonBonus;
      }
      this.__playerOrderArray[2].rounds[this.__roundIndex].score += this.__scoreValues.nonPretenderRoundBonus;
      window.log("End of Round Scores: Judge:" + this.__playerOrderArray[0].rounds[this.__roundIndex].score + " Pretender:" + this.__playerOrderArray[1].rounds[this.__roundIndex].score + " Non-pretender:" + this.__playerOrderArray[2].rounds[this.__roundIndex].score);
      if (this.__mode === masquerade.GameManager.GAME_OPTION_THREE_ROUNDS) {
        if (this.__roundIndex + 1 === 3) {
          return this.__gameOver();
        }
      } else {
        if (this.__roundIndex + 1 === 1) {
          return this.__gameOver();
        }
      }
    };

    GameManager.prototype.getPhaseIndex = function() {
      return this.__phaseIndex;
    };

    GameManager.prototype.getTurnIndex = function() {
      return this.__turnIndex;
    };

    GameManager.prototype.getQuestionIndex = function() {
      return this.__questionIndex;
    };

    GameManager.prototype.getRoundIndex = function() {
      return this.__roundIndex;
    };

    GameManager.prototype.getPlayerNames = function() {
      return this.__playerNames;
    };

    GameManager.prototype.getCurrentPlayerName = function() {
      return this.__playerOrderArray[this.__turnIndex].name;
    };

    GameManager.prototype.getCurrentQuestion = function() {
      return this.__playerOrderArray[0].rounds[this.__roundIndex].qas[this.__questionIndex].text;
    };

    GameManager.prototype.getQuestionAtIndex = function(index) {
      if (index > this.__questionIndex) {
        throw "Error index out of range";
        return "";
      }
      return this.__playerOrderArray[0].rounds[this.__roundIndex].qas[index].text;
    };

    GameManager.prototype.getAnswerAAtIndex = function(index) {
      var playerIndex;
      playerIndex = (this.__playerABeforeB ? 1 : 2);
      if (index > this.__questionIndex) {
        throw "Error index out of range";
        return "";
      }
      return this.__playerOrderArray[playerIndex].rounds[this.__roundIndex].qas[index].text;
    };

    GameManager.prototype.getAnswerBAtIndex = function(index) {
      var playerIndex;
      playerIndex = (this.__playerABeforeB ? 2 : 1);
      if (index > this.__questionIndex) {
        throw "Error index out of range";
        return "";
      }
      return this.__playerOrderArray[playerIndex].rounds[this.__roundIndex].qas[index].text;
    };

    GameManager.prototype.getEndRoundResult = function() {
      return {
        won: this.__gameData.rounds[this.__roundIndex].won,
        pretender: this.__playerOrderArray[1].name
      };
    };

    GameManager.prototype.isThreeRoundGame = function() {
      return this.__is3RoundMode;
    };

    GameManager.prototype.isGameOver = function() {
      return this.__isGameOver;
    };

    GameManager.prototype.getMode = function() {
      return this.__mode;
    };

    GameManager.prototype.getScoreDataValue = function(key) {
      return this.__scoreValues[key];
    };

    GameManager.prototype.getFinalScoreData = function() {
      var a, o, player, playerTotalGameScore, round, _i, _len, _ref;
      playerTotalGameScore = 0;
      o = {};
      a = [];
      for (player in this.__playerData) {
        playerTotalGameScore = 0;
        _ref = this.__playerData[player].rounds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          round = _ref[_i];
          playerTotalGameScore += round.score;
        }
        o = {};
        o.name = this.__playerData[player].name;
        o.score = playerTotalGameScore;
        a.push(o);
      }
      a.sort(function(a, b) {
        return a.score - b.score;
      });
      this.__g.localStorageManager.addHighScores(a);
      return a;
    };

    GameManager.prototype.getTrainingCharacteristics = function() {
      return this.__data.trainingQuestions;
    };

    GameManager.prototype.getTrainingQuestions = function() {
      var c, characteristicString, questionsArray, _i, _len, _ref;
      characteristicString = this.getRoundCharacteristic();
      questionsArray = void 0;
      _ref = this.__data.trainingQuestions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.characteristic.toLowerCase() === characteristicString.toLowerCase()) {
          questionsArray = c.questions;
        }
      }
      return questionsArray;
    };

    GameManager.prototype.getTrainingQuestionWithIndex = function(index) {
      var questionsData;
      questionsData = this.getTrainingQuestions();
      return questionsData[index];
    };

    GameManager.prototype.getGameDataToSend = function() {
      var gameDataRound, mappedPlayerNames, playerIndex, playerNameKey, playerValue, questionAndAnswerObject, questionIndex, round, roundIndex, rounds, textObject, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      rounds = [];
      round = {};
      roundIndex = 0;
      questionAndAnswerObject = {};
      mappedPlayerNames = {};
      playerIndex = 1;
      _ref = this.__playerData;
      for (playerNameKey in _ref) {
        playerValue = _ref[playerNameKey];
        mappedPlayerNames[playerNameKey] = "player" + playerIndex;
        playerIndex++;
      }
      _ref1 = this.__gameData.rounds;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        gameDataRound = _ref1[_i];
        round = {};
        round.characteristic = gameDataRound.characteristic;
        round.roundResult = gameDataRound.won;
        round.roundQuestionAnswers = [];
        _ref2 = this.__playerData;
        for (playerNameKey in _ref2) {
          playerValue = _ref2[playerNameKey];
          questionIndex = 0;
          round[playerValue.rounds[roundIndex].role] = mappedPlayerNames[playerNameKey];
          _ref3 = playerValue.rounds[roundIndex].qas;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            textObject = _ref3[_j];
            if (round.roundQuestionAnswers[questionIndex] === void 0) {
              round.roundQuestionAnswers[questionIndex] = {};
            }
            questionAndAnswerObject = round.roundQuestionAnswers[questionIndex];
            questionAndAnswerObject[playerValue.rounds[roundIndex].role] = textObject.text;
            questionIndex++;
          }
        }
        roundIndex++;
        rounds.push(round);
      }
      this.__g.debug("gamemanager getGameDataToSend() returns:" + JSON.stringify(rounds));
      return rounds;
    };

    return GameManager;

  })();

  masquerade.GameManager.GAME_OPTION_TRAINING_MODE = "trainingMode";

  masquerade.GameManager.GAME_OPTION_SINGLE_ROUND = "singleRound";

  masquerade.GameManager.GAME_OPTION_THREE_ROUNDS = "threeRounds";

}).call(this);
