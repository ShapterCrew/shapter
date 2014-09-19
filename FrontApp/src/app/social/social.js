angular.module('shapter.social', [
  'services.appText'
])

.factory('SocialMeta', ['$filter', 'AppText', '$parse', function( $filter, AppText, $parse ){

  var title, description;
  var SocialMeta = {

    getTitle: function(){
      return title;
    },

    changeTitle: function( token ){
      if( !!token ){
        title = $filter( 'language' )( $parse( token )( AppText.social ));
      }
      else {
        title = $filter( 'language' )( AppText.social.the_courses_youll_like );
      }
    },

    getDescription: function(){
      return description;
    },

    changeDescription: function( token ){
      if( !!token ){
        description = $filter( 'language' )( $parse( token )( AppText.social ));
      }
      else {
        description = $filter( 'language' )( AppText.social.defaultDescription );
      }
    }

  };

  return SocialMeta;
}])

.run(['SocialMeta', function( SocialMeta ){
  SocialMeta.changeTitle();
  SocialMeta.changeDescription();
}])

.run(['$window', 'ENV', function( window, ENV ){
  window.fbAsyncInit = function() {
    FB.init({
      appId               : ENV.facebook_app_id,
      ENVstatus           : true,
      ENVstatuscookie     : true,
      xfbml               : true,
      version             : 'v2.0'
    });
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}]);
