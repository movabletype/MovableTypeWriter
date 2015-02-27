app.factory('Categories', [
  '$rootScope',
  '$http',
  'apiSettings',
  'transformRequestAsFormPost',
  function( $rootScope, $http, apiSettings, transformRequestAsFormPost ) {

    var listCategories = function(siteId, options) {
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/sites/' + siteId + '/categories';
      if ( options ) {
        var param = [];
        angular.forEach(options, function(value, key) {
          this.push(key + '=' + value);
        }, param );
        url = url + '?' + param.join('&');
      }

      return $http.get( url );
    };

    return {
      listCategories: function (siteId, options) {
        return listCategories(siteId, options).then(function(resp) {
          return resp.data;
        });
      }
    };
  }])
;
