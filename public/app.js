angular.module('app', [])
.controller('main', ['$scope', '$http', function ($scope, $http) {
  $http.get('/walk').
   success(function(data, status, headers, config) {
    $scope.walk = data;
    $scope.duration = data[data.length -1].receiveStamp - data[0].sendStamp;
    console.log($scope.duration);
  }).
   error(function(data, status, headers, config) {
    console.log("Could not fetch apps");
  });
}])
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