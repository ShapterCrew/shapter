angular.module( 'shapter.internships', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.category',
  'services.appText'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'Internships', {
    url: '/schools/:schoolId/internships',
    reloadOnSearch: 'false',
    views: {
      "main": {
        controller: 'InternshipsCtrl',
        templateUrl: 'internships/internships.tpl.html'
      }
    },
    data:{ pageTitle: 'Internships' }
  });
}])

.controller('InternshipsCtrl', ['$scope', 'security', '$location', 'Internship', 'Tag', '$rootScope', '$timeout', '$stateParams', 'shAddInternshipModalFactory', 'Analytics', '$filter', function( $scope, security, $location, Internship, Tag, $rootScope, $timeout, $stateParams, shAddInternshipModalFactory, Analytics, $filter ){

  Analytics.internships();
  $scope.shAddInternshipModalFactory = shAddInternshipModalFactory;
  $scope.security = security;
  $scope.$location = $location;
  $scope.view = 'map';
  $scope.activeTags = [];
  $scope.internshipTags = [];
  $scope.tagsSuggestions = {};
  $scope.$rootScope = $rootScope;

  $scope.toggleCumulateTags = function(){
    Analytics.toggleCumulateTags();
  };

  $scope.nav = function( state ) {
    $location.search('nav', state).search('filter', null);
    $scope.update();
    Analytics.changeNav( state );
  };

  // used to convert $location.search into an array
  toArray = function( obj ){
    if( toType( obj ) == 'array'){
      return obj;
    }
    else if( toType( obj ) == 'number'){
      return [ obj ];
    }
    else if( toType( obj ) == "string"){
      return [obj];
    }
    else{ 
      return [];
    }
  };

  $scope.onCreated = function(){
    if( toArray( $location.search().filter ).length > 0 ){
      $location.search('filter', null);
    }
    else {
      $scope.update();
    }
  };

  $scope.update = function() {
    $scope.updateScopeTags();
    $scope.updateInternshipsList();
    $scope.tagsSuggestions = {};
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = [ $stateParams.schoolId ];
    return Tag.typeahead( string, tag_ids, 'internship', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  $scope.$watch( function(){
    return $location.search().filter;
  }, function( newVal, oldVal ){
    if( oldVal != newVal ){
      $scope.update();
    }
  }, true);

  // fetches the name of the tags in url
  $scope.updateScopeTags = function(){
    var scopeTags = [];
    angular.forEach( toArray( $location.search().filter ), function( tagId ){
      Tag.get( tagId ).then( function( tag ){
        scopeTags.push( tag );
      });
    });
    $scope.activeTags = scopeTags;
  };

  // retrieves tag suggestions
  $scope.getSuggestedTags = function( category ){
    if( $scope.tagsSuggestions[ category ] === undefined ){
      $scope.tagsSuggestions[ category ] = 'loading';
      var array = [];
      angular.forEach( toArray( $location.search().filter ), function( id ){
        if( !!id ){
          array.push( id );
        }
      });
      array.push( $stateParams.schoolId );

      Tag.getSuggestedTags( array, 'internship', 200, category ).then( function( response ){
        $scope.tagsSuggestions[ category ] = response.recommended_tags;
      }, function(){
        console.log( 'error' );
        $scope.tagsSuggestions[ category ] = [];
      });
    }
  };

  $scope.getRemainingCatSuggestions = function(){
    angular.forEach( $filter( 'internshipsCatFilter')( $rootScope.internship_categories ).others, function( cat ){
      $scope.getSuggestedTags( cat );
    });
  };

  // load internships to be displayed
  $scope.updateInternshipsList = function() {
    var current_only = $location.search().nav == "current";
    var array = [ $stateParams.schoolId ];
    // Initialize tags with filter param in url
    angular.forEach( toArray( $location.search().filter ), function( id ){
      array.push( id );
    });

    // Call the API to have internships with such tags
    Internship.getListFromTags(array, current_only).then(function(response){
      angular.forEach( response.internships, function( internship ){
      });
      $scope.internshipsList = response.internships;
      $scope.nbInternships = response.number_of_results;
    });
  };

  // tells if a tag Id is already present in url
  $scope.isInUrl = function( tag ){
    var out = false;
    angular.forEach( toArray( $location.search().filter ), function( tagId ){
      if( tag.id == tagId ){
        out = true;
      }
    });
    return out;
  };

  // detect user input in tags-input
  $scope.onTagAdded = function( tag ){
    if( $scope.isInUrl(tag) === false && tag.id != $stateParams.schoolId ){
      $scope.nbItems = 0;
      $scope.itemsList = [];

      var newFilters;
      if( $scope.cumulateFilters ){
      newFilters = toArray( $location.search().filter ) || [];
      } 
      else {
        newFilters = [];
      }
      newFilters.push( tag.id );
      $location.search( 'filter', newFilters );
    }
  };

  $scope.onTagRemoved = function( tag ){
    if( $scope.isInUrl(tag) === true ){
      var newFilters = toArray( $location.search().filter );
      newFilters.splice( newFilters.indexOf( tag.id ), 1 );
      $location.search( 'filter', newFilters );
    }
  };

  $scope.addTag = function(tag) {
    $scope.displayCumulateFilters = true;
    $scope.onTagAdded(tag);
    Analytics.addTag( tag, 'internships' );
  };

  $scope.removeTag = function(tag) {
    $scope.onTagRemoved(tag);
    Analytics.removeTag( tag, 'internships' );
  };

  $scope.addTextTag = function() {
    $scope.addTag( $scope.typedTag );
    $scope.typedTag = null;
  };

  $scope.update();
}])

.filter('categories', [ 'orderByFilter', function( orderByFilter ){
  orderByBestScore = function( array ){
    var bestScore = function( array ){
      return array.reduce( function(last, now ){
        return Math.max( last, now.score );
      }, 0);
    };
    return orderByFilter( array, bestScore, true );
  };

  return function( input ){
    return input ? orderByBestScore( orderByFilter( input, ['category', 'score'], true ).reduce( function(last, now){
      if( last.length === 0 ){
        last = [ [now ] ];
      }
      else if( last[ last.length - 1 ][0].category == now.category ){
        last[ last.length - 1 ].push( now );
      }
      else{
        last.push( [ now ] );
      }
      return last;
    }, [])
    .map( function(category){
      category[0].displayCategory = category[0].category;
      return category;
    }))
    // trier les sous tableaux par meilleur score
    .reduce( function(last, now){
      return last.concat( now );
    }, []) : [];
  };
}])

.filter('internshipsCatFilter', [function(){
  return function( input ){
    var out = {
      display: [],
      others: []
    };

    angular.forEach( input, function( cat ){
      if( cat == 'skill' || cat == 'geo' || cat == 'company' || cat == 'domain'){
        out.display.push( cat );
      }
      else if ( cat != 'school' && cat != 'internship_name'){
        out.others.push( cat );
      }
    });

    return out;
  };
}]);
