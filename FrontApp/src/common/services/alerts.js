angular.module('services.alerts', [])

.factory('alerts', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    var alerts = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alerts.add = function(type, msg) {
      alertMsg = {
        'type': type,
        'msg': msg,
        close: function() {
          alerts.closeAlert(this);
        }
      };  
      $rootScope.alerts.push(alertMsg);
    };

    alerts.closeAlert = function(alertMsg) {
      alerts.closeAlertIdx($rootScope.alerts.indexOf(alertMsg));
    };

    alerts.closeAlertIdx = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    alerts.clear = function() {
      $rootScope.alerts = [];
    };

    return alerts;
}])

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
    fr: "Mauvaise combinaison login/mot de passe.",
    en: "Wrong password / login combination"
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
