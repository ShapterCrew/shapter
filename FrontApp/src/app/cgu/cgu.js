angular.module('shapter.cgu', [])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'cgu', {
    url: '/cgu',
    views: {
      "main": {
        controller: 'CguCtrl',
        templateUrl: 'cgu/cgu.tpl.html'
      }
    },
    data:{ pageTitle: 'Conditions Générales d\'utilisation' }
  });
}])


.controller('CguCtrl', [ '$scope', function($scope){

}]);
