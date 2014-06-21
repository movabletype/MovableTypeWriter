angular.module('MovableTypeWriterApp')
  .factory('dataStore', [ '$q', '$rootScope', function dataStoreFactory($q, $rootScope) {

    // Storage type. Right now, localstorage only
    var localStorage = chrome.storage.local;
    
    function getFrom(keys, storage) {
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
        return getFrom([ 'apipath', 'username', 'password' ], localStorage);
      }
    };
  }]);
