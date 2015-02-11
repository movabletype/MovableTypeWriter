'use strict';

var appName = 'MovableTypeWriterApp';
var app = angular.module(appName, ['ui.bootstrap', 'ngRoute', 'summernote']);

// constant values
app.constant('version', '1.0.1')
  .constant('clientId', 'MovableTypeWriter')
  .constant('dataAPIVersion', 'v2')
  .constant('debug', true )
;

// route configuration
app.config(function($routeProvider) {
  var doneSettings = {
    doSetup: function($q, $location, appSettings, debug) {
      if (debug) { console.log('doneSettings.doSetup'); }

      appSettings.isConfigured().then(function(ret) {
        if ( ret ) {
          $location.path('/post');
          return $q.reject();
        }
        else {
          $location.path('/settings');
          return $q.reject();
        }
      });
    }
  };

  $routeProvider.when('/', {
    template: '<h1>Initilize...</h1>',
    controller: function(){},
    resolve: doneSettings
  });
  $routeProvider.when('/post', {
    templateUrl: 'views/post.html',
    controller: 'PostController',
    resolve: doneSettings
  });
  $routeProvider.when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'SettingController'
  });
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});

/*
  .factory('Entry', ['$resource', 'dataStore', 'dataAPIVersion', function($resource, dataStore, dataAPIVersion) {
    var apiPath = '';

    dataStore.loadSettings().then(function(settings) {
      if (settings && settings.apipath) {
        apiPath = settings.apipath;
      }
    });

    if (!apipath) {
      throw "Please setup Movable Type Writer.";
    }

    var url = apiPath + '/' + dataAPIVersion;

    return $resource(url + '/sites/:site_id/entries/:id', {id: @id}, {
      'query': {
        method:'GET',
        isArray: true,
        transformResponse : function (data, headers) {
          data = angular.fromJson(data);
          if (!data.error) {
            throw "Cannot load entries.";
          }
          return data.items;
        }
      },
      'save' : {
        method: 'POST',
        transformResponse : function (data, headers) {
          data = angular.fromJson(data);
          if (!data.error) {
            throw "Cannot update an entry.";
          }
          return data;
        },
        transformRequest: function (data, headers) {
          var extra = '';
          if ( data.id ) {
            extra = '__method=PUT&';
          }
          return extra + 'entry=' + data;
        }
      },
      'delete' : {
        method: 'POST',
        transformResponse : function (data, headers) {
          data = angular.fromJson(data);
          if (!data.error) {
            throw "Cannot delete an entry.";
          }
          return data;
        },
        transformRequest: function (data, headers) {
          return '__method=DELETE';
        }
      },
      'remove' : {
        method: 'POST',
        transformResponse : function (data, headers) {
          data = angular.fromJson(data);
          if (!data.error) {
            throw "Cannot delete an entry.";
          }
          return data;
        },
        transformRequest: function (data, headers) {
          return '__method=DELETE';
        }
      }
    });
  }])

;
*/
