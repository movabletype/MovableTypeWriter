app.controller('ServerSettingsController', [
  '$scope',
  '$location',
  'appSettings',
  'AuthService',
  '$window',
  function($scope, $location, appSettings, AuthService, $window) {
    $scope.settings = {
      baseApiUrl: '',
      username: '',
      password: ''
    };

    // Load user settings
    appSettings.getAPIPath().then(function(apiPath){
      $scope.settings.baseApiUrl = apiPath;
      return appSettings.getAPIUsername();
    }).then(function(username) {
      $scope.settings.username = username;
      return appSettings.getAPIPassword();
    }).then(function(password) {
      $scope.settings.password = password;
    });

    $scope.authenticate = function() {
      var scope = angular.element('#main').scope();

      AuthService.signIn($scope.settings.baseApiUrl, $scope.settings.username, $scope.settings.password)
        .success(function(res) {
          // Save token data
          $window.sessionStorage.token = res.accessToken;

          // Save settings
          appSettings.setAPIPath($scope.settings.baseApiUrl).then(function(){
            return appSettings.setAPIUsername($scope.settings.username);
          }).then(function(){
            appSettings.setAPIPassword($scope.settings.password); 
          });

          // Reload site list

          scope.updateSuccessMessage('Your settings has been saved.');

        }).error(function(res, status) {
          if (status === 400) {
            scope.updateErrorMessage('Unknown error occurs: ' + (res.error.message ? res.error.message : 'Unknown reason'));
          }
          else if (status === 401) {
            scope.updateErrorMessage('Failed to sign in. Username or password is invalid.');
          }
          else if (status === 404) {
            scope.updateErrorMessage('Failed to sign in. Invalid URL for Data API.');
          }
          else {
            scope.updateErrorMessage('Failed to sign in. Cannot connect to server.');
          }
        })
      ;
    };
  }])
;
