angular.module(appName)
  .controller('PostController', [
    '$rootScope',
    '$q',
    '$scope',
    'PostData',
    'Sites',
    'Events',
    'Assets',
    'Categories',
    'Entries',
    'appSettings',
    'Notification',
    'cacheObject',
    '$modal',
    function($rootScope, $q, $scope, PostData, Sites, Events, Assets, Categories, Entries, appSettings, Notification, cacheObject, $modal) {

      // Initialize model data
      $scope.entry = PostData;
      $scope.sites = undefined;
      $scope.categoryLoading = false;
      $scope.categories = undefined;
      $scope.primaryLabel = 'Post';
      $scope.isSaved = false;

      var _initialize = function() {
        // Load sites
        Sites.listBlogsForUser('me', {limit: 999, fields: 'id,parent,name'});
        if ($rootScope.apiPathChanged) {
          // reset
          $scope.entry.category = [];
          $scope.entry.siteId = null;
          $rootScope.apiPathChanged = false;
        }

        if ( $scope.entry.siteId ) {
          _siteChanged($scope.entry.categories);
        }

        // Show load button when saved entry exists
        if (cacheObject.getSavedEntry().then(function(data) {
          if (data) {
            $scope.isSaved = true;
          }
        }));

      };

      var _reloadSiteList = function() {
        // Load sites
        $scope.sites = undefined;
        $scope.categories = undefined;
        $scope.entry.siteId = undefined;
        $scope.entry.categories = [];
        Sites.listBlogsForUser('me', {limit: 999, fields: 'id,parent,name'});
      };

      var _postEntry = function() {
        // Show progress bar
        var modal = $modal.open({
          templateUrl: "progress.html", 
            backdrop: "static",
            keyboard: false
        });

        // Make clone object
        var entry = angular.extend({}, $scope.entry );

        // Clean up entry body
        var parser = new DOMParser();
        var doc = parser.parseFromString($scope.entry.body, "text/html");
        var cloneDoc = doc.cloneNode(true);
        var elems = cloneDoc.getElementsByTagName('img');
        angular.forEach(elems, function(elem, i) {
          var original = elem.getAttribute('data-filename');
          if (original) {
            elem.setAttribute('src', original);
          }
        });
        entry.body = cloneDoc.getElementsByTagName('body')[0].innerHTML;

        // Remove unnecessary data
        if ( entry.id == '' ){
          delete entry.id;
        }
        if ( entry.siteId ) {
          delete entry.siteId;
        }
        if ( entry.categories ) {
          if ( entry.categories.length > 0 ){
            var categories = entry.categories;
            var cats = [];
            angular.forEach(categories, function( val, i ) {
              this.push({ id: val});
            }, cats);
            entry.categories = cats;
          }
          else {
            delete entry.categories;
          }
        }

        // Insert or Update
        if ( $scope.entry.id ) {
          // Update
          Entries.updateEntry($scope.entry.siteId, $scope.entry.id, entry).then(function(data) {
            $scope.primaryLabel = 'Update';
            cacheObject.removeSavedEntry().then(function(){
              $scope.isSaved = false;
            });
            modal.close();
            $rootScope.$broadcast(Events.SHOW_MESSAGE,{
              state: Notification.SUCCESS,
              message: 'Your entry has been updated.'
            });
          });
        }
        else {
          // New
          Entries.createEntry($scope.entry.siteId, entry).then(function(data) {
            $scope.primaryLabel = 'Update';
            $scope.entry.id = data.id;
            $scope.entry.basename = data.basename;
            cacheObject.removeSavedEntry().then(function(){
              $scope.isSaved = false;
            });
            modal.close();
            $rootScope.$broadcast(Events.SHOW_MESSAGE,{
              state: Notification.SUCCESS,
              message: 'Your entry has been posted.'
            });
          });
        }
      };

      var _siteChanged = function(checkedList) {
        // Clear current list
        $scope.categories = [];

        if (!$scope.entry.siteId) {
          return;
        }

        if (!checkedList) {
          checkedList = [];
        }
        $scope.categoryLoading = true;

        // Load category list
        Categories.listCategories($scope.entry.siteId, {limit: 999, fields: 'id,parent,label', sortOrder: 'ascend'}).then(function(data) {
          if ( data.totalResults > 0 ) {
            var cats = [];
            var hashedCats = {};
            var order = [];
            angular.forEach( data.items, function(cat, i) {
              if (checkedList.indexOf(cat.id) !== -1){
                cat.checked = true;
              }
              hashedCats[cat.id] = cat;
              if ( cat.parent == 0 ) {
                order.push(cat.id);
              }
              else if ( cat.parent in hashedCats ) {
                var _cat = hashedCats[cat.parent];
                if (_cat.children === undefined ) {
                  _cat.children = [];
                }
                _cat.children.push(cat);
                hashedCats[cat.parent] = _cat;
              }
            });
            angular.forEach( hashedCats, function(cat, key) {
              if ( cat.parent > 0 ) {
                if (cat.children !== undefined) {
                  var child = cat.children;
                  delete hashedCats[cat.id];
                  if ( cat.parent in hashedCats) {
                    var parentCat= hashedCats[cat.parent];
                    angular.forEach( parentCat.children, function(_cat, j) {
                      if (_cat.id === cat.id ) {
                        parentCat.children[j] = cat;
                      }
                    });
                  }
                } else {
                  delete hashedCats[cat.id];
                }
              }
            });
            angular.forEach(order, function(o, i) {
              cats.push(hashedCats[o]);
            });
            $scope.categories = cats;
          }
          $scope.categoryLoading = false;
        });
      };

      var _newEntry = function() {
        // Initialize model data
        var siteId = $scope.entry.siteId;
        $scope.entry.initialize();
        $scope.entry.siteId = siteId;
        $scope.primaryLabel = 'Post';
        angular.forEach(angular.element('[name=categories]'), function(data, i) {
          angular.element(data).prop('checked', false);
        });
      };

      var _saveEntry = function() {
        cacheObject.saveDraftEntry($scope.entry).then(function() {
          $scope.isSaved = true;
          $rootScope.$broadcast(Events.SHOW_MESSAGE, {
            state: Notification.SUCCESS,
            message: 'Your entry has been saved as draft.'
          });
          return;
        });
      };

      var _loadEntry = function() {
        cacheObject.getSavedEntry($scope.entry).then(function(data) {
          if (data) {
            $scope.entry = data;
            if ( data.siteId ) {
              $scope.entry.siteId = data.siteId;
              _siteChanged(data.categories);
            }
            cacheObject.removeSavedEntry().then(function(){
              $scope.isSaved = false;
            });
            $rootScope.$broadcast(Events.SHOW_MESSAGE, {
              state: Notification.SUCCESS,
              message: 'Your saved entry has been loaded.'
            });
          }
        });
      };

      var _onImageUpload = function(files, editor, welEditable) {
        if (!$scope.entry.siteId) {
          $rootScope.$broadcast(Events.SHOW_MESSAGE, {
            state: Notification.ERROR,
            message: 'You must select a site to upload.'
          });
          return;
        }

        // Drag & Drop File Uploading Event Handler
        var uploadPath;
        var thumbnailSize;
        var isSquare;
        appSettings.getDefaultUploadPath().then(function(path){
          uploadPath = path;
          return appSettings.getThumbnailSize();
        }).then(function(size){
          thumbnailSize = size;
          return appSettings.getIsSquare();
        }).then(function(flag){
          isSquare = flag;

          // Upload file via Data API
          var uploadParam = {
            path: uploadPath
          };
          Assets.uploadImage($scope.entry.siteId, files[0], uploadParam).then(
            function(asset) {
              if (thumbnailSize !== 'original') {
                // Make a thumbnail
                var thumbnailParam = {
                  width: thumbnailSize
                };
                if (isSquare) {
                  thumbnailParam.square = true;
                }
                Assets.getThumbnail(asset.id, $scope.entry.siteId, thumbnailParam).then(
                  // Loading thumbnail file via XHR, because Chrome App disallow to read remote resource by CSP.
                  function(thumbnail) {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function() {
                      var src = window.URL.createObjectURL(xhr.response);
                      editor.insertImage(welEditable, src, xhr.responseURL);
                    };
                    xhr.open('GET', thumbnail.url);
                    xhr.send();
                  },
                  function(errors) {
                    // Failed to make a thumbnail
                    $rootScope.$broadcast(Events.SHOW_MESSAGE,{
                      state: Notification.ERROR,
                      message: 'Failed to make a thumbnail for uploaded image: ' + errors.data.error.message
                    });
                    $q.reject();
                  }
                );
              }
              else {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function() {
                  var src = window.URL.createObjectURL(xhr.response);
                  editor.insertImage(welEditable, src, xhr.responseURL);
                };
                xhr.open('GET', asset.url);
                xhr.send();
              }
            },
            function(errors) {
              // Failed to make a thumbnail
              $rootScope.$broadcast(Events.SHOW_MESSAGE,{
                state: Notification.ERROR,
                message: 'Failed to uplaod an image: ' + errors.data.error.message
              });
              $q.reject();
            }
          );
        });
      };

      // Configure SummerNote
      $scope.options = {
        height: 300,
        focus: true,
        styleWithSpan: false,
        toolbar: [
          ['edit',['undo','redo']],
          ['headline', ['style']],
          ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
          ['color', ['color']],
          ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
          ['table', ['table']],
          ['insert', ['link', 'hr']],
          ['view', ['fullscreen', 'codeview']]
        ],
        onImageUpload: _onImageUpload
      };

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

      $scope.$on(Events.CHECK_CATEGORY, function(event, categoryId) {
        if ($scope.entry.categories.indexOf(categoryId) === -1) {
          $scope.entry.categories.push(categoryId);
        }
      });

      $scope.$on(Events.UNCHECK_CATEGORY, function(event, categoryId) {
        if ($scope.entry.categories.indexOf(categoryId) !== -1) {
          $scope.entry.categories.splice(PostData.categories.indexOf(categoryId), 1);
        }
      });

      // Initialize
      $scope.initialize = _initialize;

      // Post entry
      $scope.postEntry = _postEntry;

      // Site changed
      $scope.siteChanged = _siteChanged;

      // New entry
      $scope.newEntry = _newEntry;

      // Save entry
      $scope.saveEntry = _saveEntry;

      // Load entry
      $scope.loadEntry = _loadEntry;

      // Reload Site List
      $scope.reloadSiteList = _reloadSiteList;
    }
  ])
;
