angular.module(appName)
  .controller('PostController', [
    '$scope',
    'dataStore',
    'PostData',
    function($scope, dataStore, PostData) {

      // Initialize model data
      $scope.entry = PostData;
      $scope.sites =[
/*      ];*/
/**/
  {
          id: 1,
          name: 'シックス・アパート商会'
        }
      ];
/**/
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

      // Save entry
      $scope.postEntry = function() {
        console.log($scope.entry);
      };
    }])
;
