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
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser
    }
  });
}])

.controller('InternshipsCtrl', ['$scope', 'security', '$location', 'Internship', 'Tag', '$rootScope', '$timeout', '$stateParams', function( $scope, security, $location, Internship, Tag, $rootScope, $timeout, $stateParams ){
  $scope.security = security;
  $scope.$location = $location;
  $scope.view = 'map';
  $scope.activeTags = [];
  $scope.internshipTags = [];
  $scope.categories = $rootScope.internship_categories;

  //FIXME: what's this?
  $scope.tagsSuggestions = [];
  
  $scope.nav = function( state ) {
    $location.search('nav', state).search('filter', null);
    $scope.update();
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

  $scope.update = function() {
    $scope.updateScopeTags();
    $scope.loadSuggestedTags();
    $scope.updateInternshipsList();
  };

  $scope.updateScopeTags = function(){
    var scopeTags = [];

    angular.forEach( toArray( $location.search().filter ), function( tagId ){
      scopeTags.push( $scope.schoolTagIndex[ tagId ] );
    });

    $scope.activeTags = scopeTags;
  };

  // loads tags suggestions 
  $scope.loadSuggestedTags = function(){
    $scope.tagsLoading = true;
    var array = [];
    angular.forEach( toArray( $location.search().filter ), function( id ){
      array.push( id );
    });
    Tag.getSuggestedTags( array ).then( function( response ){
      $scope.tagsSuggestions = response;
      $scope.tagsLoading = false;
    });
  };

  $scope.updateInternshipsList = function() {
    var current_only = $location.search().nav == "current";
    var array = [ $stateParams.schoolId ];
    // Initialize tags with filter param in url
    angular.forEach( toArray( $location.search().filter ), function( id ){
      array.push( id );
    });

    // Call the API to have internships with such tags
    Internship.getListFromTags(array, current_only).then(function(response){
      $scope.internshipsList = response.internships;
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

  $scope.onTagAdded = function( tag ){
    if( $scope.isInUrl(tag) === false && $scope.schoolTagIndex[ tag.id ] && tag.id != $stateParams.schoolId ){
      var newFilters = toArray( $location.search().filter ) || [];
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
    $scope.onTagAdded(tag);
  };

  $scope.removeTag = function(tag) {
    $scope.onTagRemoved(tag);
  };

  $scope.addTextTag = function() {
    $scope.addTag($scope.typedTag);
  };
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
