app.factory('AuthService', [
  '$http',
  'apiSettings',
  'transformRequestAsFormPost',
  'appSettings',
  '$window',
  function($http, apiSettings, transformRequestAsFormPost, appSettings, $window) {

    var signIn = function(api, user, pass) {
      var url = api + '/' + apiSettings.API_VERSION + '/authentication';
      var params = {
        username: user,
        password: pass,
        clientId: apiSettings.CLIENT_ID
      };

      return $http({
        method: 'post',
        url: url,
        transformRequest: transformRequestAsFormPost,
        data: params
      });
    };
    return {
      signIn: function( api, user, pass ) {
        return signIn(api, user, pass);
      }
    };
  }])
;
