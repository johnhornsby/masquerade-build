(function() {
  var masquerade;

  masquerade = Namespace('SEQ.masquerade');

  masquerade.LocalStorageManager = (function() {
    LocalStorageManager.prototype.__buffer = [];

    LocalStorageManager.prototype.__appStartTime = 0;

    function LocalStorageManager() {
      this.__buffer = [];
      this.__init();
    }

    LocalStorageManager.prototype.__init = function() {
      this.__appStartTime = new Date().getTime();
      if (localStorage) {
        console.log("localStorage:" + localStorage);
      }
      if (localStorage.scoresDataObject !== void 0 && localStorage.scoresDataObject !== "") {
        return this.__buffer = $.parseJSON(localStorage.scoresDataObject);
      }
    };

    LocalStorageManager.prototype.__sort = function() {
      return this.__buffer.sort(function(a, b) {
        return b.score - a.score;
      });
    };

    LocalStorageManager.prototype.__getTop10 = function() {
      var a, i, l;
      if (this.__buffer === void 0) {
        this.clearHighScores();
      }
      l = Math.min(this.__buffer.length, 10);
      a = [];
      i = 0;
      while (i < l) {
        a.push($.extend(true, {}, this.__buffer[i]));
        i++;
      }
      return a;
    };

    LocalStorageManager.prototype.__getRandomAlphaString = function(length) {
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

    LocalStorageManager.prototype.__s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    LocalStorageManager.prototype.__generateGUID = function() {
      var str;
      str = this.__s4() + this.__s4() + this.__s4() + this.__s4();
      return str;
    };

    LocalStorageManager.prototype.addHighScore = function(scoreDataObject) {
      if (this.__buffer === void 0) {
        this.clearHighScores();
      }
      this.__buffer.push($.extend(true, {}, scoreDataObject));
      this.__sort();
      this.__buffer = this.__getTop10();
      return localStorage.scoresDataObject = this.__buffer;
    };

    LocalStorageManager.prototype.addHighScores = function(scoreDataObjectArray) {
      var scoreDataObject, _i, _len;
      if (this.__buffer === void 0) {
        this.clearHighScores();
      }
      for (_i = 0, _len = scoreDataObjectArray.length; _i < _len; _i++) {
        scoreDataObject = scoreDataObjectArray[_i];
        this.__buffer.push($.extend(true, {}, scoreDataObject));
      }
      this.__sort();
      this.__buffer = this.__getTop10();
      return localStorage.scoresDataObject = JSON.stringify(this.__buffer);
    };

    LocalStorageManager.prototype.clearHighScores = function() {
      this.__buffer = [];
      return delete localStorage.scoresDataObject;
    };

    LocalStorageManager.prototype.getHighScores = function() {
      return this.__getTop10();
    };

    LocalStorageManager.prototype.getCharacterLimit = function() {
      if (localStorage.characterLimit === void 0 || localStorage.characterLimit === null) {
        localStorage.characterLimit = 150;
      }
      return parseInt(localStorage.characterLimit);
    };

    LocalStorageManager.prototype.setCharacterLimit = function(limit) {
      return localStorage.characterLimit = limit;
    };

    LocalStorageManager.prototype.setPrivacy = function(isPrivateBool) {
      return localStorage.isPrivate = isPrivateBool;
    };

    LocalStorageManager.prototype.getPrivacy = function() {
      if (localStorage.isPrivate === void 0 || localStorage.isPrivate === null) {
        this.setPrivacy(true);
      }
      return JSON.parse(localStorage.isPrivate);
    };

    LocalStorageManager.prototype.setName = function(name) {
      return localStorage.name = name.toLowerCase();
    };

    LocalStorageManager.prototype.getName = function() {
      var name;
      if (localStorage.name === void 0 || localStorage.name === null) {
        localStorage.name = "";
      }
      name = localStorage.name.toLowerCase();
      return name;
    };

    LocalStorageManager.prototype.setAge = function(age) {
      return localStorage.age = age;
    };

    LocalStorageManager.prototype.getAge = function() {
      var age;
      age = parseInt(localStorage.age);
      if (localStorage.age === void 0 || localStorage.age === null) {
        age = -1;
      }
      return age;
    };

    LocalStorageManager.prototype.getAgeString = function(index) {
      switch (index) {
        case 0:
          return "unknown";
        case 1:
          return "under 16";
        case 2:
          return "16 - 19";
        case 3:
          return "25 - 34";
        case 4:
          return "35 - 49";
        case 5:
          return "50 - 59";
        case 6:
          return "60+";
      }
    };

    LocalStorageManager.prototype.getGenderString = function(index) {
      switch (index) {
        case 0:
          return "unknown";
        case 1:
          return "male";
        case 2:
          return "female";
      }
    };

    LocalStorageManager.prototype.setGender = function(gender) {
      return localStorage.gender = gender;
    };

    LocalStorageManager.prototype.getGender = function() {
      var gender;
      gender = parseInt(localStorage.gender);
      if (localStorage.gender === void 0 || localStorage.gender === null) {
        gender = -1;
      }
      return gender;
    };

    LocalStorageManager.prototype.isProfileValid = function() {
      if (this.getName() !== "" && this.getAge() !== -1 && this.getGender() !== -1) {
        return true;
      } else {
        return false;
      }
    };

    LocalStorageManager.prototype.getLanguage = function() {
      var language;
      language = parseInt(localStorage.language);
      if (localStorage.language === void 0 || localStorage.language === null) {
        language = 0;
        this.setLanguage(0);
      }
      return language;
    };

    LocalStorageManager.prototype.setLanguage = function(language) {
      return localStorage.language = language;
    };

    LocalStorageManager.prototype.getGUID = function() {
      var guid;
      if (localStorage.guid === void 0 || localStorage.guid === null) {
        guid = this.__generateGUID();
        localStorage.guid = guid;
      }
      return localStorage.guid;
    };

    LocalStorageManager.prototype.isDataPrivate = function() {
      return false;
    };

    LocalStorageManager.prototype.setGameProperty = function(key, value) {
      return localStorage[key] = value;
    };

    LocalStorageManager.prototype.getGameProperty = function(key) {
      return localStorage[key];
    };

    LocalStorageManager.prototype.setActivePin = function(pin) {
      return localStorage.activePin = pin;
    };

    LocalStorageManager.prototype.clearActivePin = function() {
      return delete localStorage.activePin;
    };

    LocalStorageManager.prototype.getActivePin = function() {
      if (localStorage.activePin === void 0 || localStorage.activePin === null) {
        window.log("no active pin");
      } else {
        window.log("active pin");
      }
      return localStorage.activePin;
    };

    LocalStorageManager.prototype.setIsInActiveGame = function(bool) {
      return localStorage.isInActiveGame = bool;
    };

    LocalStorageManager.prototype.getIsInActiveGame = function() {
      if (localStorage.isInActiveGame === void 0 || localStorage.isInActiveGame === null) {
        localStorage.isInActiveGame = false;
      }
      if (localStorage.isInActiveGame === "true") {
        return true;
      } else {
        return false;
      }
    };

    LocalStorageManager.prototype.log = function(str) {
      var ms;
      if (localStorage.log === void 0 || localStorage.log === null) {
        this.resetLog();
      }
      ms = new Date().getTime() - this.__appStartTime;
      ms /= 1000;
      ms = ms.toFixed(3);
      return localStorage.log += ms + " " + str + "\n";
    };

    LocalStorageManager.prototype.getLog = function() {
      if (localStorage.log === void 0 || localStorage.log === null) {
        this.resetLog();
      }
      return localStorage.log;
    };

    LocalStorageManager.prototype.resetLog = function() {
      this.__appStartTime = new Date().getTime();
      return localStorage.log = "";
    };

    return LocalStorageManager;

  })();

}).call(this);
