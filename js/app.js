angular.module('MovableTypeWriterApp', ['ui.bootstrap'])
  .value('version', '1.0.1')
  .value('clientId', 'MovableTypeWriter')

  .controller('MainController', ['$scope', '$modal', 'dataStore', function($scope, $modal, dataStore) {

    // Initialize model data
    $scope.entry = {
      id: "",
      siteId: "",
      title: "",
      body: ""
    };
    $scope.sites = [];
    $scope.settings = {
      base_api_url: ''
    };
    $scope.credentials = {
      username: "",
      password: ""
    };
    
    // Load user settings
    dataStore.loadSettings().then(function(settings) {
      if (settings) {
        $scope.settings.base_api_url = settings.apipath;
        $scope.credentials.username  = settings.username;
        $scope.credentials.password  = settings.password;
      }
    });

    $scope.openSettings = function() {
      $modal.open({
        templateUrl: 'setting-panel-dialog',
        scope: $scope
      });
    };

    $scope.authenticate = function() {
      console.log($scope);
    };
  }]);
