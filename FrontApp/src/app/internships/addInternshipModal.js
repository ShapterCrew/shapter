angular.module( 'directives.addInternshipModal', [])
.factory( 'shAddInternshipModalFactory', function($modal) {
  return {
    open: function() {
      return $modal.open({
        templateUrl: 'internships/addInternshipModal.tpl.html',
        controller: 'AddInternshipModalCtrl',
        windowClass: 'show',
        resolve: {
        }
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
      element.bind('click', function (event) {
        shAddInternshipModalFactory.open();
      });
    }
  };
}])

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', function($scope, Internship ){
  $scope.internship = {};

  $scope.addInternship = function() {
    Internship.create($scope.internship).then(function(response) {
      $scope.internship = {};
    });
  };
}]);
