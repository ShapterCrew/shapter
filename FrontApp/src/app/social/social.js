angular.module('shapter.social', [
  'services.appText'
])

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
