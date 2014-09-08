angular.module( 'shapter.tagsAdmin', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'tagsAdmin', {
    url: '/tagsadmin',
    reloadOnSearch: false,
    views: {
      "main": {
        controller: 'TagsAdminCtrl',
        templateUrl: 'tagsAdmin/tagsAdmin.tpl.html'
      }
    },
    data:{ pageTitle: 'Tags Admin' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAdminUser,
      allTags: ['Tag', function( Tag ){
        return Tag.getAllTags();
      }]
    }
  });
}])

.controller( 'TagsAdminCtrl', ['$scope', 'Tag', 'Item', 'security', '$location', '$q', '$filter', 'filterFilter', 'User', 'Type', function( $scope, Tag, Item, security, $location, $q, $filter, filterFilter, User, Type ){

  $scope.Tag = Tag;
  $scope.Type = Type;
  $scope.alerts = [];
  $scope.nav = "tagItems";
  $scope.selectedItems = [];
  $scope.activeTags = [];
  $scope.security = security;
  Tag.loadAllTags();

  $scope.changeSchool = function( tag ){
  };

  $scope.selectItem = function( item ){
    if( $scope.selectedItems.indexOf( item ) == -1 ){
      $scope.selectedItems.push( item );
      item.active = true;
      item.loadFullItem();
    }
    else{
      $scope.selectedItems.splice( $scope.selectedItems.indexOf( item ), 1);
      item.active = false;
    }
  };

  $scope.deselectAll = function(){
    angular.forEach( $scope.itemsList, function( item ){
      item.active = false;
      $scope.selectedItems.splice( $scope.selectedItems.indexOf( item ), 1);
    });
  };

  $scope.deleteAll = function(){
    angular.forEach( $scope.selectedItems, function( item ){
      item.remove();
    });
    $scope.emptySelection();
    $scope.loadFilteredItems();
  };

  $scope.selectAll = function(){
    angular.forEach( $scope.itemsList, function( item ){
      if( $scope.selectedItems.indexOf( item ) == -1 ){
        $scope.selectedItems.push( item );
        item.active = true;
        item.loadFullItem();
      }
    });
  };

  $scope.emptySelection = function(){
    angular.forEach( $scope.selectedItems, function( item ){
      item.active = false;
    });
    $scope.selectedItems = [];
  };

  $scope.deleteTag = function( tag ){
    $scope.alerts = [];
    Tag.deleteTag( $scope.tag ).then( function( response ){
      Tag.loadAllTags();
      $scope.alerts.push({
        text: "Le tag a bien été supprimé",
        type: "warning"
      });
    }, function(x){
      alert( 'Il y a eu une erreur' );
    });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  // copied from browse.js -_-

  $scope.itemsLoading = false;
  $scope.itemsList = [];

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

  // autocomplete for tagsinput
  $scope.getAutocomplete = function(query){
    return $q.when( $filter( 'shorterFirstFilter' )($filter( 'ignoreAccentsFilter' )( filterFilter( Tag.getAllTags(), query ))));
  };

  $scope.onTagAdded = function(){
    $scope.loadFilteredItems();
  };

  $scope.onTagRemoved = function(){
    $scope.loadFilteredItems();
  };

  // load filtered items
  $scope.loadFilteredItems = function(){
    $scope.itemsLoading = true;
    var selectedIndex = {};
    var itemsList = [];
    Item.getListFromTags( activeTags, true).then( function( response ){
      $scope.itemsLoading = false;
      $scope.tagsItemsNb = response.number_of_results;

      angular.forEach( $scope.selectedItems, function( selectedItem ){
        selectedIndex[ selectedItem.id ] = selectedItem;
      });

      angular.forEach( response.items, function( item ){
        if( selectedIndex[ item.id ]){
          item.active = true;
          $scope.selectedItems[ $scope.selectedItems.indexOf( selectedIndex[ item.id ]) ] = item;
          item.loadFullItem();
        }
      });

      $scope.itemsList = response.items;
    }, function(x){
      $scope.itemsLoading = false;
    });
  };

  if( Tag.getTagIndex().length > 0 ){
    $scope.$emit( '$locationChangeSuccess' );
  }

  // get intersection of selected items tags
  $scope.getIntersection = function(){
    var tags = [];
    angular.forEach( $scope.selectedItems, function( item ){
      tags.push( item.tags );
    });
    return $filter( 'intersectFilter' )( tags );
  };

  $scope.removeTag = function(){
    var prom = [
      Tag.loadAllTags
    ];
    angular.forEach( $scope.selectedItems, function( item, key ){
      item.removeTag( $scope.tagToBeRemoved ).then( function(){
        item.loadFullItem();
      });
    });
    $q.all( prom ).then( function(){
    }, function(x){
      alert( 'erreur' );
    });
    $scope.tagToBeRemoved = null;
  };

  $scope.addNewTag = function( tag ){
    Tag.tagBatch( tag, $scope.selectedItems ).then( function( tag ){
      Tag.loadAllTags();
      angular.forEach( $scope.selectedItems, function( item ){
        item.tags.push( tag );
      });
      $scope.newTag = null;
    }, function(){
      alert( 'erreur' );
    });
  };

  $scope.initNewStudents = function(){
    $scope.newStudents = {
      list: [{
        email: ''
      }],
      schoolTags: []
    };
  };

  $scope.initNewStudents();

  $scope.onTagRemovedNewStudent = function( index ){
    $scope.newStudents.splice( index, 1 );
  };

  $scope.addTagNewStudent = function(){
    $scope.newStudents.schoolTags.push( $scope.newStudents.typedTag );
    $scope.newStudents.typedTag = null;
  };


  $scope.addEmail = function(){
    $scope.newStudents.list.push({
      email: ''
    });
  };

  $scope.addStudents = function(){
    angular.forEach( $scope.newStudents.list, function( student ){
      User.addSignupPermission( student.email, $scope.newStudents.schoolTags );
    });
    $scope.initNewStudents();
  };

  $scope.newItems = {
    items: [{
      name: ''
    }]
  };

  $scope.addSupNewItem = function(){
    $scope.newItems.items.push({
      name: ''
    });
  };

  $scope.addTagNewItem = function(){
    $scope.newItems.tags = $scope.newItems.tags ? $scope.newItems.tags : [];
    $scope.newItems.tags.push( $scope.newItems.typedTag );
    $scope.newItems.typedTag = null;
  };

  $scope.onTagRemovedNewItem = function( index ){
    $scope.newItems.tags.splice( index, 1 );
  };

  $scope.createItems = function(){
    return Item.createTaggedItems( $scope.newItems.items, $scope.newItems.tags );
  };

  // constructor funnel 

  $scope.constructorFunnel = [];
  $scope.loadTagConstructor = function(){
    $scope.constructorTag = security.currentUser.schools[ 0 ];

    Tag.getConstructorFunnel( $scope.constructorTag ).then( function( response ){
      if( response.constructor_funnel ){
        $scope.constructorFunnel = response.constructor_funnel;
        angular.forEach( $scope.constructorFunnel, function( step ){
          step.tags = step.tags ? step.tags : [];
          step.default_types = step.default_types ? step.default_types : [];
          angular.forEach( step.tag_ids, function( id ){
            step.tags.push( Tag.getTagIndex()[ id ] );
          });
        });
      }
      else {
        $scope.constructorFunnel = [
          {
          'name': '',
          'tags': [ $scope.constructorTag ],
          'default_types': []
        }
        ];
      }
    }, function( x ){
      alert( x );
    });
  };

  $scope.addConstructorStep = function(){
    $scope.constructorFunnel.push({
      'name': '',
      'tags': [ $scope.constructorTag ],
      'default_types': []
    });
  };

  $scope.addTagConstructorFunnel = function( step ){
    step.tags = step.tags ? step.tags : [];
    step.tags.push( step.typedTag );
    step.typedTag = null;
  };

  $scope.onTagRemovedConstructorFunnel = function( index, step ){
    step.tags.splice( index, 1 );
  };

  $scope.setTagConstructor = function(){
    angular.forEach( $scope.constructorFunnel, function( step ){
      step.tag_ids = [];
      angular.forEach( step.tags, function( tag ){
        step.tag_ids.push( tag.id );
      });
    });

    Tag.setConstructorFunnel( $scope.constructorFunnel, $scope.constructorTag ).then( function( response ){
    }, function(x){
      alert( x );
    });

  };


  // signup funnel 
  $scope.signupFunnel = [];

  $scope.loadTagSignup = function(){
    $scope.signupTag = security.currentUser.schools[ 0 ];

    Tag.getSignupFunnel( $scope.signupTag ).then( function( response ){
      if( response.signup_funnel ){
        $scope.signupFunnel = response.signup_funnel;
        angular.forEach( $scope.signupFunnel, function( step ){
          step.tags = step.tags ? step.tags : [];
          angular.forEach( step.tag_ids, function( id ){
            step.tags.push( Tag.getTagIndex()[ id ] );
          });
        });
      }
      else {
        $scope.signupFunnel = [
          {
          'name': '',
          'tags': [ $scope.signupTag ]
        }
        ];
      }
    }, function( x ){
      alert( x );
    });
  };

  $scope.addSignupStep = function(){
    $scope.signupFunnel.push({
      'name': '',
      'tags': [ $scope.signupTag ]
    });
  };

  $scope.addTagSignupFunnel = function( step ){
    step.tags = step.tags ? step.tags : [];
    step.tags.push( step.typedTag );
    step.typedTag = null;
  };

  $scope.onTagRemovedSignupFunnel = function( index, step ){
    step.tags.splice( index, 1 );
  };

  $scope.setTagSignup = function(){
    angular.forEach( $scope.signupFunnel, function( step ){
      step.tag_ids = [];
      angular.forEach( step.tags, function( tag ){
        step.tag_ids.push( tag.id );
      });
    });

    Tag.setSignupFunnel( $scope.signupFunnel, $scope.signupTag ).then( function( response ){
    }, function(x){
      alert( x );
    });

  };

}])

.filter( 'intersectFilter', [function(){

  return function( input ){

    if( input.length === 0 ){
      return [];
    }
    else if( input.length == 1){
      return input[0];
    }
    else{
      var out = input[ 0 ];

      // pour chaque tableau de tags
      angular.forEach( input, function( tagsArray ){
        var newOut = [];

        // pour chacun des tags déjà filtrés
        angular.forEach( out, function( outTag, outTagKey ){
          angular.forEach( tagsArray, function( tag ){
            if( tag.id == outTag.id ){
              newOut.push( tag );
            }
          });
        });
        out = newOut;
      });
      return out;
    }
  };
}]);
