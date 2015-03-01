'use strict';

var appName = 'MovableTypeWriterApp';
var app = angular.module(appName, ['ui.bootstrap', 'ngRoute', 'summernote']);

// route configuration
app.config([
  '$routeProvider',
  '$httpProvider',
  function($routeProvider, $httpProvider) {
    var doneSettings = {
      doSetup: function($q, $location, appSettings) {
        appSettings.getAPIPath().then(function(apiPath) {
          if (!apiPath) {
            $location.path('/settings');
            return $q.reject();
          }
        return appSettings.getAPIUsername();
        }).then(function(username) {
          if ( !username ) {
            $location.path('/settings');
            return $q.reject();
          }
          return appSettings.getAPIPassword();
        }).then(function(password){
          if (password) {
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
      controller: 'ServerSettingsController'
    });
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    // intercept for oauth tokens
    $httpProvider.interceptors.push([
      '$rootScope',
      '$q',
      '$injector',
      '$location',
      'apiSettings',
      'transformRequestAsFormPost',
      function ($rootScope, $q, $injector, $location, apiSettings, transformRequestAsFormPost) {
        return {
          'request': function(config) {
            if ($rootScope.accessToken) {
              config.headers['X-MT-Authorization'] = "MTAuth accessToken=" + $rootScope.accessToken;
            }
            return config;
          },
          'responseError': function(response) {
            if (response.status===401) {
              $rootScope.accessToken = '';
              var deferred = $q.defer();
              var url = $rootScope.baseAPIPath + '/' + apiSettings.API_VERSION + '/authentication';
              if (url == response.config.url ) {
                deferred.reject(response);
              }
              var params = {
                username: $rootScope.username,
                password: $rootScope.password,
                clientId: apiSettings.CLIENT_ID
              };
              $injector.get("$http")({
                method: 'post',
                url: url,
                transformRequest: transformRequestAsFormPost,
                data: params
              }).success(function(resp) {
                $rootScope.accessToken = resp.accessToken;
                $injector.get("$http")(response.config).then(function(resp) {
                  deferred.resolve(resp);
                }, function(resp) {
                  deferred.reject();
                });
              })
                .error(function(){
                  deferred.reject();
                  $location.path('/settings');
                  return;
                });
              return deferred.promise;
            }
            return $q.reject(response);
          }
        };
      }
    ]);
  }])
;
app.run([
  '$rootScope',
  '$injector',
  'appSettings',
  '$location',
  function($rootScope, $injector, appSettings, $location) {
    // Initialize
    $rootScope.accessToken = '';
    $rootScope.baseAPIPath = '';
    $rootScope.username = '';
    $rootScope.password = '';

    appSettings.getAPIPath().then(function(val) {
      if (val) {
        $rootScope.baseAPIPath = val;
      }
      return appSettings.getAPIUsername();
    }).then(function(val) {
      if (val) {
        $rootScope.username = val;
      }
      return appSettings.getAPIPassword();
    }).then(function(val) {
      if (val) {
        $rootScope.password = val;
      }
    });
  }])
;
