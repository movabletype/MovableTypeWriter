angular.module(appName)
  .controller('PostController', [
    '$scope',
    'PostData',
    'Sites',
    'Events',
    function($scope, PostData, Sites, Events) {

      // Initialize model data
      $scope.entry = PostData;
      $scope.sites = undefined;
      $scope.categoryLoaded = true;
      $scope.categories = [/*];*/
/**/
  {
          label: '商品カタログ',
          id: 4,
          children: [
            {
              label: 'ショルダーバッグ',
              id: 5
            },
            {
              label: 'ハンドバッグ',
              id: 5
            },
            {
              label: 'リュック・デイパック',
              id: 5
            },
            {
              label: 'スーツケース・トランク',
              id: 5
            }
          ]
        },
        {
          label: '商品価格帯',
          id: 4,
          children: [
            {
              label: '〜 1,000円',
              id: 5
            },
            {
              label: '1,001円 〜 5,000円',
              id: 5
            },
            {
              label: '5,001円 〜 10,000円',
              id: 5
            },
            {
              label: '10,001円 〜',
              id: 5
            }
          ]
        }
      ];
/**/

      // Configure SummerNote
      $scope.options = {
        height: 200,
        focus: true,
        styleWithSpan: false,
        toolbar: [
          ['edit',['undo','redo']],
          ['headline', ['style']],
          ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
          ['fontclr', ['color']],
          ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
          ['table', ['table']],
          ['insert', ['link','picture','video','hr']],
          ['view', ['fullscreen', 'codeview']]
        ]/*,
        onImageUpload: function(files, editor, welEditable) {
          console.log('image upload:', files, editor, welEditable);
        }*/
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

      // Initialize
      $scope.initialize = function() {
        Sites.listBlogsForUser('me', {fields: 'id,parent,name'});
      };

      // Save entry
      $scope.postEntry = function() {
        console.log($scope.entry);
      };

      // Site changed
      $scope.siteChanged = function() {

      };
    }])
;
