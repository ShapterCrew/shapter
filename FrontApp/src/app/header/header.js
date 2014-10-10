angular.module('shapter.header', ['directives.confirmAlert', 'directives.behaveAlert'])
.directive( 'shHeader', ['$location', 'security', '$state', 'Analytics', 'BehaveAlertFactory', '$stateParams', 'AppText', '$rootScope', function( $location, security, $state, Analytics, BehaveAlertFactory, $stateParams, AppText, $rootScope){

  return {
    restrict: 'E',
    templateUrl: 'header/header.tpl.html',
    link: function(scope, element, attr){

      var nav = function( path ){
        $location.path( path ).search( 'filter', null ).search( 'categories', null);
      };

      scope.$stateParams = $stateParams;
      scope.$state = $state;
      scope.$rootScope = $rootScope;
      scope.isCollapsed = true;
      scope.AppText = AppText;

      scope.route = $state.current.data.pageTitle;
      scope.security = security;
      scope.logout = security.logout;

      scope.schoolIsActive = function( id ){
        return $stateParams.schoolId == id;
      };

      scope.noSchoolActive = function(){
        return !$stateParams.schoolId;
      };

      scope.ownProfile = function(){
        return security.currentUser.id == $stateParams.studentId;
      };

      scope.isOneOfMySchools = function( schoolId ){
        var out = false;
        if( security.isConfirmedStudent() ){
          angular.forEach( security.currentUser.schools, function( school ){
            if( school.id == schoolId ){
              out = true;
            }
          });
        }
        return out;
      };

      scope.campusAuthorizationNav = function(){
        console.log( 'lol' );
        $location.path("/campusAuthentication");
      };

      scope.browseNav = function(){
        var schoolId = $stateParams.schoolId ? $stateParams.schoolId : security.currentUser.schools[0].id;
        nav("/schools/" + schoolId + "/browse");
      };

      scope.peopleNav = function(){
        nav("/people");
      };

      scope.profileNav = function(){
        nav("/student/" + scope.security.currentUser.id);
      };

      scope.campusAuthenticationNav = function(){
        var schoolId;
        if( $stateParams.schoolId ){
          nav("/schools/" + $stateParams.schoolId + "/campusAuthentication");
        }
        else if ( security.isConfirmedStudent() ){
          schoolId = security.currentUser.schools[0].id;
          nav("/schools/" + schoolId + "/campusAuthentication");
        }
        else {
          nav("/campusAuthentication");
        }
      };

      scope.home = function(){
        var id = $stateParams.schoolId;
        if( id ){
          nav("/schools/" + id );
        }
      };


      scope.schoolNav = function( id ){
        if( id ){
          nav("/schools/" + id );
        }
        else if( $stateParams.schoolId ){
          nav("/schools/" + $stateParams.schoolId );
        }
        else if( security.currentUser.schools.length ){
          nav("/schools/" + security.currentUser.schools[0].id );
        }
      };

      scope.contributeNav = function(){
        var id = $stateParams.schoolId ? $stateParams.schoolId : ( security.currentUser.schools.length ? security.currentUser.schools[0].id : null );
        if ( id ){
          nav("/schools/" + id + "/contribute");
        }
      };

      scope.schoolsNav = function(){
        nav("/schools");
      };

      scope.sfNav = function(){
        var schoolId = $stateParams.schoolId ? $stateParams.schoolId : ( security.isConfirmedStudent() ? security.currentUser.schools[ 0 ].id : null );
        if( schoolId ){
          nav("/schools/" + schoolId + "/signupFunnel");
        }
      };

      scope.adminNav = function(){
        nav("/admin");
      };
    }
  };
}])

.filter('notCurrentSchool', [function(){
  return function( schools, schoolId ){
    return schools.length ? schools.map( function( school ){
      return school.id == schoolId ? null : school;
    }).reduce( function( previous, current ){
      if( current !== null ){
        previous.push( current );
      }
      return previous;
    }, []) : [];
  };
}]);
