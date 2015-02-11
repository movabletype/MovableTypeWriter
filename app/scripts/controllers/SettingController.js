angular.module(appName)
  .controller('SettingController', [
    '$scope',
    '$location',
    'appSettings',
    'AuthService',
    '$window',
    function($scope, $location, appSettings, AuthService, $window) {
      $scope.settings = {
        base_api_url: ''
      };
      $scope.credentials = {
        username: '',
        password: ''
      };

      // Load user settings
      appSettings.loadSettings().then(function(settings) {
        if (Object.keys(settings).length) {
          $scope.settings.base_api_url = settings.apipath;
          $scope.credentials.username  = settings.username;
          $scope.credentials.password  = settings.password;
        }
      });

      $scope.authenticate = function() {
        var scope = angular.element('#main').scope();

        AuthService.signIn($scope.settings.base_api_url, $scope.credentials.username, $scope.credentials.password)
          .success(function(res) {
            $window.sessionStorage.token = res.accessToken;
            $window.sessionStorage.sessionId = res.sessionId;

            var setting = {
              apipath: $scope.settings.base_api_url,
                username: $scope.credentials.username,
                password: $scope.credentials.password
            };
            appSettings.saveSettings(setting);

            scope.updateSuccessMessage('Your settings has been saved.');

            $location.path('/post');
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
          })
        ;
      };
    }])
;
