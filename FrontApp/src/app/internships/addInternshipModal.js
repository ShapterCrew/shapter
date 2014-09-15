angular.module( 'directives.addInternshipModal', [
  'security',
  'ui.router'
])

.factory( 'shAddInternshipModalFactory', function($modal) {
  return {
    open: function() {
      var modal =  $modal.open({
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
    link: function( scope, element, attr ) {
      element.bind('click', function (event) {
        shAddInternshipModalFactory.open();
      });
    }
  };
}])

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', '$stateParams', 'Map', '$filter', '$modalInstance', 'AppText', '$rootScope', 'Tag', 'Analytics', function($scope, Internship, $stateParams, Map, $filter, $modalInstance, AppText, $rootScope, Tag, Analytics ){

  Analytics.addInternshipModule();
  $scope.AppText = AppText;
  $scope.internship = {};
  $scope.internship.schoolId = $stateParams.schoolId;
  $scope.close = $modalInstance.close;

  $scope.getCompaniesTypeahead = function( string ){
    return Tag.typeahead( string, [], 'internship', 30, 'company').then( function( response ){
      return response.tags;
    });
  };

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
      $rootScope.$broadcast( 'InternshipCreated' );
      $scope.close();
      Analytics.internshipCreated();
    });
  };

}])

.filter('formatInternshipToPost', function(){
  return function( internship ){
    var out = {};

    var tags = [];
    angular.forEach( internship.tags, function(tag, cat) {
      tags.push({tag_category: cat, tag_name: tag });
    });

    angular.forEach( internship.address.address_components, function( component ){
      if( component.types[0] != 'street_number' && component.types[0] != 'route' && component.types[0] != 'postal_code'){
        tags.push({
          tag_category: 'geo',
          tag_name: component.long_name
        });
      }
    });

    out.title = internship.title;
    out.start_date = internship.start_date;
    out.end_date = internship.end_date;

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
