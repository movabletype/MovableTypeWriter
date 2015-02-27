app.controller('UploadSettingsController', [
  '$scope',
  'appSettings',
  'Events',
  'Notification',
  'uploadSettings',
  '$rootScope',
  function($scope, appSettings, Events, Notification, uploadSettings, $rootScope) {
    // Initialize model data
    $scope.settings = {
      defaultUploadPath: undefined,
      thumbnailSize: undefined,
      square: undefined
    };
    $scope.thumbnailList =[
      { label: 'Original Size',  value: 'original' },
      { label: 'Small (240px)',  value: '240'},
      { label: 'Medium (480px)', value: '480'},
      { label: 'Large (640px)',  value: '640'},
      { label: 'Extra Large (1024px)', value: '1024' }
    ];

    // Event handler
    $scope.$on(Events.RELOAD_SITE_LIST, function(event, data) {
      if (data && data.totalResults > 0) {
        var sites = [];
        angular.forEach(data.items, function(site, i) {
          var name = site.name;
          if (site.parent) {
            name = name + ' (' + site.parent.name + ')';
          }
          this.push({
            id: site.id,
            name: name
          });
        },sites);
        $scope.sites = sites;
      }
    });

    // Initialize
    $scope.initialize = function() {
      appSettings.getDefaultUploadPath().then(function(path){
        $scope.settings.defaultUploadPath = path;
        return appSettings.getThumbnailSize();
      }).then(function(size){
        angular.forEach( $scope.thumbnailList, function(item, i) {
          if(item.value == size) {
            $scope.settings.thumbnailSize = item.value;
          }
        });
        return appSettings.getIsSquare();
      }).then(function(flag){
        $scope.settings.square = flag;
      });
    };

    // Save settings
    $scope.saveSettings = function() {
      if ($scope.settings.defaultUploadPath.indexOf('/') !== 0 ) {
        $scope.settings.defaultUploadPath = '/' + $scope.settings.defaultUploadPath;
      }

      appSettings.setDefaultUploadPath($scope.settings.defaultUploadPath).then(function(){
        return appSettings.setThumbnailSize($scope.settings.thumbnailSize);
      }).then(function(){
        return appSettings.setIsSquare($scope.settings.square);
      }).then(function(){
        $rootScope.$broadcast(Events.SHOW_MESSAGE,{
          state: Notification.SUCCESS,
          message: 'Your settings has been saved.'
        });
      });
    };
  }])
;
