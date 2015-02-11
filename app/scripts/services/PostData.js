angular.module(appName)
  .factory('PostData', function() {
    return {
      id: '',
      siteId: '',
      title: '',
      body: '',
      categories: []
    };
  })
;
