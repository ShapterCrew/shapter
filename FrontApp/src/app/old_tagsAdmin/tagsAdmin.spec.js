describe( 'TagsAdminCtrl', function() {

  var $location, $rootScope, $scope, createController, security;
  beforeEach(function(){
    module('shapter.tagsAdmin');

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

      $provide.provider('User', function () { 
        this.$get = function () {
          return {
            addSignupPermission: function(){
            }
          };
        };
      });

      $provide.provider('Type', function () { 
        this.$get = function () {
          return {
            getAll: function(){
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
                name: "Centrale Lyon"
              }
              ]
            }
          };
        };
      });

      $provide.provider('Tag', function () { 
        this.$get = function ( $q ) {
          return {
            getSignupFunnel: function( tag ){
              return $q.when( tag );
            },
            getSuggestedTags: function(){
              return $q.when( tags );
            },
            getAllTags: function(){
              return tags;
            },
            loadAllTags: function(){
            },
            getTagIndex: function(){
              return {
                "1234": {
                  id: "1234",
                  name: "lol"
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
    $rootScope = $injector.get( '$rootScope' );
    $filter = $injector.get( '$filter' );
    $scope = $rootScope.$new();
    var $controller = $injector.get( '$controller' );

    createController = function(){
      return $controller( 'TagsAdminCtrl', {
        '$scope': $scope
      });
    };
  }));

  it( 'should have a nav field set to tag', inject( function(){
    var controller = createController();
    expect( $scope.nav ).toEqual( "tagItems" );
  }));

  it( 'should have a selectedItems field set to []', inject( function(){
    var controller = createController();
    expect( $scope.selectedItems ).toEqual( [] );
  }));

  it( 'should have an activeTag field set to []', inject( function(){
    var controller = createController();
    expect( $scope.activeTags ).toEqual( [] );
  }));

  it( 'should have an intersectFilter intersecting an array of arrays', inject( function( $filter ){
    var controller = createController();
    var a = {
      name: 'a',
      id: '1'
    }, b = {
      name: 'b',
      id: '2'
    }, c = {
      name: 'c',
      id: '3'

    };

    var t1 = [ a, b, c ];
    var t2 = [ a, c ];
    var t3 = [ b ];
    var t4 = [ a ];


    expect( $filter('intersectFilter')( [ t1, t2 ] )).toEqual( [ a, c ]);
    expect( $filter('intersectFilter')( [ t3, t2 ] )).toEqual( []);
    expect( $filter('intersectFilter')( [ t1, t2, t4 ] )).toEqual( [ a ]);
    expect( $filter('intersectFilter')( [ t4 ] )).toEqual( [ a ]);

  }));

  it( 'should ', inject( function(){
    var controller = createController();
  }));
});

