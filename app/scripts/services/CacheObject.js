app.factory('cacheObject', [
  'cacheData',
  '$q',
  function (cacheData, $q) {

    // Load cached data from chrome storage
    var getCachedVal = function(rootKey, key) {
      var deferred = $q.defer();

      chrome.storage.sync.get('cache', function(items) {
        var data = items.cache || {};
        if ( data[rootKey] && data[rootKey][key] ) {
          deferred.resolve( data[rootKey][key] );
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    // Remove cache data from chrome storage
    var removeCacheVal = function(rootKey, key) {
      var deferred = $q.defer();

      chrome.storage.sync.get('cache', function(items) {
        var cache = items.cache || {};

        if (!cache[rootKey]) {
          deferred.resolve();
        }
        else {
          cache[rootKey][key] = null;

          chrome.storage.sync.set({cache: cache}, function() {
            deferred.resolve();
          });
        }
      });

      return deferred.promise;
    };

    // Store cache data to chrome storage
    var setCacheVal = function(rootKey, key, value) {
      var deferred = $q.defer();

      chrome.storage.sync.get('cache', function(items) {
        var cache = items.cache || {};

        if (!cache[rootKey]) {
          cache[rootKey] = {};
        }
        cache[rootKey][key] = value;

        chrome.storage.sync.set({cache: cache}, function() {
          deferred.resolve();
        });
      });

      return deferred.promise;
    };

    return {
      getSavedEntry: function() {
        return getCachedVal(cacheData.KEY_NAME, cacheData.CACHE_SAVED_ENTRY);
      },
      saveDraftEntry: function(val) {
        return setCacheVal(cacheData.KEY_NAME, cacheData.CACHE_SAVED_ENTRY, val);
      },
      removeSavedEntry: function() {
        return removeCacheVal(cacheData.KEY_NAME, cacheData.CACHE_SAVED_ENTRY);
      }
    };
  }])
;
