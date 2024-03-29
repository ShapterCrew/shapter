angular.module( 'services.appText', [])

.run( ['$rootScope', '$window', function($rootScope, $window){
  var language = $window.navigator.userLanguage || $window.navigator.language; 
  $rootScope.language = language;
}])

.filter( 'language', ['$rootScope', '$parse', function( $rootScope, $parse ){
  var language = $rootScope.language || 'en';
  var getLanguage = $parse( language );
  return function( input ){
    return getLanguage( input ) || $parse( 'en' )( input );
  };
}])

.factory( 'AppText', ['$parse', '$filter', function( $parse, $filter ){

  var AppText = {
    translateCode: function( code ){
      return $filter( 'language' )( $parse( code )( AppText.categories ));
    },
    internships: {
      type: {
        en: 'Internship type:',
        fr: 'Type de stage :'
      },
      internship_created: {
        en: 'Great, your internship has been created!',
        fr: 'Super, ton stage a bien été créé !'
      },
      share_your_internship: {
        en: 'Share your internship and tell your friends to add theirs!',
        fr: 'Partage ton stage et dis à tes amis d\'ajouter les leurs !'
      },
      new_internship: {
        en: 'Add another internship',
        fr: 'Ajouter un autre stage'
      },
      facebook_share_title: {
        en: 'Come add your internships on Shapter!',
        fr: 'Venez ajouter vos stages sur Shapter !'
      },
      facebook_share_description: {
        en: 'Shapter makes it easy to find the best internships for your profile. Share your internships and discover where your friends took theirs!',
        fr: 'Shapter rend la recherche de stages super facile : venez partagez vos stages et découvrir ceux qu\'ont faits les autres !'
      },
      me_too: {
        en: 'Add your internship!',
        fr: 'Ajoute ton stage !'
      },
      almost_there: {
        en: 'Almost there!',
        fr: 'C\'est presque fini !'
      },
      in_progress: {
        en: 'in progress!',
        fr: 'en cours !'
      },
      skills: {
        en: 'Describe the skills you developped with keywords: ',
        fr: 'Décris les compétences que tu as développées pendant ton stage avec des mots-clefs :'
      },
      add_keywords: {
        en: 'Add keywords',
        fr: 'Ajoute des compétences'
      },
      company_size: {
        en: 'Company size',
        fr: 'Taille de l\'entreprise'
      },
      position: {
        en: 'If you had to describe your job in one word?',
        fr: 'Si tu devais décrire ton poste en un mot ?'
      },
      position_examples: {
        en: 'ex: data analyst, research scientist, marketing, photocopies ...',
        fr: 'ex : data analyst, chercheur, marketing, stagiaire photocopies ...'
      },
      description: {
        en: 'Describe what you did: ',
        fr: 'Décris un peu ton stage :'
      },
      school_context: {
        en: 'I did the internship for: ',
        fr: 'J\'ai fait ce stage avec : '
      },
      from: {
        en: 'from',
        fr: 'du'
      },
      to: {
        en: 'to',
        fr: 'au'
      },
      country: {
        en: 'Country',
        fr: 'Pays'
      },
      add_yours: {
        en: 'Add your internship',
        fr: 'Ajoute ton stage'
      },
      internship_title: {
        en: 'Internship title',
        fr: 'Nom du stage'
      },
      address: {
        en: 'Address',
        fr: 'Adresse'
      },
      company: {
        en: 'Company',
        fr: 'Entreprise'
      },
      start_date: {
        en: 'Start date',
        fr: 'Date de début'
      },
      end_date: {
        en: 'End date',
        fr: 'Date de fin'
      },
      _in: {
        en: 'in',
        fr: 'à'
      },
      browse_internships_long: {
        en: 'Browse internships whit keywords: the name of the company, the localisation, its field ... Each additional keyword filters the results once more.',
        fr: 'Cherche parmi les stages effectués par les anciens en ajoutant des mot-clefs : le nom de l\'entreprise, le lieu, le domaine enseigné ... Chaque mot-clef supplémentaire filtre un peu plus la recherche.'
      },
      browse_internships: {
        en: 'Browse internships',
        fr: 'Cherche des stages'
      },
      internships: {
        en: 'internships',
        fr: 'stages'
      },
      map_view: {
        en: 'Map view',
        fr: 'Carte'
      },
      list_view: {
        en: 'List view',
        fr: 'Liste'
      },
      in_favourites: {
        en: 'current internships',
        fr: 'stages en cours'
      },
      current_internships: {
        en: 'Current internships',
        fr: 'Stages en cours'
      },
      all_internships: {
        en: 'All Internships',
        fr: 'Tous les stages'
      }
    },
    startpage: {
      connect: {
        en: 'Connect',
        fr: 'Connexion'
      },
      guest_connect: {
        en: 'Enter as a guest',
        fr: 'Entrer comme invité'
      },
      terms_of_use: {
        en: 'Terms of use',
        fr: 'Conditions générales d\'utilisation'
      },
      email_connect: {
        en: 'Email connect',
        fr: 'Connexion avec un compte email'
      },
      facebook_connect: {
        en: 'Facebook Connect',
        fr: 'Connexion avec Facebook'
      },
      choose_courses_that_correspond_to_your_profile: {
        en: 'The courses you\'ll like',
        fr: 'Choisis les cours que tu vas aimer'
      },
      benefit_from_feedback: {
        en: 'Choose wisely thanks to alumni feedback',
        fr: 'Profite de l\'expérience des anciens pour mieux choisir'
      },
      share_your_experience: {
        en: 'Share your own experience to help others',
        fr: 'Partage ta propre expérience pour aider les autres à choisir'
      }
    },
    security: {
      email_signup: {
        en: 'Signup with email',
        fr: 'Inscription par email'
      },
      auth_but_not_confirmed: {
        en: 'Your account has been created but not confirmed. Click on the confirmation email you recieved at ',
        fr: 'Tu dois confirmer ton email : clique sur l\'email de confirmation que tu as reçu à l\'adresse '
      },
      accept_cgu: {
        en: 'By clicking on \'signup\', I accept the general terms of use',
        fr: 'En cliquant sur \"Inscription\", j\'accèpte les conditions générales d\'utilisation'
      },
      prefer_school_email: {
        en: 'If possible, prefer your student email',
        fr: 'Si possible, préfère l\'email fourni par ton établissement'
      },
      login_needed_for_auth: {
        en: 'You need to be logged in to add campus authorizations to your profile.',
        fr: 'Tu dois être connecté pour ajotuer des autorisations à ton profil.'
      },
      login_needed_for_favourite: {
        en: 'You need to be logged to add a class to your favourites!',
        fr: 'Tu dois être connecté pour ajouter un cours à tes favoris !'
      },
      login_needed_for_follow: {
        en: 'You need to be identified as a student to add classes to your profile!',
        fr: 'Tu dois être identifié comme étudiant pour pouvoir ajouter des cours à ton profil !'
      },
      login_needed_to_see_comments: {
        en: 'You need to be identified as a student to see other students comments!',
        fr: 'Tu dois être identifié comme étudiant pour voir les commentaires des autres étudiants !'
      },
      login_needed_to_contribute: {
        en: 'You need to be identified as a student to contribute on Shapter!',
        fr: 'Tu dois être identifié comme étudiant pour pouvoir contribuer sur Shapter !'
      },
      back: {
        en: 'back to connect',
        fr: 'retour vers connexion'
      },
      create_account: {
        en: 'Create account',
        fr: 'Créer un compte'
      },
      connect: {
        en: 'Connect',
        fr: 'Connexion'
      },
      facebook_connect: {
        en: 'Facebook Connect',
        fr: 'Connexion avec Facebook'
      },
      facebook_signup: {
        en: 'Facebook Signup',
        fr: 'Inscription avec Facebook'
      },
      signup: {
        en: 'Signup',
        fr: 'Inscription'
      },
      signin: {
        en: 'Signin',
        fr: 'Connexion'
      },
      first_name: {
        en: 'First name',
        fr: 'Prénom'
      },
      last_name: {
        en: 'Last name',
        fr: 'Nom'
      },
      email: {
        en: 'Email',
        fr: 'Email'
      },
      invalid_email: {
        en: 'Invalid Email', 
        fr: 'Email invalide'
      },
      password: {
        en: 'Password',
        fr: 'Mot de passe'
      },
      forgot_password: {
        en: 'Forgot password',
        fr: 'Mot de passe oublié'
      }
    },
    comment: {
      give_report_reason: {
        en: 'briefly explain why this comment is inappropriate',
        fr: 'explique brièvement pourquoi ce commentaire est inapproprié'
      },
      your_report_has_been_sent: {
        en: 'Thanks, a report has been sent to the moderation.',
        fr: 'Merci, un message a été envoyé à la modération.'
      },
      report_comment: {
        en: 'report this comment',
        fr: 'dénoncer un contenu inapproprié'
      },
      problem: {
        en: 'There was a problem when adding your comment. Please report your problem to us: teamshapter@shapter.com',
        fr: 'Il y a eu un problème lors de l\'ajout de ton commentaire. Fais-nous en part à teamshapter@shapter.com'
      },
      context_required: {
        en: 'You are not registered as a student from this institution. Please leave a short context message : how did you follow that course ? To avoid this later, you can identify yourself as a student following the \" my authorizations \" link on the top right corner of the screen',
        fr: 'Tu n\'est pas identifié comme étudiant de cet établissement. Laisse un message détaillant dans quel contexte tu as suivi ce cours. Pour ne pas avoir le problème plus tard, identifie-toi comme étudiant de cet établissement grâce au lien \"mes autorisations" dans le menu déroulant en haut à droite de l\'écran.'
      },
      context: {
        en: 'Context: ',
        fr: 'Contexte : '
      },
      which_context: {
        en: 'In which context did you take that course ?',
        fr: 'Dans quel contexte est-ce que tu as suivi ce cours ?'
      },
      from: {
        en: 'from',
        fr: 'de'
      },
      hide: {
        en: "hide",
        fr: "masquer"
      },
      display_more: {
        en: "show more",
        fr: "lire la suite"
      },
      edit: {
        en: 'edit',
        fr: 'éditer'
      },
      remove: {
        en: 'delete',
        fr: 'supprimer'
      },
      sure_want_to_delete_it: {
        en: 'Do you really want to delete this comment ?',
        fr: 'Veux-tu vraiment supprimer ce commentaire ?'
      },
      cancel: {
        en: 'Cancel',
        fr: 'Annuler'
      }
    },
    addComment: {
      validate: {
        en: 'Validate your comment',
        fr: 'Valide ton commentaire'
      },
      your_comment_here: {
        en: 'What is this class ? Who should take it and why ?',
        fr: 'Qu\'est-ce que ce cours ? Qui devrait le prendre et pourquoi ?'
      }
    },
    diagram: {
    },
    editDiagram: {
      edit: {
        en: 'edit',
        fr: 'éditer'
      },
      cancel: {
        en: 'Cancel',
        fr: 'Annuler'
      },
      drag_the_silders: {
        en: 'Drag the sliders to draw your diagram',
        fr: 'Fais glisser les curseurs pour définir ton diagramme'
      }
    },
    browse: {
      cumulate_tip: {
        en: 'With this option, cumulate keywords to refine the search:',
        fr: 'Avec cette option, cumule les mots-clefs pour affiner la recherche :'
      },
      cumulate_next_keywords: {
        en: 'cumulate next keywords',
        fr: 'cumuler les prochains mots-clefs'
      },
      addition_filters: {
        en: 'Addition fiters',
        fr: 'Additionner les filtres'
      },
      classes: {
        en: 'Classes',
        fr: 'Cours'
      },
      about: {
        en: 'About',
        fr: 'À propos'
      },
      more: {
        en: 'more',
        fr: 'plus'
      },
      comment_evaluate: {
        en: 'Comment / evaluate',
        fr: 'Commenter / évaluer'
      },
      display_item: {
        en: 'Display class',
        fr: 'Afficher'
      },
      trending: {
        en: 'Trending',
        fr: 'Meilleurs cours'
      },
      documents_posted: {
        en: 'documents have been posted',
        fr: 'documents'
      },
      gave_feedback: {
        en: 'comments',
        fr: 'commentaires'
      },
      subscribed: {
        en: 'I took this class',
        fr: 'J\'ai suivi ce cours'
      },
      remove_tags: {
        en: 'End of filtering',
        fr: 'Plus de filtres disponibles.'
      },
      favourite_classes: {
        en: 'Favourite classes',
        fr: 'Mes favoris'
      },
      all_classes: {
        en: 'All classes',
        fr: 'Tous les cours'
      },
      browse_classes: {
        en: 'Browse classes',
        fr: 'Cherche des cours'
      },
      browse_classes_long: {
        en: 'Browse classes whit keywords: the name of the course, the category it belongs to, its field ... Each additional keyword filters the results once more.',
        fr: 'Cherche des cours en ajoutant des mot-clefs : le nom du cours, la catégorie à laquelle il appartient, le domaine enseigné ... Chaque mot-clef supplémentaire filtre un peu plus la recherche.'
      },
      posessing_keywords: {
        en: 'with all those keywords at once',
        fr: 'possédant tous ces mots-clefs à la fois'
      },
      and: {
        en: 'and',
        fr: 'et'
      },
      see: {
        en: 'See',
        fr: 'Voir'
      },
      schools: {
        en: "Institutions",
        fr: "Établissements"
      },
      items_missing: {
        en: 'You believe some classes are missing or some are not up to date ? Cast us an email at support@shapter.com or click on the bottom right question mark',
        fr: 'Il manque des cours ou les cours ne sont pas à jour ? Envoie-nous un message à support@shapter.com ou clique sur le point d\'interrogation en bas à droite de l\'écran'
      },
      remove_from_search: {
        en: 'Remove from search: ',
        fr: 'Retirer de la recherche :'
      },
      filter_with: {
        en: 'Filter with',
        fr: 'Filter avec'
      },
      display_infos_on_courses: {
        en: 'Display those information on classes:',
        fr: 'Afficher ces informations sur les cours :'
      },
      class_: {
        en: 'Class',
        fr: 'Cours'
      },
      comments: {
        en: 'Comments',
        fr: 'Commentaires'
      },
      documents: {
        en: 'Documents',
        fr: 'Documents'
      },
      diagrams: {
        en: 'Diagrams',
        fr: 'Diagrammes'
      },
      research_suggestions: {
        en: 'Suggestions of research: ',
        fr: 'Suggestions de recherches : '
      },
      _in: {
        en: 'in',
        fr: 'à'
      },
      number_of_diagrams: {
        en: 'Number of diagrams',
        fr: 'Nombre de diagrammes'
      },
      number_of_documents: {
        en: 'Number of documents',
        fr: 'Nombre de documents'
      },
      number_of_comments: {
        en: 'Number of comments',
        fr: 'Nombre de commentaires'
      },
      suggested: {
        en: 'Suggested: ',
        fr: 'Suggestions : '
      },
      display: {
        en: 'Display: ',
        fr: 'Affichage : '
      },
      list: {
        en: 'list',
        fr: 'liste'
      },
      cards: {
        en: 'cards',
        fr: 'cartes'
      },
      add_a_keyword: {
        en: 'Add a keyword to filter',
        fr: 'Ajoute un mot-clef pour filter'
      },
      keywords: {
        en: 'keywords',
        fr: 'Mots-clefs'
      },
      in_favourites: {
        en: 'in my favourite classes',
        fr: 'dans mes favoris'
      },
      result: {
        en: 'Classes',
        fr: 'Cours'
      },
      look_for_classes : {
        en: 'Classes',
        fr: 'Cours'
      },
      display_results: {
        en: 'Display Results',
        fr: 'Afficher les résultats'
      },
      display_keywords: {
        en: 'Display Keywords',
        fr: 'Afficher les mots-clefs'
      },
      add_key_word_or_click_suggestions: {
        en: 'Add a keyword or click on suggestions',
        fr: 'Ajoute un mot-clef ou clique sur les suggestions'
      },
      you_can_access_mutliple_institutions: {
        en: 'You can access several institutions',
        fr: 'Tu as accès à plusieurs établissements'
      }
    },

    people: {
      find_people: {
        en: 'Find People!',
        fr: 'Trouve des profils !'
      },
      looking_for_someone: {
        en: 'Looking for someone ?',
        fr: 'Tu cherches quelqu\'un ?'
      },
      best_contributors: {
        en: 'Best Contributors',
        fr: 'Meilleurs Contributeurs'
      },
      swag_points: {
        en: 'swag points',
        fr: 'points swag'
      },
      those_profiles_resemble_you: {
        en: 'Those profiles resemble you:',
        fr: 'Ces profils sont proches du tiens :'
      },
      throw_an_eye: {
        en: 'Throw an eye!',
        fr: 'Jettes-y un œil !'
      },
      associate_your_facebook_account: {
        en: 'Associate your facebook account to see your friends on Shapter!',
        fr: 'Associe ton compte à Facebook pour voir tes amis sur Shapter'
      },
      facebook_connect: {
        en: 'Facebook Connect',
        fr: 'Connexion avec Facebook'
      },
      your_facebook_friends_on_shapter: {
        en: 'Your Facebook friends on Shapter', 
        fr: 'Tes amis Facebook sur Shapter'
      }
    },

    contribute: {
      love: {
        en: 'favorite',
        fr: 'Coup de coeur'
      },
      manage_my_classes: {
        en: 'Go manage my classes',
        fr: 'Gérer mes cours'
      },
      you_did_id: {
        en: 'Yeah ! You advised every single class you took. Did you take new ones ?',
        fr: 'Bravo ! Tu as recommandé tous les cours que tu as suivis ! Est-ce que tu en as suivis des nouveaux ?'
      },
      take_classes: {
        en: 'Subscribe on Shapter to the classes you took as a student and come back here to give your feedback !',
        fr: 'Inscris-toi sur Shapter aux cours que tu as suivis et reviens ici pour les recommander !'
      },
      unadvised: {
        en: 'Unadvised',
        fr: 'Déconseillé'
      },
      it_depends: {
        en: 'Id depends', 
        fr: 'Ça dépend'
      },
      recommended: {
        en: 'Recommended',
        fr: 'Recommandé'
      },
      do_you_recommend: {
        en: 'Do you recommend this class?',
        fr: 'Recommandes-tu ce cours ?'
      },
      explain_unadvise: {
        en: 'Explain with tact why do you unadvise taking this class',
        fr: 'Explique avec tact pourquoi tu déconseilles ce cours'
      },
      explain_it_depends: {
        en: 'Explain why choose or not choose this class',
        fr: 'Explique pourquoi choisir ou ne pas choisir ce cours'
      },
      explain_reco: {
        en: 'Explain why do you recommend taking this class',
        fr: 'Explique pourquoi tu recommandes de prendre ce cours'
      },
      explain_love: {
        en: 'Explain why this class is awesome',
        fr: 'Explique pourquoi tu adores ce cours'
      },
      contribute_not_student: {
        en: 'You need to be identified as a student from one of our partner schools to contribute on Shapter!',
        fr: 'Tu dois être identifié comme étudiant de l\'un de nos établissements partenaires pour contribuer sur Shapter !'
      },
      go_identify: {
        en: 'I\'m a student',
        fr: 'Je suis étudiant'
      },
      contribute_infos: {
        en: 'There are not enough feedback on those classes to help next generation with their choices. Share your experience: there is always something to tell about a class!',
        fr: 'On manque de contenu sur ces cours pour aider les suivants à choisir correctement. Partage ton expérience, il y a toujours quelque chose à raconter sur un cours !'
      },
      new_classes: {
        en: 'I took new classes!',
        fr: 'J\'ai suivi de nouveaux cours !'
      },
      need_feedback: {
        en: 'Need feedback!',
        fr: 'On a besoin de ton avis !'
      },
      how_did_you_feel: {
        en: 'What\'s your feeling ? Share it to the community !',
        fr: 'Comment as-tu ressenti ce cours ? Parage ton point de vue !'
      },
      average_diagram: {
        en: 'Averaged diagram: ',
        fr: 'Diagramme moyen : '
      },
      rate_with_a_diagram: {
        en: 'Rate the class with a diagram',
        fr: 'Évalue le cours par un diagramme'
      },
      comments_on: {
        en: 'Comments on ',
        fr: 'Commentaires sur '
      },
      your_pov: {
        en: 'What do you think? Like / unlike other comments and add yours!',
        fr: 'Et toi, quel est ton avis ? Tu peux aussi liker / disliker les commentaires des autres !'
      },
      what_did_you_study: {
        en: 'To suggest you courses to comment, we need to know which ones you have followed !',
        fr: 'Pour te proposer des cours à commenter, nous devons savoir lesquels tu as suivis'
      },
      fill_in_your_cursus: {
        en: 'Fill in your courses',
        fr: 'Renseigne ton cursus'
      },
      give_a_hand: {
        en: 'Feel free to give a hand! :-)',
        fr: 'File un coup de main ! :-)'
      },
      not_enough_feedback_on: {
        en: 'There are not enough feedback on ',
        fr: 'Il n\'y a pas assez d\'avis sur'
      },
      edit_your_diagram: {
        en: 'Edit your diagram!', 
        fr: 'Édite ton diagramme !'
      },
      read_existing_comments: {
        en: 'Read existing comments',
        fr: 'Voir les commentaires existants'
      },
      load_more_suggestions: {
        en: 'Load more suggestions',
        fr: 'Charger plus de suggestions'
      }

    },

    profile: {
      level: {
        en: 'Level',
        fr: 'Niveau'
      },
      next_level: {
        en: 'Next level:',
        fr: 'Prochain niveau :'
      },
      average_diagram: {
        en: 'Average diagram:',
        fr: 'Diagramme Moyen :'
      },
      to_get_a_diagram: {
        en: 'To get a diagram, subscribe to courses and fill in the associated diagrams!',
        fr: 'Pour avoir un diagramme, inscris-toi à des cours et remplis ton diagramme associé !'
      },
      no_diagram_yet: {
        en: 'doesn\'t have a diagram yet',
        fr: 'n\' a pas encore de diagramme'
      },
      followed_courses: {
        en: 'Classes Taken',
        fr: 'Cours suivis'
      },
      comment: {
        en: 'Comment',
        fr: 'Commentaire'
      },
      comments: {
        en: 'Comments',
        fr: 'Commentaires'
      },
      diagram: {
        en: 'Diagram',
        fr: 'Diagramme'
      },
      recieved: {
        en: 'Recieved',
        fr: 'Reçu'
      },
      see_locked_badges: {
        en: 'See locked badges',
        fr: 'Voir les badges vérouillés'
      },
      hide: {
        en: 'Hide',
        fr: 'Masquer'
      },
      similar_profiles: {
        en: 'Similar profiles', 
        fr: 'Profils similaires'
      },
      manage_my_course: {
        en: 'Manage my courses at', 
        fr: 'Gérer mes cours à'
      },
      in_common: {
        en: 'In common!', 
        fr: 'En commun !'
      }
    },
    edit_item: {
      cancel: {
        en: 'Cancel',
        fr: 'Annuler'
      },
      validate: {
        en: 'Validate',
        fr: 'Valider'
      },
      add: {
        en: 'Add',
        fr: 'Ajouter'
      },
      new_category: {
        en: 'Add a new category',
        fr: 'Ajouter une nouvelle catégorie'
      },
      choose_in_list: {
        en: 'Choose in the list',
        fr: 'Choisis dans la liste'
      },
      add_keywords: {
        en: 'Add keywords to describe the class',
        fr: 'Ajoute des mots-clefs pour décrire le cours'
      }
    },
    item: {
      want_more_comments: {
        en: 'The more feedbacks we have the better : help the community by asking around yourself!',
        fr: 'Plus on a de commentaires mieux c\'est : aide la communauté en demandant autour de toi !'
      },
      ask_for_comments: {
        en: 'Ask for comments',
        fr: 'Demande des commentaires'
      },
      facebook_need_comment_title: {
        en: 'Who took',
        fr: 'Quelqu\'un a-t-il suivi'
      },
      facebook_need_comment_description: {
        en: 'I\'d like to know more. Can someone share some insight about this class ?',
        fr: 'Je cherche à me renseigner, quelqu\'un peut-il témoigner sur Shapter ?'
      },
      comment: {
        en: 'Leave a comment!',
        fr: 'Laisse un commentaire !'
      },
      hide_comment: {
        en: 'hide',
        fr: 'masquer'
      },
      characteristics: {
        en: 'Characteristics: ',
        fr: 'Caractéristiques :'
      },
      i_have_an_email: {
        en: 'Identify',
        fr: 'M\'identifier'
      },
      there_are: {
        en: 'There are',
        fr: 'Il y a'
      },
      hidden_comments: {
        en: 'hidden comments.',
        fr: 'commentaires cachés.'
      },
      to_see_the_comments: {
        en: 'To see someone\'s comment, you need to share an institution with them.',
        fr: 'Pour voir le commentaire d\'un étudiant, il faut que tu aies un établissement en commun avec lui.'
      },
      followed: {
        en: 'took the class',
        fr: 'suivi'
      },
      favourite: {
        en: 'favourite',
        fr: 'favoris'
      },
      no_comments: {
        en: 'Class hasn\'t been commented yet.',
        fr: 'Pas de commentaires pour le moment.'
      },
      no_diagram: {
        en: 'Class hasn\'t been rated yet. Evaluate it or ask someone who took the class to do it!',
        fr: 'Pas d\'évaluations pour le moment. Évalue le cours ou demande à quelqu\'un qui l\'a suivi de le faire !'
      },
      no_description: {
        en: 'We don\'t have the official description for this course. Could you upload it ? Click on the blue button above and copy-paste it!',
        fr: 'Nous n\'avons pas la description du cours. Clique sur "Editer la description" et copie-colle la pour que les autres puissent en profiter !'
      },
      diagram: {
        en: 'Diagram: ',
        fr: 'Diagramme : '
      },
      want_to_remove_document: {
        en: 'Do you reallly want to remove this document?',
        fr: 'Veux-tu vraiment supprimer ce document ? '
      },
      my_diagram_on: {
        en: 'My diagram on ',
        fr: 'Mon diagramme sur'
      },
      no_authorizations: {
        en: 'You are not allowed to display comments on this class',
        fr: 'Tu ne disposes pas des autorisations nécessaires pour afficher les commentaires sur ce cours'
      },
      need_subscription_to_institution: {
        en: 'You need to be recognized as a student from this institution. If you\'re part of it, send us an email at teamshapter@gmail.com',
        fr: 'Tu dois être reconnu comme étudiant de cet établissement pour cela. Si tu en fais partie, envoie-nous un email à teamshapter@gmail.com'
      },
      add_to_cart: {
        en: 'Add to cart',
        fr: 'Ajouter au panier'
      },
      i_wish_to_follow: {
        en: 'I wish to register for it',
        fr: 'Je prévois de le suivre'
      },
      i_have_followed_this_course: {
        en: 'I have followed this class', 
        fr: 'J\'ai suivi ce cours'
      },
      comments: {
        en: 'Comments:',
        fr: 'Commentaires : '
      },
      documents: {
        en: 'Documents', 
        fr: 'Documents'
      },
      add_a_comment: {
        en: 'Add a comment!',
        fr: 'Ajoute un commentaire !'
      },
      comment_ok: {
        en: 'Comment',
        fr: 'Commentaire'
      },
      edit_your_diagram: {
        en: 'Edit your diagram!', 
        fr: 'Édite ton diagramme !'
      },
      diagram_ok: {
        en: 'Diagram',
        fr: 'Diagramme'
      },
      add_a_document: {
        en: 'Upload a document!',
        fr: 'Ajoute un document !'
      },
      document_name: {
        en: 'Document name: ', 
        fr: 'Nom du document : '
      },
      description: {
        en: 'Description: ',
        fr: 'Description : '
      },
      select_a_file: {
        en: 'select a file: ',
        fr: 'Choisis un fichier'
      },
      send_the_document: {
        en: 'send',
        fr: 'envoyer'
      },
      download: {
        en: 'Download', 
        fr: 'Télécharger'
      },
      download_count: {
        en: 'Download count',
        fr: 'Nombre de téléchargements'
      },
      prev: {
        en: 'prev.',
        fr: 'prec.'
      },
      next: {
        en: 'next.',
        fr: 'suiv.'
      },
      average_diagram: {
        en: 'Average Diagram: ',
        fr: 'Diagramme Moyen : '
      },
      edit_my_diagram: {
        en: 'Edit My Diagram',
        fr: 'Éditer mon diagramme'
      },
      attending_students: {
        en: 'Students: ',
        fr: 'Étudiants :'
      },
      show_more: {
        en: 'Show more students',
        fr: 'Voir plus d\'étudiants'
      },
      associated_keywords: {
        en: 'Associated Keywords: ',
        fr: 'Mots-clefs associés'
      },
      update_syllabus: {
        en: 'Update the description',
        fr: 'Editer la description'
      },
      update_syllabus_textarea_placeholder: {
        en: 'Copy/paste the official description of the course',
        fr: 'Copie/colle la description officielle du cours'
      }
    },
    header: {
      schools_history: {
        en: 'recently visited',
        fr: 'visites récentes'
      },
      connect: {
        en: 'Connect',
        fr: 'Connexion'
      },
      home: {
        en: 'Home',
        fr: 'Accueil'
      },
      classes: {
        en: 'Classes', 
        fr: 'Les cours'
      },
      others: {
        en: 'Other',
        fr: 'Autres'
      },
      all_institutions: {
        en: 'All schools',
        fr: 'Tous les établissements'
      },
      my_institutions: {
        en: 'My institutions',
        fr: 'Mes établissements'
      },
      add_an_authorization: {
        en: 'Add a campus',
        fr: 'Ajouter un établissement'
      },
      people: {
        en: 'people',
        fr: 'people'
      },
      more: {
        en: 'more',
        fr: 'plus'
      },
      my_classes: {
        en: 'My cursus',
        fr: 'Mon parcours'
      },
      browse_classes: {
        en: 'Browse Classes',
        fr: 'Chercher des cours'
      },
      internships: {
        en: 'Internships',
        fr: 'Les stages'
      },
      my_authorizations: {
        en: 'My authorizations',
        fr: 'Mes autorisations'
      },
      add_a_campus: {
        en: 'Add a campus',
        fr: 'Ajouter un campus'
      },
      choose_a_campus: {
        en: 'Select a campus',
        fr: 'Sélectionne un campus'
      },
      browse: {
        en: 'Browse',
        fr: 'Chercher des cours'
      },
      course_builder: {
        en: 'Course builder', 
        fr: 'Parcours prévisionnel'
      },
      me: {
        en: 'Me',
        fr: 'Mon profil'
      },
      logout: {
        en: 'Logout',
        fr: 'Déconnexion'
      },
      contribute: {
        en: 'Contribute',
        fr: 'Contribuer'
      },
      edit: {
        en: 'Edit',
        fr: 'Éditer'
      }
    },
    add_campus: {
      add_your_campus: {
        en: 'Add your campus on Shapter',
        fr: 'Ajoute ton campus sur Shapter'
      },
      help_others: {
        en: 'And help thousands of students to take the right decisions',
        fr: 'Et aide des milliers d\'étudiants à faire les bons choix'
      },
      add_a_campus: {
        en: 'Add a campus',
        fr: 'Ajouter un campus'
      },
      choose_some_formation: {
        en: 'Choose one or many formations you\'d like to see on Shapter',
        fr: 'Choisis une ou plusieurs formations que tu voudrais ajouter sur Shapter'
      },
      example: {
        en: 'For example, my master courses',
        fr: 'Par exemple, je vais ajouter les optionnels de deuxième année de mon école'
      },
      find_documentation: {
        en: 'Find the public document describing the classes of your institution. You should be able to find that on the official website',
        fr: 'Trouve le document public de ton école qui décrit les cours. Généralement disponible sur le site web de l\'école'
      },
      download: {
        en: 'Download the table below and fill the information about the formation you chose according to the instructions',
        fr: 'Télécharge le tableau ci-dessous et renseigne les cours de ta formation selon les instructions '
      },
      download_excel: {
        en: 'Download Excel model',
        fr: 'Télécharger le modèle Excel'
      },
      send_it: {
        en: 'Send it to us at',
        fr: 'Envoie-le nous à'
      },
      we_come_back: {
        en: 'We add the courses and come back to you quickly !',
        fr: 'On ajoute les cours en on revient vers toi rapidement !'
      }

    },
    campus_authentication: {
      _continue: {
        en: 'continue',
        fr: 'continuer'
      },
      you_are_already_student: {
        en: 'You are already registered as a student.',
        fr: 'Tu es déjà identifié comme étudiant.'
      },
      you_are_already_student2: {
        en: 'You can add authorizations for other institutions if you have a matching email at your disposal.', 
        fr: 'Tu peux ajouter des autorisations pour d\'autres campus si tu disposes d\'emails étudiants de ces campus.'
      },
      your_school_email: {
        en: 'The email provided by your school',
        fr: 'L\'email fourni par ton établissement'
      },
      visitor_mode: {
        en: 'Visitor mode',
        fr: 'Entrer comme visiteur'
      },
      subscribe_to_my_campus: {
        en: 'Add your campus', 
        fr: 'Ajoute ton campus'
      },
      ignore_this_step: {
        en: 'Ignore this step, I\'m from no campus',
        fr: 'Passer cette étape, je n\'ai pas de campus'
      },
      to_benefit_from_shapter: {
        en: 'To take full advantage of Shapter, select your campus',
        fr: 'Pour profiter pleinement de Shapter, sélectionne ton campus'
      },
      add_an_authorization: {
        en: 'Add a authorization: ',
        fr: 'Ajoute une autorisation : '
      },
      where_from: {
        en: 'What is your campus?',
        fr: 'De quel campus viens-tu ?'
      },
      choose_uni: {
        en: 'Choose your campus',
        fr: 'Choisis ton établissement'
      },
      not_in_list: {
        en: 'My campus is not in the list',
        fr: 'Mon établissement n\'est pas dans la liste'
      },
      your_campus_email: {
        en: 'Give your campus email to revieve a confirmation email: ',
        fr: 'Renseigne ton adresse électronique de campus pour recevoir un email de confirmation : '
      },
      password: {
        en: 'Associated password: ',
        fr: 'Mot de passe associé au compte : '
      },
      receive_confirmation: {
        en: 'Recieve confirmation email', 
        fr: 'Recevoir l\'email de confirmation'
      },
      validated: {
        en: 'Validated', 
        fr: 'Validé'
      }
    },
    school: {
      share: {
        en: 'share',
        fr: 'partager'
      },
      best_comments_share_title: {
        en: 'Five of the best classes of',
        fr: 'Cinq des meilleurs cours de'
      },
      best_comments_share_description_1: {
        en: 'Come and see the five best classes of',
        fr: 'Venez decouvrir les cinq cours les mieux notes de'
      },
      best_comments_share_description_2: {
        en: 'according to students on Shapter, the Trip Advisor for your classes!',
        fr: 'selon les etudiants sur Shapter, le Trip Advisor des cours !'
      },
      on_shapter: {
        en: 'according to students on @shapter_ !',
        fr: 'selon les étudiants sur @shapter_ !'
      },
      come_and_check: {
        en: 'Come and check the five best courses of',
        fr: 'Venez voir les cinq meilleurs cours de'
      },
      browse_internships_by_keywords: {
        en: 'Browse trough internships',
        fr: 'Parcourir les stages'
      },
      where_do_they_internship: {
        en: 'Where do they internship ?',
        fr: 'Où sont-ils en stage ?'
      },
      campus_not_in_list: {
        en: 'My campus is not in the list',
        fr: 'Mon campus n\'est pas dans la liste'
      },
      browse_campuses: {
        en: 'Search for a campus',
        fr: 'Rechercher un établissement'
      },
      browse_classes: {
        en: 'Browse classes',
        fr: 'Chercher des cours'
      },
      my_classes: {
        en: 'My classes',
        fr: 'Mon cursus'
      },
      identify: {
        en: 'I\'m from this school',
        fr: 'M\'identifier dans cet établissement'
      },
      contribute: {
        en: 'Add comments',
        fr: 'Commenter'
      },
      contributors: {
        en: 'Contributors',
        fr: 'Contributeurs'
      },
      comments: {
        en: 'Comments', 
        fr: 'Commentaires'
      },
      diagrams: {
        en: 'Evaluations',
        fr: 'Évaluations'
      },
      electives: {
        en: 'Elective classes: ',
        fr: 'Cours optionnels : '
      },
      show_more: {
        en: 'Show more',
        fr: 'Voir plus'
      },
      fields_of_study: {
        en: 'Fields of study',
        fr: 'Domaines d\'enseignement'
      },
      some_students: {
        en: 'Some students from',
        fr: 'Quelques étudiants de'
      },
      they_love_it: {
        en: 'Five courses they love: ',
        fr: 'Cinq cours que les étudiants adorent :'
      },
      browse_all_courses: {
        en: 'All courses in',
        fr: 'Tous les cours de'
      },
      photo_credits: {
        en: 'Photo credits',
        fr: 'Crédits photo'
      },
      select_institution: {
        en: 'Select an institution to discover: ',
        fr: 'Sélectionne un établissement à découvrir : '
      },
      all_schools: {
        en: 'All schools',
        fr: 'Tous les établissements'
      }
    },
    side_item: {
      close: {
        en: 'Close',
        fr: 'Fermer'
      },
      display_class_page: {
        en: 'Display class page',
        fr: 'Afficher la page du cours'
      },
      comment: {
        en: 'Comment',
        fr: 'Commenter'
      },
      diagram: {
        en: 'Diagram',
        fr: 'Diagramme'
      },
      upload_file: {
        en: 'Upload a file',
        fr: 'Ajouter un doc'
      },
      by: {
        en: 'By',
        fr: 'Par'
      }
    },
    signup_funnel: {
      noSF: {
        en: 'This module hasn\'t been settled for this school. Cast us an email if you need it ! teamshapter@shapter.com',
        fr: 'Ce module n\'a pas encore été paramétré pour cet établissement. Envoie-nous un email si tu en as besoin ! teamshapter@shapter.com'
      },
      welcome: {
        en: 'Welcome on Shapter!',
        fr: 'Bienvenue sur Shapter !'
      },
      select_classes: {
        en: 'Select the classes you took',
        fr: 'Sélectionne les cours que tu as suivis'
      }
    },
    forgot_password: {
      change_pass: {
        en: 'Change password',
        fr: 'Changer de mot de passe'
      },
      new_pass: {
        en: 'New password', 
        fr: 'Nouveau mot de passe'
      }
    },
    system: {
      there_was_an_error: {
        en: 'There was an error',
        fr: 'Il y a eu une erreur'
      },
      back: {
        en: 'back',
        fr: 'retour'
      },
      display: {
        en: 'Display',
        fr: 'Afficher'
      },
      terminate: {
        en: 'Terminate',
        fr: 'Terminer'
      },
      or: {
        en: 'or',
        fr: 'ou'
      },
      question_mark: {
        en: '?',
        fr: ' ?'
      },
      exclamation: {
        en: '!',
        fr: ' !'
      },
      send: {
        en: 'send',
        fr: 'envoyer'
      },
      edit: {
        en: 'edit',
        fr: 'éditer'
      },
      add: {
        en: 'add',
        fr: 'ajouter'
      },
      select: {
        en: 'select',
        fr: 'sélectionner'
      },
      previous: {
        en: 'Previous',
        fr: 'Précédent'
      },
      next: {
        en: 'Next',
        fr: 'Suivant'
      },
      finish: {
        en: 'Finish',
        fr: 'Terminer'
      },
      validate: {
        en: 'Validate',
        fr: 'Valider'
      },
      cancel: {
        en: 'Cancel',
        fr: 'Annuler'
      },
      loading: {
        en: 'loading',
        fr: 'chargement'
      },
      close: {
        en: 'close',
        fr: 'fermer'
      }
    },
    categories: {
      internship: {
        en: 'Internship',
        fr: 'Stage'
      },
      classes: {
        en: 'Classes',
        fr: 'Cours'
      },
      school: {
        en: 'School',
        fr: 'Établissement'
      },
      formation: {
        en: 'Program',
        fr: 'Formation'
      },
      choice: {
        en: 'Elective category',
        fr: 'Choix'
      },
      option: {
        en: 'Option',
        fr: 'Option'
      },
      credits: {
        en: 'ECTS',
        fr: 'ECTS'
      },
      language: {
        en: 'Language',
        fr: 'Language'
      },
      geo: {
        en: 'Location',
        fr: 'Localisation'
      },
      teacher: {
        en: 'Teacher',
        fr: 'Professeur'
      },
      department: {
        en: 'Department',
        fr: 'Département'
      },
      item_name: {
        en: 'Name',
        fr: 'Nom'
      },
      admin: {
        en: 'Admin',
        fr: 'Admin'
      },
      other: {
        en: 'Other',
        fr: 'Autre'
      },
      skill: {
        en: 'Skill',
        fr: 'Compétence'
      },
      internship_name: {
        en: 'Name',
        fr: 'Nom'
      },
      company_size: {
        en: 'Company size',
        fr: 'Taille de l\'entreprise'
      },
      position: {
        en: 'Position',
        fr: 'Poste'
      },
      type: {
        en: 'type',
        fr: 'type'
      },
      domain: {
        en: 'Domain',
        fr: 'Domaine'
      },
      company: {
        en: 'Company',
        fr: 'Entreprise'
      }
    },
    confirmationSent: {
      get_new_confirmation_email: {
        en: 'Get a new confirmation email',
        fr: 'Recevoir un nouvel email de confirmation'
      },
      a_new_email_has_been_sent: {
        en: 'A new confirmation email has been sent to you. Check your spam folder if you can\'t find it !',
        fr: 'Un nouvel email de confirmation vient de t\'être envoyé. Si tu ne le trouves pas, check ton dossier de spams !'
      },
      error_while_sending: {
        en: 'There was an error sending your confirmation email. Please contact teamshapter@shapter.com',
        fr: 'Il y a eu une erreur lors de l\'envoi du nouveau mail de confirmation. Contacte teamshapter@shapter.com'
      },
      confirmation_sent: {
        en: 'A confirmation email has been sent to you at ',
        fr: 'Un email de confirmation t\'a été envoyé à l\'adresse '
      },
      click_on_it: {
        en: 'Click on it to enjoy Shapter',
        fr: 'Clique dessus et profite de Shapter'
      },
      check_spam: {
        en: 'If you don\'t recieve the email, check your spam folder',
        fr: 'Si tu ne reçois rien, vérifie ton dossier de spams'
      }
    },
    cursus: {
      pick_the_dates: {
        en: 'Please select start date and end date (approx)',
        fr: 'Séléctionne une date de début et une date de fin (approximatives)'
      },
      create_a_step: {
        en: 'Add a step to your profile!',
        fr: 'Ajoute une étape à ton parcours !'
      },
      step_title: {
        en: 'How would you name this step?',
        fr: 'Comment nommes-tu cette étape ?'
      }, 
      cant_remove_full_box: {
        en: 'You can only remove an empty step',
        fr: 'L\'étape doit être vide pour être retirée'
      },
      class_name: {
        en: 'What is the name of the class?',
        fr: 'Quel est le nom du cours ?'
      },
      didnt_take_the_class: {
        en: 'I didn\'nt take this class',
        fr: 'Je n\'ai pas suivi ce cours'
      },
      edit_box: {
        en: 'Edit this step',
        fr: 'Editer cette étape'
      },
      remove_step: {
        en: 'Remove this step form my profile',
        fr: 'Retirer cette étape de mon cursus'
      },
      sure_remove_step: {
        en: 'Do you really want to remove this step from your profile?',
        fr: 'Veux tu vraiment retirer cette étape de ton parcours ?'
      },
      account_needed: {
        en: 'Want to have a fancy profile on Shapter ? Just signup and build your profile !',
        fr: 'Tu veux avoir un profil sur Shapter ? Crée-toi simplement un compte !'
      },
      cancel_reco: {
        en: 'Cancel recommendation',
        fr: 'Annuler la recommandation'
      },
      an_internship: {
        en: 'An internship',
        fr: 'Un stage'
      },
      classes: {
        en: 'classes',
        fr: 'cours'
      },
      select_classes: {
        en: 'Select the classes you took: ',
        fr: 'Sélectionne les cours que tu as suivis :'
      },
      step_name: {
        en: 'Step name',
        fr: 'Nom de l\'étape: '
      },
      courses_referenced_with_those_keywords: {
        en: 'Those courses are referenced on Shapter with the following keywords: ',
        fr: 'Les cours sont référencés sur Shapter avec les mots-clefs suivants :'
      },
      show_details: {
        en: 'Show details',
        fr: 'Voir les détails'
      },
      hide_details: {
        en: 'Hide details',
        fr: 'Masquer les détails'
      },
      give_the_dates: {
        en: 'When did you take those classes ? (Approximative dates are OK)',
        fr: 'Quand as-tu suivi ces cours ? (A peu près)'
      },
      load_more_suggestions: {
        en: 'Load more suggestions',
        fr: 'Voir plus de suggestions'
      },
      my_course: {
        en: 'Your profile:',
        fr: 'Ton cursus :'
      },
      electives: {
        en: 'Elective classes',
        fr: 'Cours à choisir'
      },
      common_classes: {
        en: 'Core classes',
        fr: 'Tronc commun'
      },
      start_date: {
        en: 'Start date',
        fr: 'Date de début'
      },
      end_date: {
        en: 'End date',
        fr: 'Date de fin'
      },
      something_else: {
        en: 'I did something else!',
        fr: 'J\'ai fait quelque chose d\'autre !'
      },
      another_internship: {
        en: 'Another kind of internship',
        fr: 'Un autre type de stage'
      },
      internship: {
        en: 'Internship',
        fr: 'Stage'
      },
      add_step: {
        en: 'What did you do after',
        fr: 'Qu\'est-ce que tu as fait après'
      },
      add_internship: {
        en: 'Add an internship',
        fr: 'Ajoute un stage'
      },
      courses: {
        en: 'Add some courses',
        fr: 'Ajoute des cours'
      },
      comment: {
        en: 'comment',
        fr: 'commentaire'
      },
      diagram: {
        en: 'diagram',
        fr: 'diagramme'
      }
    }
  };

  return AppText;

}]);
