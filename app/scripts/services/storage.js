angular.module(appName)
  .factory('dataStore', [ '$q', '$rootScope', function dataStoreFactory($q, $rootScope) {

    // Storage type. Right now, localstorage only
    var localStorage = chrome.storage.local;

    function getFrom(keys, storage) {
      var deferred = $q.defer();

      storage.get(keys, function (obj) {
        deferred.resolve( obj || {} );
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }
      });

      return deferred.promise;
    }

    return {
      save: function (values, callback) {
        localStorage.set(values, callback);
      },
      load: function (keys) {
        return getFrom([ 'apipath', 'username', 'password' ], localStorage);
      }
    };
  }]);
