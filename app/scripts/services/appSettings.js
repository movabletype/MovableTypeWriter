angular.module(appName)
  .factory('appSettings', [
    '$q',
    'dataStore',
    'debug',
    function appSettingsFactory($q, dataStore, debug) {
      var currentSettings;
      var defaultKeys = [ 'apipath', 'username', 'password' ];

      function reload() {
        var deferred = $q.defer();

        dataStore.load(defaultKeys).then(function(settings) {
          if (Object.keys(settings).length > 1) {
            currentSettings = settings;
            return deferred.resolve(true);
          }
          else {
            return deferred.resolve(false);
          }
        });
        return deferred.promise;
      };

      return {
        isConfigured: function() {
          return reload();
        },
        reload: function() {
          return reload();
        },
        saveSettings: function(settings) {
          dataStore.save(settings);
        },
        loadSettings: function(keys) {
          return dataStore.load((keys ? keys : defaultKeys));
        }
      };
    }])
;
