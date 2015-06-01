(function() {
  var display, events, masquerade,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  masquerade = Namespace('SEQ.masquerade');

  display = Namespace('SEQ.display');

  events = Namespace('SEQ.events');

  masquerade.RootViewController = (function(_super) {
    __extends(RootViewController, _super);

    RootViewController.prototype.__currentScreen = void 0;

    RootViewController.prototype.__previousScreen = void 0;

    RootViewController.prototype.__domNodes = {};

    RootViewController.prototype.__g = masquerade.Globals;

    RootViewController.prototype.__screenContainerElement = {};

    RootViewController.prototype.__screensTransitionsIncrement = 0;

    RootViewController.prototype.__navigationBar = {};

    RootViewController.prototype.__screenHistory = [];

    RootViewController.prototype.__pauseScreen = {};

    RootViewController.prototype.__isPauseActive = false;

    RootViewController.prototype.__alertScreen = {};

    RootViewController.prototype.__isAlertActive = false;

    RootViewController.prototype.__isAnimating = false;

    RootViewController.prototype.__isAnimatingForward = false;

    RootViewController.prototype.__mdAckJoinGame = true;

    RootViewController.prototype.__mdPhaseIndex = -1;

    RootViewController.prototype.__mdStateUpdatedWhileAnimating = false;

    RootViewController.prototype.__mdScreenTransitionPhase = "screenTransitionPhaseIntroComplete";

    RootViewController.prototype.__mdSkipQuitGameAlertFlag = false;

    RootViewController.prototype.__mdIsInGame = false;

    RootViewController.prototype.__mdErrorOccuredWhileAnimating = false;

    function RootViewController() {
      this.__mdUpdatedServer = __bind(this.__mdUpdatedServer, this);
      this.__mdUpdatedServerError = __bind(this.__mdUpdatedServerError, this);
      this.__onAlertCancelClick = __bind(this.__onAlertCancelClick, this);
      this.__onAlertOkClick = __bind(this.__onAlertOkClick, this);
      this.__onHelpClick = __bind(this.__onHelpClick, this);
      this.__onPauseExitClick = __bind(this.__onPauseExitClick, this);
      this.__onPauseResumeClick = __bind(this.__onPauseResumeClick, this);
      this.__onPauseClick = __bind(this.__onPauseClick, this);
      this.__onBackClick = __bind(this.__onBackClick, this);
      this.__onNavigateTo = __bind(this.__onNavigateTo, this);
      this.__transitionInComplete = __bind(this.__transitionInComplete, this);
      this.__transitionOutComplete = __bind(this.__transitionOutComplete, this);
      RootViewController.__super__.constructor.apply(this, arguments);
      this.__init();
    }

    RootViewController.prototype.__init = function() {
      if (this.__g.platform === "ios" && this.__g.osVersion >= 7) {
        $('body').addClass("status-bar-offset");
      }
      this.__screenHistory = [];
      this.__g.screenWidth = window.innerWidth;
      this.__g.screenHeight = window.innerHeight;
      this.__screenContainerElement = document.getElementById("wrapper");
      if (this.__g.platform === "android" && this.__g.osVersion < 4) {
        $(".color-background-floodable").addClass("switch-color-background-floodable");
        $(".switch-color-background-floodable").removeClass("color-background-floodable");
        $(".switch-color-background-floodable").addClass("color-background-floodable-android2");
        $(".switch-color-background-floodable").removeClass("switch-color-background-floodable");
        $(".color-color-floodable").addClass("switch-color-color-floodable");
        $(".switch-color-color-floodable").removeClass("color-color-floodable");
        $(".switch-color-color-floodable").addClass("color-color-floodable-android2");
        $(".switch-color-color-floodable").removeClass("switch-color-color-floodable");
      }
      this.__addScreenDomNodes();
      this.__g.navigationBar = this.__navigationBar = new masquerade.NavigationBar(this.__domNodes["navigation-bar"]);
      this.setListenToNavigationEvents(true);
      document.getElementsByTagName('body')[0].prependChild(this.__navigationBar.getDomNode());
      this.__pauseScreen = new masquerade.PauseScreen(this.__domNodes["pause"].cloneNode(true));
      this.__pauseScreen.addEventListener(masquerade.PauseScreen.EXIT_GAME_CLICK, this.__onPauseExitClick);
      this.__pauseScreen.addEventListener(masquerade.PauseScreen.RESUME_GAME_CLICK, this.__onPauseResumeClick);
      document.getElementsByTagName('body')[0].appendChild(this.__pauseScreen.getDomNode());
      this.__isPauseActive = false;
      this.__alertScreen = new masquerade.AlertScreen(this.__domNodes["alert"].cloneNode(true));
      this.__alertScreen.addEventListener(masquerade.AlertScreen.OK_CLICK, this.__onAlertOkClick);
      this.__alertScreen.addEventListener(masquerade.AlertScreen.CANCEL_CLICK, this.__onAlertCancelClick);
      document.getElementsByTagName('body')[0].appendChild(this.__alertScreen.getDomNode());
      this.__g.debugElement = document.createElement('div');
      $(this.__g.debugElement).addClass("debug-output");
      $(this.__g.debugElement).addClass("status-bar-offset");
      document.getElementsByTagName('body')[0].appendChild(this.__g.debugElement);
      this.__isAlertActive = false;
      this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_SERVER, this.__mdUpdatedServer);
      return this.__g.mdGameManager.addEventListener(masquerade.MDGameManager.UPDATED_ERROR, this.__mdUpdatedServerError);
    };

    RootViewController.prototype.__addScreenDomNodes = function() {
      var className, node, nodes, parent, screenClass, _i, _len, _results;
      screenClass = "";
      className = "";
      parent = {};
      nodes = document.getElementsByClassName("template");
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        className = node.className;
        screenClass = className.substring(className.indexOf("-") + 1);
        screenClass = screenClass.split(" ")[0];
        this.__domNodes[screenClass] = node;
      }
      parent = node.parentNode;
      _results = [];
      while (parent.firstChild) {
        _results.push(parent.removeChild(parent.firstChild));
      }
      return _results;
    };

    RootViewController.prototype.__returnScreenInstance = function(keyString) {
      switch (keyString) {
        case "home":
          return new masquerade.HomeScreen(this.__domNodes[keyString].cloneNode(true));
        case "game-options":
          return new masquerade.GameOptionsScreen(this.__domNodes[keyString].cloneNode(true));
        case "how-to-play":
          return new masquerade.HowToPlayScreen(this.__domNodes[keyString].cloneNode(true));
        case "high-scores":
          return new masquerade.HighScoresScreen(this.__domNodes[keyString].cloneNode(true));
        case "who-is-playing":
          return new masquerade.WhoIsPlayingScreen(this.__domNodes[keyString].cloneNode(true));
        case "choose-characteristic":
          return new masquerade.ChooseCharacteristicScreen(this.__domNodes[keyString].cloneNode(true));
        case "choose-roles":
          return new masquerade.ChooseRolesScreen(this.__domNodes[keyString].cloneNode(true));
        case "ready":
          return new masquerade.ReadyScreen(this.__domNodes[keyString].cloneNode(true));
        case "enter-question":
          return new masquerade.EnterQuestionScreen(this.__domNodes[keyString].cloneNode(true));
        case "enter-answer":
          return new masquerade.EnterAnswerScreen(this.__domNodes[keyString].cloneNode(true));
        case "reveal":
          return new masquerade.RevealScreen(this.__domNodes[keyString].cloneNode(true));
        case "round-end":
          return new masquerade.RoundEndScreen(this.__domNodes[keyString].cloneNode(true));
        case "choose-questions":
          return new masquerade.ChooseQuestionsScreen(this.__domNodes[keyString].cloneNode(true));
        case "game-scores":
          return new masquerade.GameScoresScreen(this.__domNodes[keyString].cloneNode(true));
        case "review":
          return new masquerade.ReviewScreen(this.__domNodes[keyString].cloneNode(true));
        case "game-over":
          return new masquerade.GameOverScreen(this.__domNodes[keyString].cloneNode(true));
        case "settings":
          return new masquerade.SettingsScreen(this.__domNodes[keyString].cloneNode(true));
        case "profile":
          return new masquerade.ProfileScreen(this.__domNodes[keyString].cloneNode(true));
        case "language":
          return new masquerade.LanguageScreen(this.__domNodes[keyString].cloneNode(true));
        case "choose-device":
          return new masquerade.ChooseDeviceScreen(this.__domNodes[keyString].cloneNode(true));
        case "multi-device":
          return new masquerade.MultiDeviceScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-join-game":
          return new masquerade.MDJoinGameScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-choose-roles":
          return new masquerade.MDChooseRolesScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-choose-characteristic":
          return new masquerade.MDChooseCharacteristicScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-acknowledge-role":
          return new masquerade.MDAcknowledgeRoleScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-acknowledge-characteristic":
          return new masquerade.MDAcknowledgeCharacteristicScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-enter-question":
          return new masquerade.MDEnterQuestionScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-waiting-for-players":
          return new masquerade.MDWaitingForPlayersScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-enter-answer":
          return new masquerade.MDEnterAnswerScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-waiting":
          return new masquerade.MDWaitingScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-reveal":
          return new masquerade.MDRevealScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-round-game-end":
          return new masquerade.MDRoundGameEndScreen(this.__domNodes[keyString].cloneNode(true));
        case "md-waiting-for-judgement":
          return new masquerade.MDWaitingForJudgementScreen(this.__domNodes[keyString].cloneNode(true));
      }
    };

    RootViewController.prototype.__transitionOutInit = function() {
      this.__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_INIT;
      this.__isAnimating = true;
      return this.__previousScreen.outroStart();
    };

    RootViewController.prototype.__transitionOutComplete = function() {
      var hasViewChanged;
      this.__g.debug("rootviewcontroller __transitionOutComplete()");
      this.__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE;
      this.__isAnimating = false;
      this.__previousScreen.removeEventListener(masquerade.Screen.INTRO_COMPLETE, this.__transitionInComplete);
      this.__previousScreen.removeEventListener(masquerade.Screen.OUTRO_COMPLETE, this.__transitionOutComplete);
      this.__previousScreen.removeEventListener(masquerade.Screen.NAVIGATE_TO, this.__onNavigateTo);
      this.__previousScreen.screenEnd();
      this.__previousScreen = void 0;
      this.__screensTransitionsIncrement++;
      if (this.__mdErrorOccuredWhileAnimating) {
        return true;
      }
      hasViewChanged = false;
      if (this.__g.mdGameManager.isActive() && this.__mdStateUpdatedWhileAnimating) {
        hasViewChanged = this.__mdUpdatedServer();
      }
      if (hasViewChanged === true) {
        return true;
      } else {
        return this.__transitionInInit();
      }
    };

    RootViewController.prototype.__transitionInInit = function() {
      this.__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_INIT;
      this.__isAnimating = true;
      if (this.__currentScreen === void 0) {
        console.error("rootviewcontroller Error @__currentScreen is undefined");
      }
      this.__screenContainerElement.appendChild(this.__currentScreen.getDomNode());
      this.__currentScreen.addEventListener(masquerade.Screen.INTRO_COMPLETE, this.__transitionInComplete);
      this.__currentScreen.addEventListener(masquerade.Screen.OUTRO_COMPLETE, this.__transitionOutComplete);
      this.__currentScreen.addEventListener(masquerade.Screen.NAVIGATE_TO, this.__onNavigateTo);
      return this.__currentScreen.introStart();
    };

    RootViewController.prototype.__transitionInComplete = function() {
      var hasViewChanged;
      this.__g.debug("rootviewcontroller __transitionInComplete()");
      this.__mdScreenTransitionPhase = masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_COMPLETE;
      this.__screensTransitionsIncrement++;
      this.__isAnimating = false;
      if (this.__mdErrorOccuredWhileAnimating) {
        return true;
      }
      hasViewChanged = false;
      if (this.__g.mdGameManager.isActive() && this.__mdStateUpdatedWhileAnimating) {
        hasViewChanged = this.__mdUpdatedServer();
      }
      if (hasViewChanged === true) {
        return true;
      }
      this.__currentScreen.screenStart();
      return this.__isAnimatingForward = true;
    };

    RootViewController.prototype.__onNavigateTo = function(e) {
      var clearHistory, name;
      name = e.data.name;
      this.__mdTestIncrement++;
      this.__g.debug("rootviewcontroller __onNavigateTo() to:" + e.data.name + " __isAnimating:" + this.__isAnimating + " __mdScreenTransitionPhase:" + this.__mdScreenTransitionPhase);
      if (this.__isAnimating === true) {
        return;
      }
      if (this.__currentScreen) {
        if (this.__currentScreen.getName() === name) {
          return false;
        }
      }
      if (this.__mdScreenTransitionPhase === masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE) {
        this.__currentScreen.removeEventListener(masquerade.Screen.INTRO_COMPLETE, this.__transitionInComplete);
        this.__currentScreen.removeEventListener(masquerade.Screen.OUTRO_COMPLETE, this.__transitionOutComplete);
        this.__currentScreen.removeEventListener(masquerade.Screen.NAVIGATE_TO, this.__onNavigateTo);
        this.__currentScreen.screenEnd();
        this.__currentScreen = void 0;
      }
      this.__mdStateUpdatedWhileAnimating = false;
      this.__mdErrorOccuredWhileAnimating = false;
      clearHistory = e.data.clearHistory ? true : false;
      if (clearHistory === true) {
        this.__screenHistory = ["home"];
      }
      this.__screenHistory.push(name);
      this.__previousScreen = this.__currentScreen;
      this.__currentScreen = this.__returnScreenInstance(name);
      this.__screensTransitionsIncrement = 0;
      if (this.__previousScreen !== void 0) {
        return this.__transitionOutInit();
      } else {
        return this.__transitionInInit();
      }
    };

    RootViewController.prototype.__getCurrentScreenName = function() {
      return this.__currentScreen.getName();
    };

    RootViewController.prototype.__onBackClick = function(e) {
      var previousLocation;
      if (this.__isAnimating) {
        return false;
      }
      this.__g.debug(this.__screenHistory);
      this.__screenHistory.pop();
      previousLocation = this.__screenHistory.pop();
      this.__isAnimatingForward = false;
      return this.__onNavigateTo({
        data: {
          name: previousLocation
        }
      });
    };

    RootViewController.prototype.__onPauseClick = function(e) {
      if (this.__isAnimating) {
        return false;
      }
      if (this.__isPauseActive) {
        this.__isPauseActive = false;
        return this.__pauseScreen.outroStart();
      } else {
        this.__isPauseActive = true;
        return this.__pauseScreen.introStart();
      }
    };

    RootViewController.prototype.__onPauseResumeClick = function(e) {
      return this.__onPauseClick();
    };

    RootViewController.prototype.__onPauseExitClick = function(e) {
      if (this.__g.mdGameManager.isActive()) {
        this.__g.mdGameManager.quitGame();
        this.__onPauseClick();
        this.__onNavigateTo({
          data: {
            name: "home"
          }
        });
        return this.__g.mdGameManager.reset();
      } else {
        this.__onPauseClick();
        return this.__onNavigateTo({
          data: {
            name: "home"
          }
        });
      }
    };

    RootViewController.prototype.__onHelpClick = function(e) {
      if (this.__isAnimating) {
        return false;
      }
    };

    RootViewController.prototype.__onAlertOkClick = function(e) {
      var match, responseCode;
      this.__isAlertActive = false;
      this.__alertScreen.outroStart();
      this.dispatchEvent(e);
      if (e.data.label) {
        if (e.data.label.search("serverError") !== -1) {
          match = e.data.label.match(/\d+/);
          if (match.length > 0) {
            responseCode = parseInt(match[0]);
            if (responseCode !== null) {
              return this.__mdPostUserAcknowledgeError(responseCode);
            }
          }
        }
      }
    };

    RootViewController.prototype.__onAlertCancelClick = function(e) {
      this.__isAlertActive = false;
      this.__alertScreen.outroStart();
      return this.dispatchEvent(e);
    };

    RootViewController.prototype.__mdPostUserAcknowledgeError = function(code) {
      switch (code) {
        case 0:
          this.__onNavigateTo({
            data: {
              name: "home",
              clearHistory: true
            }
          });
          return this.__g.mdGameManager.reset();
        case 2:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 3:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 4:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 5:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 6:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 7:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 8:
          return this.__onNavigateTo({
            data: {
              name: "multi-device",
              clearHistory: true
            }
          });
        case 10:
          this.__onNavigateTo({
            data: {
              name: "home",
              clearHistory: true
            }
          });
          return this.__g.mdGameManager.reset();
        case 11:
          this.__onNavigateTo({
            data: {
              name: "home",
              clearHistory: true
            }
          });
          return this.__g.mdGameManager.reset();
      }
    };

    RootViewController.prototype.__mdUpdatedServerError = function(e) {
      var code;
      this.__g.debug("serverError-" + e.data.code + " response:" + (this.__g.mdGameManager.getResponseHistoryLast()));
      if (this.__isAnimating) {
        this.__mdErrorOccuredWhileAnimating = true;
      }
      code = e.data.code;
      switch (code) {
        case 0:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 2:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 3:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 4:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 5:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 6:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 7:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 8:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 10:
          if (this.__currentScreen.ignoreMDGM) {
            this.__currentScreen.ignoreMDGM();
          }
          return this.alert({
            message: "The current game has ended",
            label: "serverError-" + e.data.code
          });
        case 11:
          return this.alert({
            message: "The game has ended",
            label: "serverError-" + e.data.code
          });
        case 100:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 101:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
        case 102:
          return this.alert({
            message: e.data.message,
            label: "serverError-" + e.data.code
          });
      }
    };

    RootViewController.prototype.__mdUpdatedServer = function() {
      var hasViewChanged, phaseIndex;
      this.__g.debug("rootviewcontroller __mdUpdatedServer() phaseIndex:" + (this.__g.mdGameManager.getPhaseIndex()));
      if (this.__isAnimating) {
        this.__mdStateUpdatedWhileAnimating = true;
        return false;
      }
      hasViewChanged = false;
      phaseIndex = this.__g.mdGameManager.getPhaseIndex();
      switch (phaseIndex) {
        case 0:
          if (this.__mdAckJoinGame === true) {
            if (this.__getCurrentScreenName() !== "md-join-game") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-join-game"
                }
              });
            }
          }
          break;
        case 1:
          if (this.__getCurrentScreenName() !== "md-choose-roles") {
            hasViewChanged = true;
            this.__onNavigateTo({
              data: {
                name: "md-choose-roles"
              }
            });
          }
          break;
        case 2:
          if (this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) === this.__g.guid) {
            if (this.__g.mdGameManager.isSingleRound()) {
              if (this.__getCurrentScreenName() !== "md-choose-characteristic") {
                hasViewChanged = true;
                this.__onNavigateTo({
                  data: {
                    name: "md-choose-characteristic"
                  }
                });
              }
            } else {
              if (this.__g.mdGameManager.hasAcknowledgedRole()) {
                if (this.__getCurrentScreenName() !== "md-choose-characteristic") {
                  hasViewChanged = true;
                  this.__onNavigateTo({
                    data: {
                      name: "md-choose-characteristic"
                    }
                  });
                }
              } else {
                if (this.__getCurrentScreenName() !== "md-acknowledge-role") {
                  hasViewChanged = true;
                  this.__onNavigateTo({
                    data: {
                      name: "md-acknowledge-role"
                    }
                  });
                }
              }
            }
          } else {
            if (this.__getCurrentScreenName() !== "md-acknowledge-role") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-acknowledge-role"
                }
              });
            }
          }
          break;
        case 3:
          if (this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) === this.__g.guid) {
            if (this.__getCurrentScreenName() !== "md-enter-question") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-enter-question"
                }
              });
            }
          } else {
            if (this.__g.mdGameManager.getQuestionIndex() > 0) {
              if (this.__getCurrentScreenName() !== "md-waiting") {
                hasViewChanged = true;
                this.__onNavigateTo({
                  data: {
                    name: "md-waiting"
                  }
                });
              }
            } else {
              if (this.__g.mdGameManager.hasAcknowledgedRole()) {
                if (this.__getCurrentScreenName() !== "md-acknowledge-characteristic") {
                  hasViewChanged = true;
                  this.__onNavigateTo({
                    data: {
                      name: "md-acknowledge-characteristic"
                    }
                  });
                }
              } else {
                if (this.__getCurrentScreenName() !== "md-acknowledge-role") {
                  hasViewChanged = true;
                  this.__onNavigateTo({
                    data: {
                      name: "md-acknowledge-role"
                    }
                  });
                }
              }
            }
          }
          break;
        case 4:
          if (this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) === this.__g.guid) {
            if (this.__getCurrentScreenName() !== "md-waiting-for-players") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-waiting-for-players"
                }
              });
            }
          } else {
            if (this.__g.mdGameManager.hasAcknowledgedCharacteristic()) {
              if (this.__getCurrentScreenName() !== "md-waiting-for-players") {
                hasViewChanged = true;
                this.__onNavigateTo({
                  data: {
                    name: "md-waiting-for-players"
                  }
                });
              }
            } else if (this.__g.mdGameManager.hasAcknowledgedRole()) {
              if (this.__getCurrentScreenName() !== "md-acknowledge-characteristic") {
                hasViewChanged = true;
                this.__onNavigateTo({
                  data: {
                    name: "md-acknowledge-characteristic"
                  }
                });
              }
            } else {
              if (this.__getCurrentScreenName() !== "md-acknowledge-role") {
                hasViewChanged = true;
                this.__onNavigateTo({
                  data: {
                    name: "md-acknowledge-role"
                  }
                });
              }
            }
          }
          break;
        case 5:
          if (this.__getCurrentScreenName() !== "md-enter-answer") {
            hasViewChanged = true;
            this.__onNavigateTo({
              data: {
                name: "md-enter-answer"
              }
            });
          }
          break;
        case 6:
          if (this.__g.mdGameManager.getRoleGUID(masquerade.MDGameManager.ROLE_JUDGE) === this.__g.guid) {
            if (this.__getCurrentScreenName() !== "md-reveal") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-reveal"
                }
              });
            }
          } else {
            if (this.__getCurrentScreenName() !== "md-waiting-for-judgement") {
              hasViewChanged = true;
              this.__onNavigateTo({
                data: {
                  name: "md-waiting-for-judgement"
                }
              });
            }
          }
          break;
        case 7:
          if (this.__getCurrentScreenName() !== "md-round-game-end") {
            hasViewChanged = true;
            this.__onNavigateTo({
              data: {
                name: "md-round-game-end"
              }
            });
          }
      }
      return hasViewChanged;
    };

    RootViewController.prototype.beginGame = function() {
      $("body").css("visibility", "visible");
      return this.__onNavigateTo({
        data: {
          name: "home"
        }
      });
    };

    RootViewController.prototype.getHistoryLength = function() {
      return this.__screenHistory.length;
    };

    RootViewController.prototype.alert = function(contentObject) {
      this.__isAlertActive = true;
      this.__alertScreen.setContent(contentObject);
      return this.__alertScreen.introStart();
    };

    RootViewController.prototype.showLoading = function() {
      return this.__navigationBar.showLoading();
    };

    RootViewController.prototype.hideLoading = function() {
      return this.__navigationBar.hideLoading();
    };

    RootViewController.prototype.setListenToNavigationEvents = function(should) {
      if (should) {
        this.__navigationBar.addEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
        this.__navigationBar.addEventListener(masquerade.NavigationBar.PAUSE_CLICK, this.__onPauseClick);
        return this.__navigationBar.addEventListener(masquerade.NavigationBar.HELP_CLICK, this.__onHelpClick);
      } else {
        this.__navigationBar.removeEventListener(masquerade.NavigationBar.BACK_CLICK, this.__onBackClick);
        this.__navigationBar.removeEventListener(masquerade.NavigationBar.PAUSE_CLICK, this.__onPauseClick);
        return this.__navigationBar.removeEventListener(masquerade.NavigationBar.HELP_CLICK, this.__onHelpClick);
      }
    };

    RootViewController.prototype.isAnimatingForward = function() {
      return this.__isAnimatingForward;
    };

    return RootViewController;

  })(display.EventDispatcher);

  masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_INIT = "screenTransitionPhaseIntroInit";

  masquerade.RootViewController.SCREEN_TRANSITION_PHASE_INTRO_COMPLETE = "screenTransitionPhaseIntroComplete";

  masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_INIT = "screenTransitionPhaseOutroInit";

  masquerade.RootViewController.SCREEN_TRANSITION_PHASE_OUTRO_COMPLETE = "screenTransitionPhaseOutroComplete";

}).call(this);
