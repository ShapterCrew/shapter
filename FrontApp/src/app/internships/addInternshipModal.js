angular.module( 'directives.addInternshipModal', [
  'security',
  'ui.router'
])
.factory( 'shAddInternshipModalFactory', function($modal) {
  return {
    open: function(currentUser) {
      return $modal.open({
        templateUrl: 'internships/addInternshipModal.tpl.html',
        controller: 'AddInternshipModalCtrl',
        windowClass: 'show'
      });
    }
  };
})

.directive( 'shAddInternshipModal', ['Internship', 'shAddInternshipModalFactory', function( Internship, shAddInternshipModalFactory){
  return {
    restrict: 'A',
    scope: {
      currentUser: '='
    },
    link: function( scope, element, attr ) {
      var currentUser = scope.currentUser;
      element.bind('click', function (event) {
        shAddInternshipModalFactory.open(currentUser);
      });
    }
  };
}])

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', '$stateParams', 'Map', '$filter', '$modalInstance', function($scope, Internship, $stateParams, Map, $filter, $modalInstance ){
  $scope.internship = {};
  $scope.close = $modalInstance.close;
  Map.getFormatedAdresses( '35 rue de la république' );

  $scope.getFormatedAdresses = function( string ){
    $scope.loadingAddresses = true;
    return Map.getFormatedAdresses( string ).then( function( response ){
      $scope.loadingAddresses = false;
      return response.data.results;
    });
  };

  $scope.addInternship = function() {

    Internship.create($filter( 'formatInternshipToPost' )($scope.internship)).then(function(response) {
      $scope.internship = {};
      $scope.close();
    });
  };
}])

.filter('formatInternshipToPost', function(){
  return function( internship ){
    var out = {};

    var tags = [];
    angular.forEach( internship.tags, function(tag, cat) {
      tags.push({tag_name: tag, tag_category: cat});
    });

    angular.forEach( internship.address.address_components, function( component ){
      if( component.types[0] != 'street_number' && component.types[0] != 'route' ){
        tags.push({
          tag_category: 'geo',
          tag_name: component.long_name
        });
      }
    });

    out.title = internship.title;
    out.location = {
      formatted_address: internship.address.formatted_address,
      lat: internship.address.geometry.location.lat,
      lng: internship.address.geometry.location.lng
    };
    out.tags_by_name_cat = tags;
    out.tags_by_ids = [ internship.schoolId ];

    return out;
  };
});
