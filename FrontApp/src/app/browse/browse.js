angular.module( 'shapter.browse', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.tag',
  'resources.item',
  'shapter.item',
  'services.appText',
  'shapter.contribute'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'browse', {
    url: '/schools/:schoolId/browse',
    reloadOnSearch: 'false',
    views: {
      "main": {
        controller: 'BrowseCtrl',
        templateUrl: 'browse/browse.tpl.html'
      }
    },
    data:{ pageTitle: 'Parcourir' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser,
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }]
    }
  });
}])

.controller( 'BrowseCtrl', [ '$scope', '$location', 'Item', 'Tag', '$q', '$filter', 'filterFilter', 'security', 'Analytics', '$rootScope', 'AppText', 'editDiagramFactory', 'ItemCommentsModal', '$document', '$stateParams', 'school', function BrowserCtrl( $scope, $location, Item, Tag, $q, $filter, filterFilter, security, Analytics, $rootScope, AppText, editDiagramFactory, ItemCommentsModal, $document, $stateParams, school ) {

  Analytics.browse();
  $scope.root = $rootScope;

  $scope.categories = $rootScope.item_categories;

  $scope.school = school;
  $scope.ItemCommentsModal = ItemCommentsModal;
  $scope.editDiagramFactory = editDiagramFactory;
  $scope.Tag = Tag;
  $scope.AppText = AppText;
  $scope.security = security;
  $scope.$location = $location;

  $scope.tagsSuggestions = {};
  $scope.displayTags = true;
  $scope.itemsLoading = false;
  $scope.batchLoading = false;
  $scope.tagsLoading = null;
  $scope.itemsList = [];
  $scope.arrayDisplay = true;
  $scope.nbItems = 0;
  $scope.batchSize = 8;
  $scope.active = {};
  $scope.active.item = null;
  $scope.activeTags = [];
  $scope.batchesLoaded = [];
  $scope.lastBatchLoaded = $scope.batchesLoaded[ $scope.batchesLoaded.length - 1 ];

  $scope.nav = function( state ){
    $location.search( 'nav', state ).search( 'filter', null);
    $scope.update();
    Analytics.changeNav( state );
  };

  if( !school.constructorFunnel ){
    Tag.getConstructorFunnel( school ).then( function( response ){
      school.constructorFunnel = response.constructor_funnel;
    });
  }

  $scope.toggleDisplayTags = function(){
    $scope.displayTags = !$scope.displayTags;
    Analytics.smallScreenToggleTagDisplay();
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = [ $stateParams.schoolId ];
    return Tag.typeahead( string, tag_ids, 'item', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  // check type of an object
  toType = function( obj ) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
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

  $scope.multipleSchools = function(){
    return security.currentUser.schools.length > 1;
  };

  // autocomplete for tagsinput
  $scope.getAutocomplete = function(query){
    return $q.when( $filter( 'shorterFirstFilter' )($filter( 'ignoreAccentsFilter' )( filterFilter( Tag.getSchoolTags(), query ))));
  };

  $scope.activateItem = function( item ){
    if( $scope.active.item !== null && item.id == $scope.active.item.id ){
      $scope.active.item = null;
    }
    else {
      item.loadComments().then( function(){
        $scope.active.item = item;
      });
      item.getDocs();
      item.loadUserDiagram();
      item.loadDescription();
    }
  };

  $scope.schoolNav = function( school ){
    $location.path( "/schools/" + school.id ).search( 'filter', null );
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

      var newFilters = toArray( $location.search().filter ) || [];
      newFilters.push( tag.id );
      $location.search( 'filter', newFilters );
    }
  };

  // detect user removing tag in tags-input
  $scope.onTagRemoved = function( tag ){
    if( $scope.isInUrl(tag) === true ){

      $scope.nbItems = 0;
      $scope.itemsList = [];

      var newFilters = toArray( $location.search().filter );
      newFilters.splice( newFilters.indexOf( tag.id ), 1 );
      $location.search( 'filter', newFilters );
    }
  };

  // removes a tag from active tags
  $scope.removeTag = function( tag ){
    $scope.onTagRemoved( tag );
    Analytics.removeTag( tag, 'browse' );
  };

  $scope.$watch( function(){
    return $location.search().nav;
  }, function(){
    $scope.update();
  });

  $scope.$watch( function(){
    return $location.search().filter;
  }, function( newVal, oldVal ){
    if( oldVal != newVal ){
      $scope.update();
    }
  }, true);

  $scope.update = function(){
    // initializes data
    $scope.itemsList = [];
    $scope.nbItems = 0;
    $scope.batchesLoaded = [];
    $scope.tagsSuggestions = {};

    // loads data
    $scope.updateScopeTags();
    $scope.loadFilteredItems();

  };

  // loads tags suggestions 
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

      Tag.getSuggestedTags( array, 'item', 200, category ).then( function( response ){
        $scope.tagsSuggestions[ category ] = response.recommended_tags;
      }, function(){
        console.log( 'error' );
        $scope.tagsSuggestions[ category ] = [];
      });
    }
  };

  $scope.getRemainingCatSuggestions = function(){
    angular.forEach( $filter( 'catFilter')( $scope.categories ).others, function( cat ){
      $scope.getSuggestedTags( cat );
    });
  };

  // load filtered items
  $scope.loadFilteredItems = function(){
    /*if( $scope.activeTags.length > 0 ){*/
    $scope.loadMoreItems();
    /*}*/
  };

  $scope.loadMoreItems = function(){
    $scope.batchIndexToLoad = $scope.batchesLoaded.length > 0 ? $scope.batchesLoaded[ $scope.batchesLoaded.length - 1 ] + 1 : 0;

    if( $scope.itemsLoading === false && $scope.batchLoading === false && ( $scope.batchIndexToLoad === 0 || $scope.nbItems > $scope.batchSize * $scope.batchIndexToLoad)){

      $scope.batchLoading = true;
      var array = [];
      angular.forEach( toArray( $location.search().filter), function( id ){
        array.push( id );
      });
      array.push( $stateParams.schoolId );

      var quality_filter = $scope.activeTags.length === 0;
      var cart_only = $location.search().nav == 'favourites';

      return Item.getListFromTags( array, false, $scope.batchSize, $scope.batchIndexToLoad, quality_filter, cart_only ).then( function( response ){

        $scope.nbItems = response.number_of_results;
        $scope.batchesLoaded.push( $scope.batchIndexToLoad );

        angular.forEach( response.items, function( item ){
          $scope.itemsList.push( item );
        });
        //$scope.determineCategories( $scope.itemsList );


        $scope.itemsLoading = false;
        $scope.batchLoading = false;

        return response.items.length > 0;
      }, function(x){
        $scope.batchLoading = false;
        $scope.itemsLoading = false;
        return false;
      });
    }
    else {
      return false;
    }

  };


  // match url tags id and scope tags 
  $scope.updateScopeTags = function(){
    var scopeTags = [];
    angular.forEach( toArray( $location.search().filter ), function( tagId ){
      Tag.get( tagId ).then( function( tag ){
        scopeTags.push( tag );
      });
    });
    $scope.activeTags = scopeTags;
  };

  // add or remove Suggested Tag
  $scope.addSuggestedTag = function( tag ){
    if( $scope.isInUrl( tag )){
      $scope.onTagRemoved( tag );
    }
    else {
      $scope.onTagAdded( tag );
    }
  };

  $scope.addTag = function( tag ){
    $scope.onTagAdded( tag );
    Analytics.addTag( tag, 'browse' );
  };

  $scope.addTextTag = function(){
    $scope.addTag( $scope.typedTag );
    $scope.typedTag = null;
  };

  $scope.changeSchool = function( schoolId ){
    $location.path("/schools/" + schoolId + "/browse").search('filter', null);
  };

  $scope.setArrayDisplay = function(){
    $scope.arrayDisplay = true;
    Analytics.arrayDisplayOnBrowse();
  };

  $scope.setCardsDisplay = function(){
    $scope.arrayDisplay = false;
    Analytics.cardsDisplayOnBrowse();
  };

  $scope.addFrequentSearch = function( step, school ){
    var newFilters = [];
    angular.forEach( step.tag_ids, function( id ){
      if( id != $stateParams.schoolId ){
        newFilters.push( id );
      }
    });
    var search = {
      filter: newFilters
    };

    // select the default categories bro

    $location.search( search );
    Analytics.addFrequentSearch();
  };

  $scope.previous = function(){
    $scope.activateItem( $scope.itemsList[ $scope.itemsList.indexOf( $scope.active.item ) - 1 ]);
    Analytics.previousItem();
  };

  $scope.next = function(){
    $scope.currentIndex = $scope.itemsList.indexOf( $scope.active.item );
    if( $scope.currentIndex == $scope.itemsList.length - 1 && $scope.currentIndex < $scope.nbItems - 1 ){
      $scope.loadMoreItems().then( function( response ){
        if( response === true ){
          $scope.next();
          return;
        }
      });
    }
    else {
      $scope.activateItem( $scope.itemsList[ $scope.itemsList.indexOf( $scope.active.item ) + 1 ]);
      Analytics.nextItem();
    }
  };

  $scope.update();

}])

.filter( 'score', [function(){
  return function( input, length ){
    if ( length === 0 ){
      return input;
    }
    else {
      var out = [];
      angular.forEach( input, function( tag ){
        if ( tag.score < length ){
          out.push( tag );
        }
      });
      return out;
    }
  };
}])

.filter( 'notAlreadyThere', [function(){
  return function( input, list ){
    var out = [];

    angular.forEach( input, function( item ){
      var there = false;
      angular.forEach( list, function( listItem ){
        if (item.id == listItem.id ){
          there = true;
        }
      });
      if( there === false ){
        out.push( item );
      }
    });

    return out;
  };
}])

.filter( 'congruance', [function(){
  return function( input, val, mod ){
    var out = [];

    angular.forEach( input, function( value, key ){
      if( key % mod == val ){
        out.push( value );
      }
    });

    return out;
  };
}])

.filter( 'displayNb', [function(){
  return function( input, nb ){
    var out = input.slice( 0, nb );
    return out;
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
