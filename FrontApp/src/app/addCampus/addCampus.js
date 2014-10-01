angular.module( 'shapter.addCampus', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'addCampus', {
    url: '/addCampus',
    views: {
      "main": {
        controller: 'AddCampusCtrl',
        templateUrl: 'addCampus/addCampus.tpl.html'
      }
    },
    data:{ pageTitle: 'Ajouter un Campus' }
  });
}])

.controller('AddCampusCtrl', ['$scope', 'AppText', 'Analytics', function( $scope, AppText, Analytics ){
  Analytics.addCampusPage();
  $scope.AppText = AppText;
  $scope.step = 1;
}]);

