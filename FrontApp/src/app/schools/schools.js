angular.module( 'shapter.schools', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'schools', {
    url: '/schools',
    views: {
      "main": {
        controller: 'SchoolsCtrl',
        templateUrl: 'schools/schools.tpl.html'
      }
    },
    data:{ pageTitle: 'Schools' }
  }).state( 'campusPageAdmin', {
    url: '/schools/:schoolId/admin',
    views: {
      "main": {
        controller: 'SchoolPageAdminCtrl',
        templateUrl: 'schools/schoolAdmin.tpl.html'
      }
    },
    data:{ pageTitle: 'School Admin' },
    resolve: {
      formation: ['Formation', '$stateParams', function( Formation, $stateParams ){
        var tag_ids = [
          $stateParams.schoolId
        ];
        return  Formation.formations( tag_ids );
      }],
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }]
    }
  }).state( 'formation', {
    url: '/schools/:schoolId/formations/:formationId',
    views: {
      "main": {
        controller: 'FormationCtrl',
        templateUrl: 'schools/school.tpl.html'
      }
    },
    data:{ pageTitle: 'School' },
    resolve: {
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }],
      formation: ['Formation', '$stateParams', function( Formation, $stateParams ){
        var tag_ids = [
          $stateParams.schoolId,
          $stateParams.formationId
        ];
        return Formation.formations( tag_ids );
      }]
    }
  }).state( 'school', {
    url: '/schools/:schoolId',
    views: {
      "main": {
        controller: 'FormationCtrl',
        templateUrl: 'schools/school.tpl.html'
      }
    },
    data:{ pageTitle: 'School' },
    resolve: {
      formation: ['Formation', '$stateParams', function( Formation, $stateParams ){
        var tag_ids = [
          $stateParams.schoolId
        ];
        return  Formation.formations( tag_ids );
      }],
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }]
    }
  });
}])

.run(['$rootScope', '$stateParams', 'Tag', 'security', function( $rootScope, $stateParams, Tag, security ){

  var isOneOfMySchools = function( schoolId ){
    return !security.isAuthenticated() ? false : security.currentUser.schools.map( function( school ){
      return school.id == schoolId;
    }).reduce( function( previous, current ){
      return previous || current;
    }, false);
  };

  var isInHistory = function( schoolId ){
    return $rootScope.schoolsHistory.map( function( school ){
      return school.id == schoolId;
    }).reduce( function( previous, current ){
      return previous || current;
    }, false);
  };

  var isPresent = function( schoolId ){
    return isOneOfMySchools( schoolId ) || isInHistory( schoolId );
  };


  $rootScope.$watch( function(){
    return $stateParams.schoolId;
  }, function( newValue ){
    if( newValue ){
      Tag.get( $stateParams.schoolId ).then( function( school ){
        $rootScope.school = school;
        $rootScope.schoolsHistory = $rootScope.schoolsHistory ? $rootScope.schoolsHistory : [];
        if( !isPresent( $stateParams.schoolId ) ){
          $rootScope.schoolsHistory.push( school );
        }
      });
    }
    else {
      $rootScope.school = null;
    }
  });
}])

.controller('SchoolsCtrl', ['$scope', 'security', '$location', 'School', 'Tag', 'Formation', 'AppText', 'Analytics', function( $scope, security, $location, School, Tag, Formation, AppText, Analytics ){


  Analytics.schoolsIndex();
  $scope.AppText = AppText;
  $scope.limit = 3;


  $scope.areComments = function( input ){
    return input.comments_count > 10 && input.students_count > 10;
  };

  $scope.loadingSchools = true;
  School.index().then( function( response ){
    $scope.loadingSchools = false;
    $scope.schools = response.schools;
  }, function(){
    $scope.loadingSchools = false;
  });
  $scope.campusNav = function( school ){
    $location.path("/schools/" + school.id );
  };
  Formation.formations().then( function( response ){
    $scope.comments = response.best_comments;
  });

}])


.controller('FormationCtrl', [ '$scope', 'Tag', 'security', '$location', 'formation', '$stateParams', 'school', 'Formation', 'AppText', 'Analytics', 'Internship', 'shAddInternshipModalFactory', '$filter', function( $scope, Tag, security, $location, formation, $stateParams, school, Formation, AppText, Analytics, Internship, shAddInternshipModalFactory, $filter){

  facebookData = {
    permalink: '#' + $location.url(),
    type: "best_comments",
    title: $filter( 'language' )( AppText.school.best_comments_share_title ) + ' ' + school.name + ' !',
    description: $filter( 'language' )( AppText.school.best_comments_share_description_1 ) + ' ' + school.name + ' ' + $filter( 'language' )( AppText.school.best_comments_share_description_2 )
  };

  // permalink type title description

  $scope.facebookData = btoa( JSON.stringify( facebookData ));

  $scope.shAddInternshipModalFactory = shAddInternshipModalFactory;
  $scope.n = 0;
  $scope.AppText = AppText;
  $scope.hideLikes = true;
  $scope.Tag = Tag;
  $scope.school = school;
  $scope.formation = formation;
  $scope.security = security;
  $scope.$stateParams = $stateParams;

  var fixPhotoUrl = function( photo_url ) {
    try {
      if (photo_url.substring(0,4) != "http") {
        return "/api/v1" + photo_url;
      }
      else {
        return photo_url;
      }
    }
    catch( err ){
      console.log( err );
    }
  };

  if (angular.isDefined($scope.formation.logo_url) && $scope.formation.logo_url != null && $scope.formation.logo_url.length > 3){
    $scope.formation.logo_url = fixPhotoUrl($scope.formation.logo_url);
  }
  if (angular.isDefined($scope.formation.image_url) && $scope.formation.image_url != null && $scope.formation.image_url.length > 3){
    $scope.formation.image_url = fixPhotoUrl($scope.formation.image_url);
  }

  var id = $stateParams.formationId ? $stateParams.formationId : $stateParams.schoolId;
  Tag.get( id ).then( function( response ){
    formation.name = response.name;
    Analytics.formationPage( response.name );
  }, function( e ){
  });

  $scope.choiceLimit = 8;
  $scope.departmentsLimit = 8;
  $scope.formationsLimit = 8;


  var tag_ids = $stateParams.formationId ? [ $stateParams.formationId ] : [];
  tag_ids.push( $stateParams.schoolId );

  Internship.getListFromTags( tag_ids, false).then(function(response){
    $scope.internshipsList = response.internships;
  });

  Formation.subFormations( tag_ids ).then( function( response ){
    $scope.formation.sub_choices = response.sub_choices;
    $scope.formation.sub_formations = response.sub_formations;
    $scope.formation.sub_departments = response.sub_departments;
  });

  Formation.typical_users( tag_ids ).then( function( response ){
    $scope.formation.typicalUsers = response.typical_users;
  });

  $scope.secondFormationId = function(){
    return !!$stateParams.formationId;
  };

  $scope.formationNav = function( id ){
    $location.path( "/schools/" + $scope.school.id + "/browse").search('filter', id ).search( 'nav', null );
    Analytics.formationNav( id );
    /*$location.path("/schools/" + school.id + "/formations/" + id );*/
  };

  $scope.studentHasSchool = function(){
    var out = false;
    angular.forEach( security.currentUser.schools, function( secSchool ){
      if( secSchool.id == school.id ){
        out = true;
      }
    });
    return out;
  };

  $scope.contributeNav = function(){
    $location.path("/contribute");
  };

  $scope.schoolAdminNav = function(){
    $location.path("/schools/" + $stateParams.schoolId + "/admin");
  };

  $scope.browseNavFromFormation = function(){
    $location.path("/schools/" + school.id + "/browse").search('filter', $stateParams.formationId ).search('nav', null);
  };

  $scope.signupFunnelNav = function( schoolId ){
    var search = {
      'fromApp': true
    };
    $location.path( '/schools/' + $stateParams.schoolId + '/signupFunnel').search( search );
  };

}])

.controller('SchoolPageAdminCtrl', ['$scope', 'formation', 'school', 'Formation', '$stateParams', function( $scope, formation, school, Formation, $stateParams ){
  $scope.school = school;
  $scope.activeTags = [school];

  $scope.checkUrl = function() {
    $scope.wrongUrl = $scope.form.website_url && $scope.form.website_url.substring(0, 3) != "htt";
  };

  $scope.createOrUpdate = function() {
    var tag_ids = [];
    angular.forEach($scope.activeTags, function(value) {
      tag_ids.push(value.id);
    });

    $scope.form.tag_ids = tag_ids;
    Formation.createOrUpdate($scope.form).then(function(response) {
      alert("La formation " + response.name + " a bien été enregistrée !");
    });
  };
}]);
