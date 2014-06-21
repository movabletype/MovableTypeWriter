angular.module('mtw.Storage', [])
  .factory('dataStore', function ($q, $rootScope) {

    // Storage type. Right now, localstorage only
    var localStorage = chrome.storage.local;

    // The key of settings
    var keys = [ 'apipath', 'username', 'password' ];
    
    function getFrom(storage) {
      var deferred = $q.defer();

      storage.get(keys, function (obj) {
        deferred.resolve( obj || {} );
        if (!$rootScope.$$phase) $rootScope.$apply();
      });

      return deferred.promise;
    }
    
    return {
      saveSettings: function (settings, callback) {
        chrome.storage.local.set(settings, callback);
      },
      
      loadSettings: function () {
        return getFrom(localStorage);
      }
    };
  });
