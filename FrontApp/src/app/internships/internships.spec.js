describe('AddInternshipModalCtrl Test', function() {

  var $stateParams;
  beforeEach(module('directives.addInternshipModal'));
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
