angular.module('shapter.header', ['directives.confirmAlert', 'directives.behaveAlert'])
.directive( 'shHeader', ['$location', 'security', '$state', 'Analytics', 'BehaveAlertFactory', '$stateParams', 'AppText', '$rootScope', function( $location, security, $state, Analytics, BehaveAlertFactory, $stateParams, AppText, $rootScope){

  return {
    restrict: 'E',
    templateUrl: 'header/header.tpl.html',
    link: function(scope, element, attr){


      scope.$stateParams = $stateParams;
      scope.$state = $state;
      scope.root = $rootScope;
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
        $location.path("/campusAuthentication");
      };

      scope.browseNav = function(){
        var schoolId = $stateParams.schoolId ? $stateParams.schoolId : security.currentUser.schools[0].id;
        $location.path("/schools/" + schoolId + "/browse").search( 'filter', null ).search( 'categories', null).search( 'nav', null );
      };

      scope.peopleNav = function(){
        $location.path("/people").search( 'filter', null ).search( 'categories', null);
      };

      scope.profileNav = function(){
        $location.path("/student/" + scope.security.currentUser.id).search( 'filter', null ).search( 'categories', null);
      };

      scope.courseBuilderNav = function(){
        $location.path("/courseBuilder");
      };

      scope.campusAuthenticationNav = function(){
        $location.path("/campusAuthentication").search('filter', null).search('categories', null);
      };

      scope.home = function(){
        var id = $stateParams.schoolId;
        if( id ){
          $location.path("/schools/" + id );
        }
      };


      scope.schoolNav = function( id ){
        if( id ){
          $location.path("/schools/" + id ).search( 'filter', null ).search( 'categories', null);
        }
        else if( $stateParams.schoolId ){
          $location.path("/schools/" + $stateParams.schoolId ).search( 'filter', null ).search( 'categories', null);
        }
        else if( security.currentUser.schools.length ){
          $location.path("/schools/" + security.currentUser.schools[0].id ).search( 'filter', null ).search( 'categories', null);
        }
      };

      scope.contributeNav = function(){
        var id = $stateParams.schoolId ? $stateParams.schoolId : ( security.currentUser.schools.length ? security.currentUser.schools[0].id : null );
        if ( id ){
          $location.path("/schools/" + id + "/contribute").search( 'filter', null ).search( 'categories', null);
        }
      };

      scope.schoolsNav = function(){
        $location.path("/schools").search( 'filter', null ).search( 'categories', null);
      };

      scope.sfNav = function(){
        var schoolId = $stateParams.schoolId ? $stateParams.schoolId : ( security.isConfirmedStudent() ? security.currentUser.schools[ 0 ].id : null );
        if( schoolId ){
          $location.path("/schools/" + schoolId + "/signupFunnel").search( 'filter', null ).search( 'categories', null);
        }
      };

      scope.adminNav = function(){
        $location.path("/admin");
      };
    }
  };
}]);
