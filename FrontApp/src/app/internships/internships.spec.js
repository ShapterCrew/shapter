describe('AddInternshipModalCtrl Test', function() {
  beforeEach(module('directives.addInternshipModal'));
  beforeEach(module('resources.internship'));

  it('should have an user and an addInternship function in the scope', inject(function($rootScope, $controller) {
    var scope = $rootScope.$new();
    var ctrl = $controller('AddInternshipModalCtrl', {$scope: scope});

    expect(angular.isFunction(scope.addInternship)).toBe(true);
  }));
});
