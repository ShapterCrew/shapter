angular.module( 'directives.addInternshipModal', [])
.factory( 'shAddInternshipModalFactory', function($modal) {
  return {
    open: function(currentUser) {
      return $modal.open({
        templateUrl: 'internships/addInternshipModal.tpl.html',
        controller: 'AddInternshipModalCtrl',
        windowClass: 'show',
        resolve: {
          currentUser: function() {
            return currentUser;
          }
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
      var currentUser = scope.currentUser;
      element.bind('click', function (event) {
        shAddInternshipModalFactory.open(currentUser);
      });
    }
  };
}])

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', 'currentUser', function($scope, Internship, currentUser ){

  $scope.internship = {
    user: currentUser
  };

  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.addInternship = function() {
    Internship.create($scope.internship).then(function(response) {
      $scope.internship = {};
    });
  };
}]);
