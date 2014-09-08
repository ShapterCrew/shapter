angular.module( 'shapter.test', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'test', {
    url: '/test',
    views: {
      "main": {
        controller: 'TestCtrl',
        templateUrl: 'test/test.tpl.html'
      }
    },
    data:{ pageTitle: 'Parcourir' }
  });
}])

.controller( 'TestCtrl', [ '$scope', function( $scope ){

}]);


