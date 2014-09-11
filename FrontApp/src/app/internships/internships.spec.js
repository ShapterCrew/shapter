describe('AddInternshipModalCtrl Test', function() {
  beforeEach(module('directives.addInternshipModal'));
  beforeEach(module('resources.internship'));
  beforeEach(
    module(function($provide) {
      $provide.provider('security', function() {
        this.$get = function() {
          return {
            currentUser: {
              firstname: "Adrien",
              lastname: "Tibere",
              schools: [{
                id: 1,
                name: "Telecom ParisTech"
              }]
            }
          };
        };
      });
  }));

  it('should have an user and an addInternship function in the scope', inject(function($rootScope, $controller) {
    var scope = $rootScope.$new();
    var ctrl = $controller('AddInternshipModalCtrl', {$scope: scope});

    expect(scope.internship.user).toBeDefined();
    expect(angular.isFunction(scope.addInternship)).toBe(true);
  }));
});
