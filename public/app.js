angular.module('app', ['ngSanitize'])
.controller('main', ['$scope', '$http', function ($scope, $http) {
  $scope.loading = true;
  $http.get('/snmp' + location.search).
  success(function(data, status, headers, config) {
    $scope.req = data;
    var walk = data.walk;
    $scope.walk = walk;
    walk.forEach(function (vb) {
      if (vb.type == 6) {
        vb.reference = '.' + vb.value.join('.');
        console.log(vb.reference);
      }
    });
    if (walk.length > 1)
      $scope.duration = walk[walk.length -1].receiveStamp - walk[0].sendStamp;
    $scope.loading = false;
  }).
  error(function(data, status, headers, config) {
    alert("Could not fetch server");
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