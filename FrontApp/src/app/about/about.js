angular.module( 'shapter.about', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'À propos' }
  });
}])

.controller('AboutCtrl', ['$scope', function( $scope ){
}]);

