angular.module( 'shapter.internships', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'Internships', {
    url: '/schools/:schoolId/internships',
    reloadOnSearch: 'false',
    views: {
      "main": {
        controller: 'InternshipsCtrl',
        templateUrl: 'internships/internships.tpl.html'
      }
    },
    data:{ pageTitle: 'Internships' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser,
      schoolTags: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.getSchoolTags( $stateParams.schoolId );
      }],
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }]
    }
  });
}])

.controller('InternshipsCtrl', ['$scope', 'security', function( $scope, security ){
  $scope.security = security;
  $scope.view = 'map';
  $scope.internships = {
    olsoMarker: {
      student: {
        firstname: 'Alex',
        lastname: 'lolalilaloule'
      },
      company: {
        name: 'Bougyues'
      },
      lat: 39.91,
      lng: 15.75,
      message: '',
      focus: false,
      draggable: false
    },
    osloMarker: {
      student: {
        firstname: 'Bob',
        lastname: 'Haha'
      },
      company: {
        name: 'Ornage'
      },
      lat: 59.91,
      lng: 10.75,
      message: '',
      focus: false,
      draggable: false
    }
  };
}]);

