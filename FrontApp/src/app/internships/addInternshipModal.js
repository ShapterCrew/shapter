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

.directive( 'shAddInternship', [function(){
  return {
    restrict: 'E',
    templateUrl: 'internships/addInternship.tpl.html',
    controller: 'AddInternshipCtrl',
    scope: {
      close: '&'
    }
  };
}])

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

.controller( 'AddInternshipModalCtrl', ['$modalInstance', '$scope', function( $modalInstance, $scope ){
  $scope.close = $modalInstance.close;
}])

.controller( 'AddInternshipCtrl', ['$scope', 'Internship', '$stateParams', 'Map', '$filter', 'AppText', '$rootScope', 'Tag', 'Analytics', 'ConfirmAlertFactory', function($scope, Internship, $stateParams, Map, $filter, AppText, $rootScope, Tag, Analytics, ConfirmAlertFactory){

  Analytics.addInternshipModule();
  $scope.step = 1;
  $scope.AppText = AppText;
  $scope.internship = {
    tags: {} 
  };
  $scope.internship.schoolId = $stateParams.schoolId;
  $scope.sizeOptions = [
    "1-9",
    "10-49",
    "50-199",
    "200-499",
    "500+"
  ];

  $scope.getTypeahead = function( string, cat ){
    return Tag.typeahead( string, [], 'internship', 30, cat).then( function( response ){
      return response.tags;
    });
  };

  var add_new_type = {
    name: 'Ajouter une catégorie de stages'
  };

  $scope.selectInternshipType = function(){
    if( $scope.internship.tags[ 'type' ] == add_new_type.name ){
      $scope.internship.tags[ 'type' ] = null;
      $scope.displayCreateType = true;
    }
    else {
      $scope.displayCreateType = false;
    }
  };

  Tag.getSuggestedTags([ $stateParams.schoolId ], 'internship', 100, 'type').then( function( response ){
    response.recommended_tags.push( add_new_type );
    $scope.internshipTypes = response.recommended_tags;
  }, function( err ){
    console.log( err );
  });

  $scope.getFormatedAdresses = function( string ){
    $scope.loadingAddresses = true;
    return Map.getFormatedAdresses( string ).then( function( response ){
      $scope.loadingAddresses = false;
      return response.data.results;
    });
  };

  $scope.toStepOne = function(){
    $scope.step = 1;
    $scope.internship = {};
    $scope.internship.schoolId = $stateParams.schoolId;
    Tag.getSuggestedTags([ $stateParams.schoolId ], 'internship', 100, 'type').then( function( response ){
      response.recommended_tags.push( add_new_type );
      $scope.internshipTypes = response.recommended_tags;
    }, function( err ){
      console.log( err );
    });
  };

  $scope.addInternship = function() {
    $scope.internship.schoolId = $stateParams.schoolId;
    Internship.create($filter( 'formatInternshipToPost' )($scope.internship)).then(function(response) {
      $scope.internship = response;
      $rootScope.$broadcast( 'InternshipCreated' );
      $scope.step = 2;
      Analytics.internshipCreated();
    }, function(){
      console.log( 'error creating internship' );
    });
  };

  $scope.removeSkill = function( tag ){
    var i = $scope.internship.tags_by_name_cat.indexOf( tag );
    $scope.internship.tags_by_name_cat.splice( i, 1 );
  };

  $scope.updateInternship = function(){
    $scope.internship.tags_by_name_cat = $scope.internship.tags_by_name_cat ? $scope.internship.tags_by_name_cat : [];
    $scope.internship.tags_by_name_cat = $scope.internship.tags_by_name_cat.concat( $filter('formatTags')( $scope.internship.tags ));
    Internship.addTags( $scope.internship.id, [], $scope.internship.tags_by_name_cat ).then( function( response ){
      $rootScope.$broadcast( 'InternshipCreated' );
      $scope.internship = {};
      $scope.internship.schoolId = $stateParams.schoolId;
      $scope.step = 3;
    });
  };

  $scope.showSuccess = function(){
    ConfirmAlertFactory.showMsg();
  };

  $scope.addSelectedSkill = function(){
    if( $scope.internship.skillToBeAdded ){
      $scope.internship.tags_by_name_cat = $scope.internship.tags_by_name_cat ? $scope.internship.tags_by_name_cat : [];
      $scope.internship.tags_by_name_cat.push({
        tag_category: 'skill',
        tag_name: $scope.internship.skillToBeAdded
      });
      $scope.internship.skillToBeAdded = null;
    }
  };

  $scope.closeModule = function(){
    $scope.toStepOne();
    $scope.close();
  };

  facebookData = {
    permalink: '#/' + $stateParams.schoolId + '/internships',
    type: "internship",
    title: $filter( 'language' )( AppText.internships.facebook_share_title ),
    description: $filter( 'language' )( AppText.internships.facebook_share_description ) 
  };
  $scope.facebookData = btoa( JSON.stringify( facebookData ));

}])

.filter('formatTags', [function(){
  return function( tags ){
    var out = [];
    angular.forEach( tags, function(tag, cat) {
      out.push({tag_category: cat, tag_name: tag });
    });
    return out;
  };
}])

.filter('formatInternshipToPost', ['$filter', function( $filter ){
  return function( internship ){
    var out = {};
    internship.tags_by_name_cat = internship.tags_by_name_cat ? internship.tags_by_name_cat : [];
    out.tags_by_name_cat = internship.tags_by_name_cat.concat( $filter( 'formatTags' )( internship.tags ));

    angular.forEach( internship.address.address_components, function( component ){
      if( component.types[0] != 'street_number' && component.types[0] != 'route' && component.types[0] != 'postal_code'){
        out.tags_by_name_cat.push({
          tag_category: 'geo',
          tag_name: component.long_name
        });
      }
    });

    out.description = internship.description;
    out.title = internship.title;
    out.start_date = internship.start_date;
    out.end_date = internship.end_date;

    out.location = {
      formatted_address: internship.address.formatted_address,
      lat: internship.address.geometry.location.lat,
      lng: internship.address.geometry.location.lng
    };

    out.tags_by_ids = [ internship.schoolId ];

    return out;
  };
}]);
