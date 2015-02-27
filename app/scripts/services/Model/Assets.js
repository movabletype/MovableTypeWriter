app.factory('Assets', [
  '$rootScope',
  '$http',
  'apiSettings',
  'transformRequestAsFormPost',
  function( $rootScope, $http, apiSettings, transformRequestAsFormPost ) {

    var uploadImage = function(siteId, file, options){
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/assets/upload?';
      var defaults = {
        path: '/',
        autoRenameIfExists: true,
        normalizeOrientation: true
      };
      var params = angular.extend({}, defaults, options);
      var fd = new FormData();
      fd.append('file', file);
      fd.append('site_id', siteId);
      angular.forEach(params, function(value, key) {
        fd.append(key, value);
      });

      return $http({
        method: 'post',
        url: url,
        data: fd,
        headers: {
          "Content-type": undefined
        },
        transformRequest: angular.identity
      });
    };

    var getThumbnail = function(id, siteId, options) {
      var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/sites/' + siteId + '/assets/' + id + '/thumbnail';
      var defaults = {
        width: '640'
      };
      var params = angular.extend({}, defaults, options);

      if ( params ) {
        var param = [];
        angular.forEach(params, function(value, key) {
          this.push(key + '=' + value);
        }, param );
        url = url + '?' + param.join('&');
      }
      return $http.get(url);
    };

    return {
      uploadImage: function(siteId, file, options) {
        return uploadImage(siteId, file, options).then(function(resp) {
          return resp.data;
        });
      },
      getThumbnail: function(id, siteId, options) {
        return getThumbnail(id, siteId, options).then(function(resp) {
          return resp.data;
        });
      }
    };
  }])
;
