angular.module(appName)
  .factory('PostData', function() {
    return {
      // Properties
      id: '',
      siteId: '',
      title: '',
      body: '',
      categories: [],
      basename: '',

      // Methods
      initialize: function() {
        this.id = '';
        this.title = '';
        this.body = '';
        this.categories = [];
        this.basename = '';
      }
    };
  })
;
