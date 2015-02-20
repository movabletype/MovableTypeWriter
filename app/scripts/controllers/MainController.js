angular.module(appName)
  .controller('MainController', [
    '$scope',
    '$timeout',
    '$location',
    'appInfo',
    function($scope, $timeout, $location, appInfo) {
      // Set application version.
      $scope.version = appInfo.VERSION;

      // Notification Control
      $scope.notification = {
        success: false,
        error: false,
        message: ''
      };

      $scope.clearMessage = function() {
        $scope.notification.success = false;
        $scope.notification.error = false;
        $scope.notification.message = '';
      };

      $scope.updateSuccessMessage = function(msg) {
        $scope.clearMessage();
        $scope.notification.success = true;
        $scope.notification.message = msg;
        if(!$scope.$$phase) {
          $scope.$apply();
        }
        $timeout(function() {
          $scope.notification.success = false;
        }, 3000);
      };

      $scope.updateErrorMessage = function(msg) {
        $scope.clearMessage();
        $scope.notification.error = true;
        $scope.notification.message = msg;
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      };

      // Setting Event
      $scope.toggleSettings = function() {
        var btn = angular.element('#button-setting');
        if (btn.hasClass('active')) {
          btn.removeClass('active');
          $location.path("/post");
        }
        else {
          btn.addClass('active');
          $location.path("/settings");
        }
      };
    }])
;
