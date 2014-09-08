describe( 'StudentCtrl', function() {

  beforeEach(function(){

    module('shapter.student');

    module( function( $provide ){

      $provide.provider('Analytics', function () { 
        this.$get = function () {
          return {
            ownProfile: function(){
            },
            stalkProfile: function(){
            }
          };
        };
      });
      $provide.provider('User', function () { 
        this.$get = function ( $q ) {
          return {
            coursesBuilder: function(){
              return $q.when();
            },
            signupFunnel: function(){
              return $q.when();
            },
            get: function(){
              return $q.when();
            }
          };
        };
      });
      $provide.provider('security', function () { 
        this.$get = function () {
          return {
            currentUser: {
              name: "Gérard",
              schools: [
                {
                name: "Centrale Lyon"
              }
              ]
            }
          };
        };
      });
    });
  });

  beforeEach( inject( function( $injector ){

    var user = {};
    $location = $injector.get( '$location' );
    $location.stateParams = {
      studentId: 1
    };
    $rootScope = $injector.get( '$rootScope' );
    $scope = $rootScope.$new();

    var $controller = $injector.get( '$controller' );

    createController = function(){
      return $controller( 'StudentCtrl', {
        '$scope': $scope,
        'user': {}
      });
    };
  }));
  
  it( 'should have a studentId field', inject( function(){
    var controller = createController();
    expect( $location.stateParams.studentId ).toEqual( 1 );
  }));

  it( 'should have a user defined', inject( function(){
    var controller = createController();
    expect( $scope.security.currentUser ).toBeDefined();
  }));

});

