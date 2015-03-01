angular.module(appName)
  .controller('MainController', [
    '$scope',
    '$timeout',
    '$location',
    'appInfo',
    'Events',
    'Notification',
    function($scope, $timeout, $location, appInfo, Events, Notification) {
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
        $timeout(function() {
          $scope.notification.error = false;
        }, 3000);
      };

      // Event Handler
      $scope.$on(Events.SHOW_MESSAGE, function(event, data) {
        if ( data.state === Notification.ERROR ) {
          $scope.updateErrorMessage(data.message);
        }
        else if (data.state === Notification.SUCCESS) {
          $scope.updateSuccessMessage(data.message);
        }
      });

      // Setting Event
      $scope.toggleSettings = function() {
        angular.element('#button-setting').popover('hide');
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
