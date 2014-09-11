angular.module( 'directives.addInternshipModal', [
  'security'
])
.factory( 'shAddInternshipModalFactory', function($modal) {
  return {
    open: function(currentUser) {
      return $modal.open({
        templateUrl: 'internships/addInternshipModal.tpl.html',
        controller: 'AddInternshipModalCtrl',
        windowClass: 'show'
      });
    }
  };
})

.directive( 'shAddInternshipModal', ['Internship', 'shAddInternshipModalFactory', function( Internship, shAddInternshipModalFactory){
  return {
    restrict: 'A',
    scope: {
      currentUser: '='
    },
    link: function( scope, element, attr ) {
      var currentUser = scope.currentUser;
      element.bind('click', function (event) {
        shAddInternshipModalFactory.open(currentUser);
      });
    }
  };
}])

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', 'security', function($scope, Internship, security ){
  $scope.internship = {
    user: security.currentUser
  };
  console.log($scope.internship);

  $scope.addInternship = function() {
    Internship.create($scope.internship).then(function(response) {
      $scope.internship = {};
    });
  };
}]);
