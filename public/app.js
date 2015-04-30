angular.module('app', [])
.controller('main', ['$scope', '$http', function ($scope, $http) {
  $http.get('/walk' + location.search).
   success(function(data, status, headers, config) {
    $scope.query = data.query;
    var walk = data.walk;
    $scope.walk = walk;
    walk.forEach(function (vb) {
      if (vb.type == 6) {
        vb.reference = '.' + vb.value.join('.');
        console.log(vb.reference);
      }
    });
    $scope.duration = walk[walk.length -1].receiveStamp - walk[0].sendStamp;
  }).
   error(function(data, status, headers, config) {
    console.log("Could not fetch apps");
  });
}])
.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
})
.directive('popover', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).popover('show');
            }, function(){
                // on mouseleave
                $(element).popover('hide');
            });
        }
    };
})
.directive('jdNavbar', function() {
  return {
    restrict: 'E',
    controller: function($scope, $location) {
      //$.material.init();
      $scope.search = {};
      $scope.search.text = '';
      $scope.search.go = function () {
        $location.path("/");
      };
    },
    templateUrl: './nav.html'
  };
})
.directive('jdFooter', function() {
  return {
    restrict: 'E',
    controller: function() {
      //$.material.init();
    },
    templateUrl: './footer.html'
  };
});