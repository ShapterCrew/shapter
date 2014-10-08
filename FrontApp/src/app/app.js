angular.module( 'shapter', [
  'templates-app',
  'templates-common',
  'ngSocial',
  'ngAnimate',
  'LocalStorageModule',
  'ui.router',
  'ui-rangeSlider',
  'ui.keypress',
  'sh-infinite-scroll',
  'angularFileUpload',
  'ngTagsInput',
  'restangular',
  'shapter.confirmationSent',
  'shapter.about',
  'shapter.social',
  'shapter.addCampus',
  'shapter.schools',
  'shapter.cgu',
  'shapter.internships',
  'shapter.maps',
  'shapter.sideItem',
//  'shapter.people',
  'shapter.campusAuthentication', 
  /*'shapter.courseBuilder',*/
  'shapter.student',
  'shapter.contribute',
  'shapter.startpage',
  'shapter.signupFunnel', 
  'shapter.browse',
  'shapter.admin',
  'shapter.editDiagram',
  'shapter.header',
  'shapter.item',
  'shapter.usersConfirmation',
  'shapter.usersForgotPassword',
  'shapter.config',
  'directives.ngBindModel',
  'directives.comment',
  'directives.likersLoader',
  'directives.autoFocus',
  'directives.likeComment',
  'directives.addComment',
  'directives.confirmAlert',
  'directives.addInternshipModal',
  'resources.map',
  'resources.school',
  'resources.category',
  'resources.formation',
  'resources.item',
  'resources.type',
  'resources.tag',
  'resources.user',
  'resources.analytics',
  'resources.behave',
  'resources.comment',
  'resources.internship',
  'directives.shGauge',
  'directives.fileread',
  'directives.shDiagram',
  'directives.confirmClick',
  'directives.blurFocus',
  'security.service',
  'security.authorization',
  'services.colors', 
  'services.appText', 
  'filters.ignoreAccents',
  'filters.shareEncoding',
  'filters.cutString',
  'filters.shorterFirst',
  'filters.orderByAccent'
])

.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('shapter');
}])

.run(['localStorageService', '$window', function( localStorageService, $window ){
  console.log( 'local storage access' );
  if( localStorageService.get('back url')){
    var url = '#' + localStorageService.get('back url');
    localStorageService.remove('back url');
    $scope.$apply( function(){
      $window.location.href = url;
    });
  }
}])

.run(['ENV', function( ENV ){
  try {
    mixpanel.init( ENV.mixpanel_id );
  }
  catch( err ){
    console.log( err );
  }
  try {
    behave.init( ENV.behave_api_token );
  } 
  catch( err ){
    console.log( err );
  }
}])

.run(['security', function( security ){
  security.requestCurrentUser();
}])

.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}])


.run(['$window', function( window ){
  // Include the UserVoice JavaScript SDK (only needed once on a page)
  UserVoice=window.UserVoice||[];(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/27UyRlFYUv3yLX6SXKZouQ.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s);})();

  //
  // UserVoice Javascript SDK developer documentation:
  // https://www.uservoice.com/o/javascript-sdk
  //

  // Set colors
  UserVoice.push(['set', {
    accent_color: '#448dd6',
    trigger_color: 'white',
    trigger_background_color: 'rgba(46, 49, 51, 0.6)'
  }]);

  // Identify the user and pass traits
  // To enable, replace sample data with actual user traits and uncomment the line
  UserVoice.push(['identify', {
    //email:      'john.doe@example.com', // User’s email address
    //name:       'John Doe', // User’s real name
    //created_at: 1364406966, // Unix timestamp for the date the user signed up
    //id:         123, // Optional: Unique id of the user (if set, this should not change)
    //type:       'Owner', // Optional: segment your users by type
    //account: {
    //  id:           123, // Optional: associate multiple users with a single account
    //  name:         'Acme, Co.', // Account name
    //  created_at:   1364406966, // Unix timestamp for the date the account was created
    //  monthly_rate: 9.99, // Decimal; monthly rate of the account
    //  ltv:          1495.00, // Decimal; lifetime value of the account
    //  plan:         'Enhanced' // Plan name for the account
    //}
  }]);

  // Add default trigger to the bottom-right corner of the window:
  UserVoice.push(['addTrigger', { mode: 'contact', trigger_position: 'bottom-right' }]);

  // Or, use your own custom trigger:
  //UserVoice.push(['addTrigger', '#id', { mode: 'contact' }]);

  // Autoprompt for Satisfaction and SmartVote (only displayed under certain conditions)
  UserVoice.push(['autoprompt', {}]);

}])

.config(['RestangularProvider', function(RestangularProvider) {

  var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  RestangularProvider
  .setBaseUrl('/api/v1/')
  .setRequestSuffix('/?format=json')
  .setDefaultHttpFields({
    withCredentials: true,
    cache: false
  })
  .setDefaultHeaders({ "Content-Type": "application/json" })
  .setDefaultHeaders({'Accept-Version': "v7"})

  .setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {

    headers['content-type'] = "application/json";

    // find arrays in requests and transform 'key' into 'key[]' so that rails can understand that the reuquets contains an array 
    angular.forEach( params, function(param, key){
      if (toType(param) == 'array'){
        var newParam = [];
        angular.forEach( param, function(value, key){
          newParam[key] = value;
        });
        params[ key + '[]' ] = newParam;
        delete params[ key ];
        newParam = null;
      }
    });

    return {
      element: element,
      params: params,
      headers: headers,
      httpConfig: httpConfig
    };
  });

  /* remove the metadata from the response and results in a simple array 
     RestangularProvider.setResponseExtractor(function(response, operation, what, url) {

     if (operation === "getList") {
     var newResponse = response.objects;
     return newResponse;
     }

     return response.data;
     });
     */

}])

.config( ['$stateProvider', '$urlRouterProvider',  function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/start' );
}])

/*
   .config(["$httpProvider", function($httpProvider) {
   $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
   }])
   */

.constant('I18N.MESSAGES', {
  'errors.route.changeError': {
    en: 'Route change error',
    fr: 'Erreur lors du changement de route'
  },
  'crud.user.save.success': {
    en: "A user with id '{{id}}' was saved successfully.",
    fr: "L'utilisateur a été sauvé correctement"
  },
  'crud.user.remove.success': {
    en: "A user with id '{{id}}' was removed successfully."
  },
  'crud.user.remove.error': {
    en: "Something went wrong when removing user with id '{{id}}'."
  },
  'crud.user.save.error': {
    en: "Something went wrong when saving a user..."
  },
  'crud.project.save.success': {
    en: "A project with id '{{id}}' was saved successfully."
  },
  'crud.project.remove.success': {
    en: "A project with id '{{id}}' was removed successfully."
  },
  'crud.project.save.error': {
    en: "Something went wrong when saving a project..."
  },
  'login.reason.notAuthorized': {
    fr: "Tu n'as pas les autorisations nécessaires. Désire-tu te logger avec un autre compte ?",
    en: "Sorry, you don't have the access rights."
  },
  'login.reason.notAuthenticated': {
    fr: "Connecte toi pour accéder à l'application.",
    en: "Please login to access the application"
  },
  'login.error.invalidCredentials': {
    fr: "Mauvaise combinaison login/mot de passe. Pour créer un nouveau compte, clique sur \"créér un compte\" à côté du bouton !",
    en: "Wrong password / login combination. To create a new account, click on \"create account\" beside the button!"
  },
  'login.error.serverError': {
    en: "Il y a eu un problème d'authentification.", //Use {{exception}} for more details
    fr: "There was a porblem with authentication."
  },
  'forgotPassword.success': {
    fr: "Ton mot de passe a bien été changé !",
    en: "Your password have been successfully changed"
  },
  'forgotPassword.error': {
    fr: "Il y a eu un problème avec le changement de mot de passe :(. Tu peux nous contacter à teamshapter@gmail.com.",
    en: "There was a problem with the password change. Please contact us at teamshapter@shapter.com"
  },
  'forgotPassword.wrongToken': {
    fr: "Ton email de confirmation est trop vieux ! Demandes-en un autre (ou contacte-nous à teamshapter@gmail.com si tu viens de le faire).",
    en: "Your confirmation email is too old. Please ask for another one"
  },
  'forgotPassword.sent.success': {
    fr: "Un email t'a été envoyé pour changer ton mot de passe.",
    en: "You will receive an email to change your password"
  },
  'forgotPassword.sent.error': {
    fr: "Cet email n'existe pas !",
    en:  "This email doesn't exist !"
  },
  'forgotPassword.emailWaiting': {
    fr: "Email en cours d'envoi...",
    en: "Email being sent ..."
  },
  'signup.error.serverError': {
    fr: "Il y a eu un problème avec la création de ton compte.", //Use {{exception}} for more details
    en: "There was a problem with the creation of your account"
  },
  'signup.reason.duplicateEmail': {
    fr: "Cet email est déjà enregistré. Si c'est bien le tien et que tu n'es pas enregistré, tu devrais avoir reçu un email d'activation (check tes spams !).",
    en: "This email has already been registered. If it is yours and you are not registered, check your email for an activation link"
  },
  'signup.reason.notAllFields': {
    fr: "Tu dois remplir tous les champs.",
    en: "You must fill out every field"
  },
  'signup.reason.emailNotMatchingSchool': {
    fr: "Mauvaise adresse mail. Essaye peut-être avec un des mails suivants : {{closest_mails}} ?",
    en: "Wrong email"
  },
  'signup.reason.emailNotMatchingSchool2': {
    fr: "L'adresse mail utilisée n'est pas dans les adresses mails étudiantes possibles pour cette école.",
    en: "This email adress doesn't grant you access to Shapter"
  },
  'signup.sentEmail.success': {
    fr: "Un email t'a été envoyé avec le lien d'activation (si tu ne le reçois pas, check tes spams !).",
    en: "An activation email has benn sent to you. If you don't see it, please check your spams !"
  },
  'userActivated.success': {
    fr: "Ton compte a bien été activé !",
    en: "Your account has been successfully activated !"
  },
  'userActivated.error': {
    fr: "Il y a eu un problème avec l'activation de ton compte. Tu peux nous contacter à teamshapter@gmail.com.",
    en: "There was a problem with the activation of your account. Pleas contact us à teamshapter@shapter.com"
  },
  'contact.success': {
    fr: "Ton email a bien été enregistré. Nous vous tiendrons informé(e) de nos avancées !",
    en: "Your email has been successfully saved"
  },
  'contact.error': {
    fr: "Il y a eu un problème dans l'enregistrement de votre contact. Si le problème persiste, n'hésitez pas à nous contacter à teamshapter@gmail.com.",
    en: "There was a problem when saving your contact. Please contact us à teamshapter@shapter.com"
  }
});

