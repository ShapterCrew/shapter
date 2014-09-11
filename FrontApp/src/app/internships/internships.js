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

.controller('InternshipsCtrl', ['$scope', 'security', '$timeout', function( $scope, security, $timeout ){
  $scope.security = security;
  $scope.view = 'map';
  $scope.internshipsList = {};
  $scope.internshipsList = [{
    student: {
      id: '53fc8eaf4d61632d1a111400',
      image: 'http://graph.facebook.com/746309634/picture',
      firstname: 'Alex',
      lastname: 'lolalilaloule'
    },
    company: {
      name: 'Bougyues'
    },
    start_time: '2014-07-31',
    end_time: '2014-09-04',
    duration: '6',
    year: '2014',
    lat: 39.91,
    lng: 15.75,
    message: '',
    focus: false,
    draggable: false
  },
  {
    student: {
      id: '53fc8eaf4d61632d1a111400',
      firstname: 'Bob',
      lastname: 'Haha'
    },
    company: {
      name: 'Ornage'
    },
    lat: 59.81,
    lng: 11.75,
    message: '',
    focus: false,
    draggable: false
  },
  {
    student: {
      id: '53fc8eaf4d61632d1a111400',
      firstname: 'Bob',
      lastname: 'Haha'
    },
    company: {
      name: 'Ornage'
    },
    lat: 53.81,
    lng: 19.75,
    message: '',
    focus: false,
    draggable: false
  },
  {
    student: {
      id: '53fc8eaf4d61632d1a111400',
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
  }];

}]);

