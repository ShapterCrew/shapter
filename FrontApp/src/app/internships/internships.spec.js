describe('AddInternshipModalCtrl Test', function() {

  var $stateParams;

  beforeEach(function(){
    module('directives.addInternshipModal');
    module(function( $provide ){
      $provide.provider('Map', function () { 
        this.$get = function () {
          return {
            getAddresses: function(){
              return {};
            }
          };
        };
      });
    });
  });
  beforeEach(module('resources.internship'));

  beforeEach( inject (function( $injector ){
    $stateParams = $injector.get( '$stateParams' );
  }));


  it('should have an user and an addInternship function in the scope', inject(function($rootScope, $controller) {
    var scope = $rootScope.$new();
    var ctrl = $controller('AddInternshipModalCtrl', {$scope: scope});

    expect(angular.isFunction(scope.addInternship)).toBe(true);
  }));
});
