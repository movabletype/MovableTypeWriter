angular.module(appName)
  .factory('AuthService', [
    '$http',
    'clientId',
    'dataAPIVersion',
    'transformRequestAsFormPost',
    function($http, clientId, dataAPIVersion, transformRequestAsFormPost) {
      return {
        signIn: function( api, user, pass ) {
          var url = api + '/' + dataAPIVersion + '/authentication';
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
