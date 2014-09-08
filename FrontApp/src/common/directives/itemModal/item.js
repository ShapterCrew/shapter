angular.module('directives.shItemModal', [])
.factory('shItemModalFactory', function($modal) {
  return {
    open: function(item) {
      return $modal.open({
        templateUrl: 'directives/itemModal/item.tpl.html',
        controller: 'shItemModalCtrl',
        windowClass: 'show',
        resolve: {
          item: function() {
            return item;
          }
        }
      });
    }
  };
})

.directive('shItemModal', function(shItemModalFactory) {
  return {
    scope : {
       item: '='
    },
    link: function (scope, element, attr) {
      var item = scope.item;
      element.bind('click', function (event) {
        item.loadFullItem().then( function(){
        });
        item.getComments().then(function(response){
          item.comments = response;
        });
        shItemModalFactory.open(item);
      });
    }
  };
})

.controller('shItemModalCtrl', function($scope, item, Colors) {

  $scope.values = {"Qualité": "10", "Documentation": 50, "Temps libre": 100, "Maths": 50, "Quick win": 50};

  $scope.ratingStates = [
    {stateOn: "icon-bar-1", stateOff: "icon-bar-1-empty" },
    {stateOn: "icon-bar-2" , stateOff: "icon-bar-2-empty"},
    {stateOn: "icon-bar-3" , stateOff: "icon-bar-3-empty"},
    {stateOn: "icon-bar-4" , stateOff: "icon-bar-4-empty"},
    {stateOn: "icon-bar-5" , stateOff: "icon-bar-5-empty"}
  ];

  $scope.levelColors = [ "#2ecc71", "#f1c40f", "#e74c3c" ];
  $scope.invLevelColors = [  "#e74c3c", "#f1c40f", "#2ecc71"];

  $scope.color = function( val ){
    return Colors.getColor( val, (val - 1) / 4, $scope.levelColors, false, [] );
  };

  $scope.invColor = function( val ){
    return Colors.getColor( val, (val - 1) / 4, $scope.invLevelColors, false, [] );
  };

  // ratings stuff
  $scope.normalizeValue = function( val ){
    return Math.floor( (val - 1) / 20 ) + 1;
  };

  $scope.item = item;
});
