app.controller('ComposeSettingsController', [
  '$scope',
  'Sites',
  'appSettings',
  'Events',
  function($scope, Sites, appSettings, Events) {
    // Initialize model data
    $scope.sites = undefined;
    $scope.siteId = 0;

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
      if (!$scope.sites) {
        Sites.listBlogsForUser('me', {limit: 999, fields: 'id,parent,name'});
      }
    };

    // Save settings
    $scope.save = function() {

    };
  }])
;
