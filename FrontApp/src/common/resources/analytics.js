angular.module('resources.analytics', [])

.factory('Analytics', [function(){

  user = {}, 

  Analytics = {

    identify: function( user ){

      var school = null;
      // dirty
      try {
        if( user.schools !== undefined ){
          if( user.schools[0].name ){
            school = user.schools[0].name;
          }
        }
      }
      catch (err){
        console.log( 'cant set school' );
        console.log( user );
      }

      mixpanel.identify( user.id );
      try {
        if( user.email ){
          mixpanel.people.set_once({
            "$email": user.email
          });
        }
      }
      catch (err) {
        console.log( "no user email" );
      }
      mixpanel.people.set({
        "id": user.id,
        "admin": user.admin || null, 

        "$first_name": user.firstname || null,
        "$last_name": user.lastname || null,

        "comments_count": user.comments_count || 0,
        "diagrams_count": user.diagrams_count || 0,
        "items_count": user.items_count || 0,

        'provider': user.provider || null,
        'school': school || null,
        'comments_likes_count': user.comments_likes_count || 0,
        'comments_dislikes_count': user.comments_dislikes_count || 0,
        'confirmed': user.confirmed || null,
        'confirmed_student': user.confirmed_student || null,
        'sign_in_count': user.sign_in_count || 0,

        'nb_schools': user.schools.length || null
      });

      mixpanel.register({
        'provider': user.provider || 'email',
        'sign_in_count': user.sign_in_count || 0,
        "$email": user.email || null,
        'school': school || null,
        'confirmed': user.confirmed || null,
        'confirmed_student': user.confirmed_student || null,

        "comments_count": user.comments_count || 0,
        "diagrams_count": user.diagrams_count || 0,
        "items_count": user.items_count || 0
      });

    },

    loginSuccess: function( loginUser ){
      mixpanel.track("Login Success");
      Analytics.identify( loginUser );
    },


    editDiagram: function( item, newDiagram ){
      mixpanel.track("Edit Diagram", {
        "item": item.id,
        "item name": item.name
      });
      if( newDiagram === true ){
        mixpanel.people.increment("diagrams_count");
      }
    },

    requestComments: function(item){
      mixpanel.track("Request Comments", {
        "item": item.id
      });
    },

    unRequestComments: function(item){
      mixpanel.track("Un-request Comments", {
        "item": item.id
      });
    },

    addToCart: function( item ){
      mixpanel.track("Add Item To Cart", {
        "item": item.id,
        "item_name": item.name
      });
    },

    removeFromCart: function( item ){
      mixpanel.track("Remove Item From Cart", {
        "item": item.id,
        "item_name": item.name
      });
    },

    addToConstructor: function( item ){
      mixpanel.track("Add To Constructor", {
        "item": item.id,
        "item_name": item.name
      });
    },

    removeFromConstructor: function( item ){
      mixpanel.track("Remove From Constructor", {
        "item": item.id,
        "item_name": item.name
      });
    },

    stalkProfile: function( user ){
      mixpanel.track("Stalk Profile", {
        "stakled": user.email
      });
    },

    ownProfile: function(){
      mixpanel.track('Own Profile');
    },

    facebookLogin: function(){
      mixpanel.track('Facebook Login');
    },

    facebookAssociate: function(){
      mixpanel.track('Facebook Associate');
    },

    facebookAuthModule: function(){
      mixpanel.track('Facebook Authorization Module');
    },

    facebookAddAuth: function(){
      mixpanel.track('Facebook Add Authorization Button');
    },

    facebookChanged: function(){
      mixpanel.track('Facebook Changed');
    },

    facebookAuthConfirmSent: function(){
      mixpanel.track('Facebook Auth Confirm Sent');
    },

    facebookAuthUnrecognized: function(){
      mixpanel.track('Facebook Auth Unrecognized Format');
    },

    facebookAuthPasswordPlease: function(){
      mixpanel.track('Facebook Auth Password Please');
    },

    facebookAuthAccountExisting: function(){
      mixpanel.track('Facebook Auth Account Existing');
    },

    facebookAuthWrongCombinaison: function(){
      mixpanel.track('Facebook Auth Wrong Combinaison');
    },

    browse: function(){
      mixpanel.track('Browse');
    },

    signupFunnel: function(){
      mixpanel.track('Signup Funnel');
    },

    contribute: function(){
      mixpanel.track('Contribute');
    },

    unsubscribeFromItem: function(item){
      mixpanel.track("Unsuscribe From Item", {
        "item": item.id,
        "item_name": item.name
      });
    },

    subscribeToItem: function(item){
      mixpanel.track("Subscribe To Item", {
        "item": item.id,
        "item_name": item.name
      });
    },

    addComment: function(comment, origin){
      mixpanel.track("Commentaire Ajouté", {
        "origin": origin,
        "item": comment.item_id
      });
      mixpanel.people.increment("comments_count");
    },

    removeComment: function(){
      mixpanel.track("Remove Comment");
      mixpanel.people.increment( "comments_count", -1 );
    },

    nextItem: function(){
      mixpanel.track("Next Item");
    },

    previousItem: function(){
      mixpanel.track("Previous Item");
    },

    closeItem: function(item){
      mixpanel.track("Close Item", {
        "item": item.id,
        "item_name": item.name
      });
    },

    addTag: function( tag, from ){
      mixpanel.track( "Add Tag", {
        "tag": tag.name,
        "from": from
      });
    },

    removeTag: function( tag, from ){
      mixpanel.track( "Remove Tag", {
        "tag": tag.name,
        "from": from
      });
    },

    selectItem: function( item ){
      mixpanel.track("Select Item", {
        "item": item.id,
        "item_name": item.name
      });
    },

    forgotPassword: function(){
      mixpanel.track("Forgot Password");
    },

    cancelForgotPassword: function(){
      mixpanel.track("Cancel Forgot Password");
    },

    successChangePassword: function(){
      mixpanel.track("Success Change Password");
    },

    showLogin: function(){
      mixpanel.track("Login Modal");
    },

    showSignup: function(){
      mixpanel.track("Signup Modal");
    },

    cancelLogin: function(){
      mixpanel.track("Cancel Login");
    },

    cancelSignup: function(){
      mixpanel.track("Cancel Signup");
    },

    logout: function(){
      mixpanel.track("Logout");
    },

    signupSuccess: function(){
      mixpanel.track("Signup Success");
    },

    like: function( comment ){
      mixpanel.track("Like Comment");
    },

    dislike: function( comment ){
      mixpanel.track("Dislike Comment");
    },

    unLike: function( comment ){
      mixpanel.track("Unlike Comment");
    },

    uploadFile: function( item ){
      mixpanel.track("Upload Document", {
        "item": item.id,
        "item_name": item.name
      });
    },

    downloadFile: function( item, doc ){
      mixpanel.track("Download Document", {
        "item": item.id,
        "item_name": item.name,
        "document": doc.id,
        "document_name": doc.name
      });
    },

    manageCourseBuilder: function(){
      mixpanel.track("Manage Course Builder");
    },

    people: function(){
      mixpanel.track("People");
    },

    loadMoreOnContribute: function(){
      mixpanel.track("Load More Contribute");
    },

    whoLikesThat: function(){
      mixpanel.track("Who Likes That ?");
    },

    whoDislikesThat: function(){
      mixpanel.track("Who Dislikes That ?");
    },

    confirmationMailSent: function( provider ){
      mixpanel.track("Confirmation Mail Sent", {
        "provider": provider
      });
    },

    smallScreenToggleTagDisplay: function(){
      mixpanel.track("Small Screen Toggle Tag Display");
    },

    arrayDisplayOnBrowse: function(){
      mixpanel.track("Array Display", {
        from: "browse"
      });
    },

    cardsDisplayOnBrowse: function(){
      mixpanel.track("Cards Display", {
        from: "browse"
      });
    },

    addFrequentSearch: function(){
      mixpanel.track("Add Frequent Search");
    },

    schoolsIndex: function(){
      mixpanel.track("Schools Index");
    },

    formationPage: function( name ){
      mixpanel.track("Formation Page", {
        formation: name
      });
    },

    formationNav: function( id ){
      mixpanel.track("Formation Nav", {
        id: id
      });
    },

    campusAuthorizationModule: function(){
      mixpanel.track("Campus Authorizations Module");
    },

    addCampusPage: function(){
      mixpanel.track("Add Campus Page");
    },

    internships: function(){
      mixpanel.track("Internships");
    },

    addInternshipModule: function(){
      mixpanel.track("Add Internship Module");
    },

    internshipCreated: function(){
      mixpanel.track('Internship Created');
    },

    changeNav: function( state ){
      mixpanel.track('ChangeNav', {
        state: state
      });
    },

    openMapMarker: function(){
      mixpanel.track('Open Map Marker');
    },

    editSyllabus: function( item ){
      mixpanel.track('Edit Syllabus', {
        item: item.id,
        item_name: item.name
      });
    }

  };

  return Analytics;
}]);

