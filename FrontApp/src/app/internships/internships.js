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
      internshipTags: ['Tag', function(Tag) {
        return Tag.getInternshipTags();
      }]
    }
  });
}])

.controller('InternshipsCtrl', ['$scope', 'security', '$location', 'Internship', 'Tag', 'internshipTags', '$rootScope', '$timeout', function( $scope, security, $location, Internship, Tag, internshipTags, $rootScope, $timeout ){
  $scope.security = security;
  $scope.view = 'map';
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
  $scope.activeTags = [];
  $scope.internshipTags = internshipTags;
  //FIXME: what's this?
  $scope.tagsSuggestions = [];
  $scope.categories = $rootScope.categories;
  
  $scope.nav = function( state ) {
    $location.search('nav', state).search('filter', null);
    $scope.update();
  };

  $scope.update = function() {
    $scope.updateScopeTags();
    $scope.loadSuggestedTags();
    $scope.updateInternshipsList();
  };

  // loads tags suggestions 
  $scope.loadSuggestedTags = function(){
    $scope.tagsLoading = true;
    var array = [];
    angular.forEach( toArray( $location.search().filter ), function( id ){
      array.push( id );
    });
    array.push( school.id );
    Tag.getSuggestedTags( array ).then( function( response ){
      $scope.tagsSuggestions = response;
      $scope.tagsLoading = false;
    });
  };

  $scope.updateInternshipsList = function() {
    var current_only = $location.search().nav == "current";
    var array = [];
    // Initialize tags with filter param in url
    angular.forEach( toArray( $location.search().filter), function( id ){
      array.push( id );
    });
    array.push( $stateParams.schoolId );

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

.filter('catFilter', [function(){
  return function( input ){
    var out = {
      display: [],
      others: []
    };

    angular.forEach( input, function( cat ){
      if( cat == 'formation' || cat == 'choice' || cat == 'teacher' || cat == 'department' || cat == 'admin' || cat == 'skill'){
        out.display.push( cat );
      }
      else if ( cat != 'school' && cat != 'item_name'){
        out.others.push( cat );
      }
    });

    return out;
  };
}]);
