app.controller('ServerSettingsController', [
  '$rootScope',
  '$scope',
  '$location',
  'appSettings',
  'AuthService',
  'Sites',
  'Events',
  function($rootScope, $scope, $location, appSettings, AuthService, Sites, Events) {
    $scope.settings = {
      baseApiUrl: '',
      username: '',
      password: ''
    };

    var btn = angular.element('#button-setting');
    btn.addClass('active');

    // Load user settings
    appSettings.getAPIPath().then(function(apiPath){
      $scope.settings.baseApiUrl = apiPath;
      if (!apiPath) {
        $rootScope.showTutorial = true;
      }
      return appSettings.getAPIUsername();
    }).then(function(username) {
      $scope.settings.username = username;
      return appSettings.getAPIPassword();
    }).then(function(password) {
      $scope.settings.password = password;
    });

    $scope.validateAuthentication = function() {
      var scope = angular.element('#main').scope();
      var isApiPathChanged = $scope.settings.baseApiUrl !== $rootScope.baseAPIPath ? true : false;

      // Clear cache;
      $rootScope.accessToken = '';
      $rootScope.baseAPIPath = '';
      $rootScope.username = '';
      $rootScope.password = '';
      AuthService.signIn($scope.settings.baseApiUrl, $scope.settings.username, $scope.settings.password)
        .success(function(res) {
          // Keep configuration
          $rootScope.accessToken = res.accessToken;
          $rootScope.baseAPIPath = $scope.settings.baseApiUrl;
          $rootScope.username = $scope.settings.username;
          $rootScope.password = $scope.settings.password;

          // Save settings
          appSettings.setAPIPath($scope.settings.baseApiUrl).then(function(){
            return appSettings.setAPIUsername($scope.settings.username);
          }).then(function(){
            appSettings.setAPIPassword($scope.settings.password); 
          });

          scope.updateSuccessMessage('Your settings has been saved.');

          if (isApiPathChanged) {
            $rootScope.apiPathChanged = true;
          }

          if ($rootScope.showTutorial) {
            angular.element('#button-setting').popover('show');
          }
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
