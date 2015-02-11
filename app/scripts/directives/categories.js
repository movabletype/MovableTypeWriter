angular.module(appName)
  .directive('categories', function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        categories: '='
      },
      template: "<ul class=\"list-non-styled\"><category ng-repeat='category in categories' category='category'></category></ul>"
    };
  })

  .directive('category', [ '$compile', 'PostData', function ($compile, PostData) {
    return {
      restrict: "E",
      replace: true,
      scope: {
        category: '='
      },
      template: "<li><label><input ng-click=\"click()\" id=\"cat_{{category.id}}\" type=\"checkbox\" name=\"categories\" value=\"{{category.id}}\"> {{category.label}}</label></li>",
      link: function (scope, element, attrs) {
        scope.click = function() {
          var fld = element.find(':checkbox')[0];
          var category_id = scope.category.id;
          if (fld.checked) {
            // Append to data
            if (PostData.categories.indexOf(category_id) === -1) {
              if (PostData.categories.length > 0) {
                PostData.categories[category_id] = { id: category_id };
              }
              else {
                PostData.categories[category_id] = { id: category_id, primary: true };
              }
            }
          }
          else {
            // Remove from data
            if (PostData.categories.indexOf(category_id) !== -1) {
              PostData.categories.splice(PostData.categories.indexOf(category_id), 1);
            }
          }
          console.log(scope.category.label + ':' + scope.category.id);
          console.log(PostData);
        };
        if (angular.isArray(scope.category.children)) {
          element.append("<categories categories='category.children'></categories>");
          $compile(element.contents())(scope);
        }
      }
    };
  }])
;
