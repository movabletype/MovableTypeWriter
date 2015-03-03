app.factory('Entries', [
  '$rootScope',
  '$http',
  'apiSettings',
  'Events',
  'transformRequestAsFormPost',
  function( $rootScope, $http, apiSettings, Events, transformRequestAsFormPost ) {
    var createEntry = function(siteId, entry) {
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/sites/' + siteId + '/entries';

      return $http({
        method: 'post',
        url: url,
        transformRequest: transformRequestAsFormPost,
        data: {
          entry: JSON.stringify(entry)
        }
      });
    };

    var updateEntry = function(siteId, entryId, entry) {
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/sites/' + siteId + '/entries/' + entryId;

      return $http({
        method: 'post',
        url: url,
        transformRequest: transformRequestAsFormPost,
        data: {
          entry: JSON.stringify(entry),
          '__method': 'PUT'
        }
      });
    };

    return {
      createEntry: function( siteId, entry ) {
        return createEntry( siteId, entry).then(function(data) {
          return data.data;
        });
      },
      updateEntry: function( siteId, entryId, entry ) {
        return updateEntry( siteId, entryId, entry).then(function(data) {
          return data.data;
        });
      }
    };
  }])
;
