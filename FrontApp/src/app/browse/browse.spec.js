describe( 'BrowseCtrl', function() {

  var $stateParams, $location, $rootScope, $scope, createController, security;

  beforeEach(function(){
    module('shapter.browse');

    module(function( $provide ){

      var tags = [
        {
        id: '1',
        name: "lol"
      },
      {
        id: '2',
        name: "haha"
      }
      ];

      $provide.provider('ItemCommentsModal', function () { 
        this.$get = function () {
          return {
            openModal: function(){
              return $q.when({});
            }
          };
        };
      });
      $provide.provider('security', function () { 
        this.$get = function () {
          return {
            currentUser: {
              schools: [
                {
                name: "Centrale Lyon",
                id: 1
              }
              ]
            }
          };
        };
      });

      $provide.provider('Analytics', function () { 
        this.$get = function () {
          return {
            addTag: function(){
            },
            browse: function(){
            },
            removeTag: function(){
            },
            selectItem: function(){
            }
          };
        };
      });

      $provide.provider('Tag', function () { 
        this.$get = function ( $q ) {
          return {
            loadSchoolTags: function(){
            },
            getConstructorFunnel: function(){
              return $q.when( tags );
            },
            getSuggestedTags: function(){
              return $q.when( tags );
            },
            getSchoolTags: function(){
              return tags;
            },
            getSchoolTagIndex: function(){
              return {
                "1234": {
                  id: "1234",
                  name: "lol"
                },
                "5678": {
                  id: "5678",
                  name: "haha"
                }
              };
            }

          };
        };
      });

      $provide.provider('Item', function () { 
        this.$get = function ( $q ) {
          return {
            getListFromTags: function(){
              return $q.when([
                {
                name: "lol",
                id: "3"
              }
              ]);
            }
          };
        };
      });

      $provide.provider('Colors', function () { 
        this.$get = function ( ) {
          return {
            getColor: function(){
            }
          };
        };
      });
    });
  });

  beforeEach( inject( function( $injector ){

    $location = $injector.get( '$location' );
    $stateParams = $injector.get( '$stateParams' );
    $stateParams.schoolId = 0;
    $rootScope = $injector.get( '$rootScope' );
    $scope = $rootScope.$new();
    var $controller = $injector.get( '$controller' );

    createController = function(){
      return $controller( 'BrowseCtrl', {
        '$scope': $scope
      });
    };
  }));

  /*
  it( 'should have a toArray function', inject( function() {
    var controller = createController();
    var a = ["1", "2", "4"];
    var b = "3";
    expect( toArray(a) ).toEqual(a);
    expect( toArray(b) ).toEqual(["3"]);
  }));

  it( 'should have an empty itemsList at bootstrap', inject( function() {
    var controller = createController();
    expect( $scope.itemsList ).toEqual( [] );
  }));

  it( 'should check an objects type correctly', inject( function() {
    var controller = createController();

    var tab = [1, 2, 3, 4];
    var entier = 2;
    var chaine = "lol";

    expect( toType( tab )).toBe("array");
    expect( toType( entier )).toBe("number");
    expect( toType( chaine )).toBe("string");
  }));

  it( 'should have a itemsLoading field set to false', inject( function() {
    var controller = createController();
    expect( $scope.itemsLoading ).toBe(false);
  }));

  it( 'should have an $scope.isInUrl function checking if a tag Id is present in search filter', inject( function() {
    var controller = createController();
    var tag = {
      id: "1234",
      name: 'Tag'
    }, tag2 = {
      id: "8901",
      name: 'Tag'
    };
    $location.search( 'filter', ["1234", "4567"] );
    expect( $scope.isInUrl( tag )).toBe(true);
    expect( $scope.isInUrl( tag2 )).toBe(false);
  }));

  it( 'should update the url when a tag is hand entered or removed', inject( function() {
    var controller = createController();
    var tag = {
      id: "1234",
      name: 'Tag'
    }, tag2 = {
      id: "5678",
      name: 'Tag2'
    };

    $scope.onTagAdded( tag );
    expect( $location.search().filter ).toEqual( ["1234"] );

    $scope.onTagAdded( tag2 );
    expect( $location.search().filter ).toEqual( ["1234", "5678"] );

    $scope.onTagAdded( tag );
    expect( $location.search().filter ).toEqual( ["1234", "5678"] );

    $scope.onTagRemoved( tag );
    expect( $location.search().filter ).toEqual( ["5678"] );

  }));

  it( 'should call items/filters when url is changed and put results in scope', inject( function() {
    var controller = createController();

    spyOn( $scope, 'loadFilteredItems');
    spyOn( $scope, 'loadSuggestedTags');
    spyOn( $scope, 'updateScopeTags');

    //$location.search( 'filter', ["1234"] );
    $scope.$apply();

//    expect( $scope.loadFilteredItems ).toHaveBeenCalled();
 //   expect( $scope.loadSuggestedTags ).toHaveBeenCalled();
  //  expect( $scope.updateScopeTags ).toHaveBeenCalled();

  }));

  it( 'should clean unknown search().filter in url', inject( function(){
    var controller = createController();
    var filter = ["1234", "5678", "hahaha"];
    $location.search('filter', filter);

    $scope.$emit( '$locationChangeSuccess' );
    $scope.$emit( '$locationChangeSuccess' );

   // expect( $location.search().filter ).toEqual( ["1234"] );
  }));
  */

});
