angular.module( 'shapter.schools', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'schools', {
    url: '/schools',
    views: {
      "main": {
        controller: 'SchoolsCtrl',
        templateUrl: 'schools/schools.tpl.html'
      }
    },
    data:{ pageTitle: 'Schools' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser
    }
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
      authenticatedUser: securityAuthorizationProvider.requireAdminUser,
      formation: ['Formation', '$stateParams', function( Formation, $stateParams ){
        var tag_ids = [
          $stateParams.schoolId
        ];
        return  Formation.formations( tag_ids );
      }],
      school: ['Tag', '$stateParams', function( Tag, $stateParams ){
        return Tag.get( $stateParams.schoolId );
      }],
      schools: ['Tag', function( Tag ){
        return Tag.getSchools();
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
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser,
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
      authenticatedUser: securityAuthorizationProvider.requireConfirmedUser,
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

.run(['$rootScope', '$stateParams', 'Tag', function( $rootScope, $stateParams, Tag ){
  $rootScope.$watch( function(){
    return $stateParams.schoolId;
  }, function( newValue ){
    if( newValue ){
    Tag.get( $stateParams.schoolId ).then( function( school ){
      $rootScope.school = school;
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


.controller('FormationCtrl', [ '$scope', 'Tag', 'security', '$location', 'formation', '$stateParams', 'school', 'Formation', 'AppText', 'Analytics', function( $scope, Tag, security, $location, formation, $stateParams, school, Formation, AppText, Analytics){

  $scope.internshipsList = [{
    student: {
      id: '53fc8eaf4d61632d1a111400',
      image: 'http://graph.facebook.com/746309634/picture',
      firstname: 'Alex',
      lastname: 'lolalilaloule'
    },
    company: {
      name: 'Bougyues'
    },
    start_time: '2014-07-31',
    end_time: '2014-09-04',
    duration: '6',
    year: '2014',
    lat: 39.91,
    lng: 15.75,
    message: '',
    focus: false,
    draggable: false
  },
  {
    student: {
      id: '53fc8eaf4d61632d1a111400',
      firstname: 'Bob',
      lastname: 'Haha'
    },
    company: {
      name: 'Ornage'
    },
    lat: 59.81,
    lng: 11.75,
    message: '',
    focus: false,
    draggable: false
  },
  {
    student: {
      id: '53fc8eaf4d61632d1a111400',
      firstname: 'Bob',
      lastname: 'Haha'
    },
    company: {
      name: 'Ornage'
    },
    lat: 59.91,
    lng: 10.75,
    message: '',
    focus: false,
    draggable: false
  }];
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
    $location.path( "/schools/" + $scope.school.id + "/formations/" + id );
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

.controller('SchoolPageAdminCtrl', ['$scope', 'formation', 'school', 'schools', 'Formation', 'Tag', function( $scope, formation, school, schools, Formation, Tag ){
  $scope.schools = schools;
  $scope.school = school;
  $scope.activeTags = [school];

  var selectTagsSchools = function() {
    Tag.getSchoolTags( $scope.school.id ).then(function(response){
      $scope.schoolTags = response.tags;
    });
  };

  $scope.changeSchool = function() {
    if (angular.isDefined($scope.school.id)) {
      $scope.wrongSchoolName = false;
      Formation.formations( [$scope.school.id] ).then(function(response) {
        formation = response;
        $scope.activeTags = [$scope.school];
        $scope.form = {
          name: $scope.school.name,
          description: formation.description,
          website_url: formation.website_url,
          image_credits: formation.image_credits
        };
      });
      selectTagsSchools();
    }
    else {
      $scope.wrongSchoolName = true;
      $scope.form = {
      };
    }
  };

  $scope.changeSchool();
  selectTagsSchools();

  $scope.checkUrl = function() {
    $scope.wrongUrl = $scope.form.website_url && $scope.form.website_url.substring(0, 3) != "htt";
  };

  $scope.addFormationTags = function() {
    $scope.activeTags.push( $scope.formationTag );
    $scope.formationTag = null;
  };

  $scope.removeTag = function( index ){
    $scope.activeTags.splice( index, 1 );
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
}])

.filter('schoolNotThere', [function(){
  return function( schools, alreadyThere){
    var out = [];
    angular.forEach( schools, function( school ){
      here = false;
      angular.forEach( alreadyThere, function( thereSchools ){
        if( school.id == thereSchools.id ){
          here = true;
        }
      });
      if( here === false ){
        out.push( school );
      }
    });
    return out;
  };
}]);

