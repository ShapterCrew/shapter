angular.module( 'shapter', [
  'templates-app',
  'templates-common',
  'ngSocial',
  'ngAnimate',
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
  'services.appText', 
  'filters.ignoreAccents',
  'filters.shareEncoding',
  'filters.cutString',
  'filters.shorterFirst',
  'filters.orderByAccent'
])


.run(['ENV', function( ENV ){
  mixpanel.init( ENV.mixpanel_id );
  behave.init( ENV.behave_api_token );
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

.run(['security', function( security ){
  security.requestCurrentUser();
}]);
