angular.module(appName)
  .factory('SiteLoader', [
    '$http',
    'clientId',
    'dataAPIVersion',
    'transformRequestAsFormPost',
    'appSettings',
    function($http, clientId, dataAPIVersion, transformRequestAsFormPost, appSettings) {
      return {
        loadMySites: function() {
          var url = api + '/' + dataAPIVersion + '/users/me/sites';
          var params = {
            username: user,
            password: pass,
            clientId: clientId
          };

          return $http({
            method: 'post',
            url: url,
            transformRequest: transformRequestAsFormPost,
            data: params
          });
        }
      };
    }])
;
