angular.module('shapter.startpage', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'start', {
    url: '/start',
    views: {
      "main": {
        controller: 'StartPageCtrl',
        templateUrl: 'startpage/startpage.tpl.html',
        title: 'Choisis les cours qui te correspondent'
      }
    },
    data:{ pageTitle: 'Accueil' }
  });
})

.controller('StartPageCtrl', ['Analytics', '$scope', '$location', '$anchorScroll', '$http', 'security', '$window', 'AppText', function(Analytics, $scope, $location, $anchorScroll, $http, security, $window, AppText ){

  console.log('startpage');
  $scope.AppText = AppText;
  $scope.security = security;
  security.requestCurrentUser().then( function(){
    security.redirect();
  }, function(x){
    console.log( x );
  });

  $scope.showAbout = false;
  $scope.showTeam = false;
  $scope.showContact = false;

  $scope.facebookConnect = function(){
    $window.location.href = "/api/v1/users/auth/facebook";
  };

  $scope.navToCgu = function(){
    $location.path('cgu');
  };

  $scope.$on('login success', function(){
    security.redirect();
  });

  $scope.emailLogin = function(){
    security.showLogin( null );
  };

  $scope.scroll = function(){
    $location.hash('infos');
    $anchorScroll();
  };

  $scope.feedback = [
    {
    text: "Je me tue à obtenir des infos en demandant à droite à gauche pour les stages, les options, et c\'est un boulot qui prend un temps de folie. Rien de mieux qu\'un site pour synthétiser tout ça !"
  },
  {
    text: "MERCI ! C’est de la balle Shapter !! Ça m’a bien servi pour le S8, et autour de moi les gens m’ont dit « je ne me suis pas fié aux descriptifs des cours mais à Shapter »."
  },
  {
    text: 
      "Merci à vous pour ce projet, apparemment on est nombreux à en avoir profité ce weekend dans l’urgence du classement des électifs."
  },
  {
    text: 
      "Un énorme merci pour ce site vous êtes des héros !"
  }
  ];

}]);

