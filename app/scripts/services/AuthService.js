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

    var getToken = function() {
      var apiPath, username, password;

      appSettings.getAPIPath().then(function(val) {
        apiPath = val;
        return appSettings.getAPIUsername();
      }).then(function(val) {
        username = val;
        return appSettings.getAPIPassword();
      }).then(function(val) {
        password = val;
        return signIn(apiPath, username, password);
      });
    };

    return {
      signIn: function( api, user, pass ) {
        return signIn(api, user, pass);
      },
      getToken: function() {
        return getToken();
      }
    };
  }])
;
