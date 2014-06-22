'use strict';

angular.module('MovableTypeWriterApp', ['ui.bootstrap'])
  .value('version', '1.0.1')
  .value('clientId', 'MovableTypeWriter')
  .value('dataAPIVersion', 'v1')

  .controller('MainController', ['$scope', '$modal', 'dataStore', function($scope, $modal, dataStore) {

    // Initialize model data
    $scope.entry = {
      id: '',
      siteId: '',
      title: '',
      body: ''
    };
    $scope.sites = [];
    
    $scope.openSettings = function() {
      $modal.open({
        templateUrl: 'setting-panel-dialog',
        controller: 'SettingController'
      });
    };
  }])

  .controller('SettingController', ['$scope', 'dataStore', 'AuthService', '$window', function($scope, dataStore, AuthService, $window) {
    $scope.settings = {
      base_api_url: ''
    };
    $scope.credentials = {
      username: '',
      password: ''
    };

    // Load user settings
    dataStore.loadSettings().then(function(settings) {
      if (settings) {
        $scope.settings.base_api_url = settings.apipath;
        $scope.credentials.username  = settings.username;
        $scope.credentials.password  = settings.password;
      }
    });

    $scope.authenticate = function() {
      $scope.succss = false;
      $scope.error = {
        badRequest: false,
        invalidAuth: false,
        invalidUrl: false,
        message: ''
      };
      
      AuthService.signIn($scope.settings.base_api_url, $scope.credentials.username, $scope.credentials.password)
        .success(function(res) {
          $window.sessionStorage.token = res.accessToken;
          $window.sessionStorage.sessionId = res.sessionId;
          $scope.success = true;

          var setting = {
            apipath: $scope.settings.base_api_url,
            username: $scope.credentials.username,
            password: $scope.credentials.password
          };
          dataStore.saveSettings(setting);
        }).error(function(res, status) {
          if (status === 400) {
            $scope.error.badRequest = true;
            $scope.error.message = res.error.message;
          }
          else if (status === 401) {
            $scope.error.invalidAuth = true;
          }
          else if (status === 404) {            
            $scope.error.invalidUrl = true;
          }
        })
      ;
    };
  }])

  .factory('AuthService', ['$http', 'clientId', 'dataAPIVersion', 'transformRequestAsFormPost', function($http, clientId, dataAPIVersion, transformRequestAsFormPost) {
    return {
      signIn: function( api, user, pass ) {
        var url = api + '/' + dataAPIVersion + '/authentication';
        var params = {
          username: user,
          password: pass,
          clientId: clientId
        };
        
        return $http({
            method: 'post',
            url: url,
            transformRequest: transformRequestAsFormPost,
            data: params
        });
      }
    };
  }])

  // http://www.bennadel.com/blog/2615-posting-form-data-with-http-in-angularjs.htm
  .factory('transformRequestAsFormPost', function() {
    function transformRequest( data, getHeaders ) {
      var headers = getHeaders();

      delete headers['Content-Type'];
      headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';

      return( serializeData( data ) );
    }

    return( transformRequest );
    
    function serializeData( data ) {
      if ( ! angular.isObject( data ) ) {
        return( ( data == null ) ? '' : data.toString() );
      }
 
      var buffer = [];
      for ( var name in data ) { 
        if ( ! data.hasOwnProperty( name ) ) {
          continue;
        }

        var value = data[ name ];
        buffer.push(
          encodeURIComponent( name ) + '=' + encodeURIComponent( ( value == null ) ? '' : value )
        );
 
      }
 
      var source = buffer
        .join( '&' )
        .replace( /%20/g, '+' )
      ;
 
      return( source );
 
    }
  });
 ;
