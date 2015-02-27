app.directive('categories', function () {
  return {
    restrict: "E",
    replace: true,
    scope: {
      categories: '='
    },
    template: "<ul id=\"category-list\" class=\"list-non-styled\"><category ng-repeat='category in categories' category='category'></category></ul>"
  };
})
  .directive('category', [ '$compile', 'Events', '$rootScope', function ($compile, Events, $rootScope) {
    return {
      restrict: "E",
      replace: true,
      scope: {
        category: '='
      },
      template: '<li><label><input ng-click="click()" id="cat_{{category.id}} " type="checkbox" name="categories" value="{{category.id}}"> {{category.label}}</label></li>',
      link: function (scope, element, attrs) {
        var onClick = function() {
          var fld = element.find(':checkbox')[0];
          var category_id = scope.category.id;
          if (fld.checked) {
            // Append to data
            $rootScope.$broadcast(Events.CHECK_CATEGORY,category_id);
          }
          else {
            // Remove from data
            $rootScope.$broadcast(Events.UNCHECK_CATEGORY,category_id);
          }
        };

        scope.click = onClick;

        if (scope.category.checked) {
          element.find('input').prop('checked', true);
        }
        if (angular.isArray(scope.category.children)) {
          element.append("<categories categories='category.children'></categories>");
          $compile(element.contents())(scope);
        }
      }
    };
  }])
;
