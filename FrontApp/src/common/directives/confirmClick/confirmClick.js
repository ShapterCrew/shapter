angular.module('directives.confirmClick', [])
.directive('ngConfirmClick', ['$modal', function($modal){
  return {
    link: function (scope, element, attr) {
      var question = attr.ngConfirmClick || "Es-tu sûr ?";
      var clickAction = attr.confirmedClick;

      element.bind('click', function (event) {

        var confirmClickCtrl = ['$scope', 'question', '$modalInstance', function($scope, question, $modalInstance){
          $scope.question = question;
          $scope.cancel = function(){
            $modalInstance.dismiss();
          };
          $scope.validate = function(item){
            scope.$eval(clickAction);
            $modalInstance.close();
          };
        }];

        var modalInstance = $modal.open({
          templateUrl: 'directives/confirmClick/confirmClick.tpl.html',
          controller: confirmClickCtrl,
          windowClass: 'show',
          resolve: {
            question: function(){
              return question;
            }
          }
        });
      });
    }
  };
}]);
