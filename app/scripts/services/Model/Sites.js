app.factory('Sites', [
  '$rootScope',
  '$http',
  'apiSettings',
  'Events',
  function( $rootScope, $http, apiSettings, Events ) {
    var listBlogsForUser = function(userId, params) {
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/users/' + userId + '/sites';
      if ( params ) {
        var param = [];
        angular.forEach(params, function(value, key) {
          this.push(key + '=' + value);
        }, param );
        url = url + '?' + param.join('&');
      }

      return $http.get( url );
    };

    return {
      listBlogsForUser: function( userId, params ) {
        return listBlogsForUser( userId, params ).then(function(data) {
          $rootScope.$broadcast(Events.RELOAD_SITE_LIST, data.data);
        });
      }
    };
  }])
;
