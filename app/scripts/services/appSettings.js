app.factory('appSettings', [
  'apiSettings',
  '$q',
  function (apiSettings, $q) {

    // Load settings from chrome storage
    var getConfigVal = function(rootKey, key, defaultVal) {
      var deferred = $q.defer();

      chrome.storage.sync.get('settings', function(items) {
        var settings = items.settings || {};
        if ( settings[rootKey] && settings[rootKey][key] ) {
          deferred.resolve( settings[rootKey][key] );
        } else {
          deferred.resolve( defaultVal );
        }
      });

      return deferred.promise;
    };

    // Store settings to chrome storage
    var setConfigVal = function(rootKey, key, value) {
      var deferred = $q.defer();

      chrome.storage.sync.get('settings', function(items) {
        var settings = items.settings || {};

        if (!settings[rootKey]) {
          settings[rootKey] = {};
        }
        settings[rootKey][key] = value;

        chrome.storage.sync.set({settings: settings}, function() {
          deferred.resolve();
        });
      });

      return deferred.promise;
    };

    return {
      getAPIPath: function() {
        return getConfigVal(apiSettings.KEY_NAME, apiSettings.API_PATH, '');
      },
      setAPIPath: function(val) {
        return setConfigVal(apiSettings.KEY_NAME, apiSettings.API_PATH, val);
      },
      getAPIUsername: function() {
        return getConfigVal(apiSettings.KEY_NAME, apiSettings.USERNAME, '');
      },
      setAPIUsername: function(val) {
        return setConfigVal(apiSettings.KEY_NAME, apiSettings.USERNAME, val);
      },
      getAPIPassword: function() {
        return getConfigVal(apiSettings.KEY_NAME, apiSettings.PASSWORD, '');
      },
      setAPIPassword: function(val) {
        return setConfigVal(apiSettings.KEY_NAME, apiSettings.PASSWORD, val);
      }
    };
  }])
;
