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

.controller( 'AddInternshipModalCtrl', ['$scope', 'Internship', function($scope, Internship){
  $scope.internship = {};
  $scope.addInternship = function() {
    var tags = [];
    angular.forEach($scope.internship.tags, function(tag, cat) {
      tags.push({tag_name: tag, tag_category: cat});
    });
    $scope.internship.tags_by_name_cat = tags;
    delete $scope.internship.tags;
    Internship.create($scope.internship).then(function(response) {
      $scope.internship = {};
    });
  };
}]);
