angular.module( 'shapter.cursus', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'cursus', {
    url: '/schools/:schoolId/cursus',
    views: {
      "main": {
        controller: 'CursusCtrl',
        templateUrl: 'cursus/cursus.tpl.html'
      }
    },
    data:{ pageTitle: 'Cursus' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser
    }
  });
}])

.controller('CursusCtrl', ['$scope', function( $scope ){

  $scope.boxes = [{
    title: "TFE",
    type: "internship",
    company: "Shapter",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      type: "School"
    }]
  }, {
    title: "Modules Ouverts Disciplinaires",
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      type: "School"
    }, {
      name: "MOD",
      type: "choice"
    }, {
      name: "3A",
      type: "admin"
    }]
  }, {
    title: "Modules Ouverts Sectoriels",
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      type: "School"
    }, {
      name: "MOS",
      type: "choice"
    }, {
      name: "3A",
      type: "admin"
    }]
  }];
}]);
