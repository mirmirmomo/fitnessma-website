import React, { createContext, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    nav: {
      browseCoaches: "Browse Coaches",
      dashboard: "Dashboard", 
      myAppointments: "My Appointments",
      adminPanel: "Admin Panel",
      login: "Login",
      signUp: "Sign Up",
      logout: "Logout",
      signedInAs: "Signed in as"
    },
    
    // Auth Pages
    auth: {
      signInTitle: "Sign in to your account",
      createAccountTitle: "Create your account",
      signInButton: "Sign In",
      signUpButton: "Sign Up",
      orCreateAccount: "Or create a new account",
      orSignIn: "Or sign in to your existing account",
      emailAddress: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      createPassword: "Create a password",
      confirmPasswordPlaceholder: "Confirm your password",
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      phonePlaceholder: "Enter your phone number",
      passwordsNotMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      demoAccounts: "Demo Accounts:",
      admin: "Admin",
      coach: "Coach",
      client: "Client",
      registerNewAccount: "Register a new account"
    },

    // Coaches Page
    coaches: {
      title: "Our Expert Coaches",
      subtitle: "Meet our certified personal trainers and fitness specialists. Each coach brings unique expertise to help you achieve your fitness goals.",
      noCoaches: "No coaches available at the moment.",
      loadingCoaches: "Loading coaches...",
      failedToLoad: "Failed to load coaches",
      yearsExperience: "years experience",
      hour: "hour",
      availableDays: "Available Days:",
      bookSession: "Book Session",
      loginToBook: "Login to Book"
    },
    
    // Home Page
    home: {
      hero: {
        title: "FitnessMA",
        subtitle: "Transform your fitness journey with Morocco's premier fitness platform. Connect with certified coaches, book personalized sessions, and achieve your health goals with our state-of-the-art facilities.",
        startJourney: "Start Your Journey",
        signIn: "Sign In",
        browseCoaches: "Browse Our Coaches"
      },
      features: {
        title: "Why Choose FitnessMA?",
        subtitle: "Experience Morocco's most innovative fitness platform with cutting-edge technology and expert guidance",
        booking: {
          title: "Smart Booking System",
          description: "Revolutionary booking experience with real-time availability, instant confirmations, and smart scheduling that adapts to your lifestyle."
        },
        coaches: {
          title: "Elite Moroccan Coaches", 
          description: "Work with Morocco's finest certified trainers and specialists. Each coach brings expertise in multiple fitness disciplines and personalized training methods."
        },
        experience: {
          title: "Premium Experience",
          description: "State-of-the-art facilities, premium equipment, and personalized attention designed to deliver exceptional results and exceed your expectations."
        }
      },
      stats: {
        title: "Our Impact in Morocco",
        members: "Active Members",
        coaches: "Expert Coaches", 
        sessions: "Sessions Completed",
        satisfaction: "Satisfaction Rate"
      },
      services: {
        title: "Our Fitness Programs",
        subtitle: "Comprehensive fitness solutions tailored for Morocco's health-conscious community",
        strength: {
          title: "Strength Training",
          description: "Build muscle, increase strength, and improve your physique with our comprehensive weight training programs."
        },
        weight: {
          title: "Weight Management", 
          description: "Achieve your ideal weight with scientifically-backed nutrition and exercise programs designed for lasting results."
        },
        hiit: {
          title: "HIIT & Cardio",
          description: "High-intensity workouts that maximize calorie burn, improve cardiovascular health, and boost endurance."
        }
      },
      cta: {
        title: "Ready to Transform Your Life?",
        subtitle: "Join thousands of Moroccans who have already transformed their health and fitness with FitnessMA",
        start: "Start Your Transformation",
        meetCoaches: "Meet Our Coaches"
      },
      contact: {
        title: "Visit FitnessMA",
        subtitle: "Experience Morocco's premier fitness destination",
        location: "Location",
        hours: "Hours",
        contact: "Contact"
      }
    },

    // Admin Dashboard
    admin: {
      title: "Admin Dashboard",
      stats: {
        totalUsers: "Total Users",
        coaches: "Coaches", 
        appointments: "Appointments",
        blockedUsers: "Blocked Users"
      },
      tabs: {
        userManagement: "User Management",
        coachManagement: "Coach Management", 
        appointments: "Appointments"
      },
      users: {
        title: "User Management",
        addUser: "Add New User",
        createUser: "Create New User",
        email: "Email",
        password: "Password",
        firstName: "First Name", 
        lastName: "Last Name",
        role: "Role",
        client: "Client",
        coach: "Coach",
        admin: "Admin",
        creating: "Creating...",
        createUserButton: "Create User",
        cancel: "Cancel",
        user: "User",
        status: "Status",
        created: "Created",
        actions: "Actions",
        active: "Active",
        blocked: "Blocked",
        blockUser: "Block User",
        unblockUser: "Unblock User",
        deleteUser: "Delete User",
        confirmDelete: "Are you sure you want to delete this user? This action cannot be undone."
      },
      coaches: {
        title: "Coach Management",
        addCoach: "Add New Coach",
        createCoach: "Create New Coach", 
        editCoach: "Edit Coach",
        specialty: "Specialty",
        hourlyRate: "Hourly Rate ($)",
        experience: "Experience (Years)",
        availableDays: "Available Days",
        startTime: "Start Time",
        endTime: "End Time", 
        bio: "Bio",
        saving: "Saving...",
        updateCoach: "Update Coach",
        coach: "Coach",
        rate: "Rate",
        availability: "Availability",
        edit: "Edit",
        delete: "Delete",
        confirmDeleteCoach: "Are you sure you want to delete this coach? This will also delete their user account."
      },
      appointments: {
        title: "Appointment Management",
        client: "Client",
        coach: "Coach", 
        dateTime: "Date & Time",
        status: "Status",
        created: "Created"
      }
    },

    // Common
    common: {
      loading: "Loading...",
      tryAgain: "Try Again",
      book: "Book",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      create: "Create",
      update: "Update",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      actions: "Actions",
      status: "Status",
      date: "Date",
      time: "Time",
      notes: "Notes",
      optional: "Optional",
      required: "Required"
    },

    // Appointments
    appointments: {
      title: "My Appointments", 
      noAppointments: "No appointments yet",
      noAppointmentsDesc: "Book your first appointment with one of our expert coaches.",
      bookAppointment: "Book Appointment",
      bookNew: "Book New Appointment",
      cancelling: "Cancelling...",
      pastAppointment: "Past appointment",
      confirmCancel: "Are you sure you want to cancel this appointment?"
    },

    // Book Appointment
    booking: {
      title: "Book an Appointment",
      selectCoach: "Select Coach", 
      selectDate: "Select Date",
      selectTime: "Select Time",
      summary: "Appointment Summary",
      booking: "Booking...",
      booked: "Appointment Booked!",
      bookedDesc: "Your appointment has been successfully scheduled.",
      redirecting: "Redirecting to your appointments..."
    }
  },

  fr: {
    // Navigation
    nav: {
      browseCoaches: "Parcourir les Coachs",
      dashboard: "Tableau de bord",
      myAppointments: "Mes Rendez-vous", 
      adminPanel: "Panneau Admin",
      login: "Connexion",
      signUp: "S'inscrire",
      logout: "Déconnexion",
      signedInAs: "Connecté en tant que"
    },

    // Auth Pages
    auth: {
      signInTitle: "Se connecter à votre compte",
      createAccountTitle: "Créer votre compte",
      signInButton: "Se connecter",
      signUpButton: "S'inscrire",
      orCreateAccount: "Ou créer un nouveau compte",
      orSignIn: "Ou vous connecter à votre compte existant",
      emailAddress: "Adresse e-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phoneNumber: "Numéro de téléphone",
      enterEmail: "Entrez votre e-mail",
      enterPassword: "Entrez votre mot de passe",
      createPassword: "Créer un mot de passe",
      confirmPasswordPlaceholder: "Confirmer votre mot de passe",
      firstNamePlaceholder: "Prénom",
      lastNamePlaceholder: "Nom de famille",
      phonePlaceholder: "Entrez votre numéro de téléphone",
      passwordsNotMatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit comporter au moins 6 caractères",
      demoAccounts: "Comptes de démonstration :",
      admin: "Admin",
      coach: "Coach",
      client: "Client",
      registerNewAccount: "S'inscrire"
    },

    // Coaches Page
    coaches: {
      title: "Nos Coachs Experts",
      subtitle: "Rencontrez nos entraîneurs personnels et spécialistes de la fitness certifiés. Chaque coach apporte une expertise unique pour vous aider à atteindre vos objectifs de fitness.",
      noCoaches: "Aucun coach disponible pour le moment.",
      loadingCoaches: "Chargement des coachs...",
      failedToLoad: "Échec du chargement des coachs",
      yearsExperience: "années d'expérience",
      hour: "heure",
      availableDays: "Jours Disponibles :",
      bookSession: "Réserver une Session",
      loginToBook: "Se connecter pour réserver"
    },

    // Home Page
    home: {
      hero: {
        title: "FitnessMA",
        subtitle: "Transformez votre parcours fitness avec la plateforme fitness premier du Maroc. Connectez-vous avec des coachs certifiés, réservez des séances personnalisées et atteignez vos objectifs de santé avec nos installations de pointe.",
        startJourney: "Commencer Votre Parcours",
        signIn: "Se Connecter", 
        browseCoaches: "Parcourir Nos Coachs"
      },
      features: {
        title: "Pourquoi Choisir FitnessMA?",
        subtitle: "Découvrez la plateforme fitness la plus innovante du Maroc avec une technologie de pointe et des conseils d'experts",
        booking: {
          title: "Système de Réservation Intelligent",
          description: "Expérience de réservation révolutionnaire avec disponibilité en temps réel, confirmations instantanées et planification intelligente qui s'adapte à votre style de vie."
        },
        coaches: {
          title: "Coachs Marocains d'Élite",
          description: "Travaillez avec les meilleurs entraîneurs certifiés et spécialistes du Maroc. Chaque coach apporte une expertise dans de multiples disciplines de fitness et des méthodes d'entraînement personnalisées."
        },
        experience: {
          title: "Expérience Premium",
          description: "Installations de pointe, équipement premium et attention personnalisée conçus pour offrir des résultats exceptionnels et dépasser vos attentes."
        }
      },
      stats: {
        title: "Notre Impact au Maroc",
        members: "Membres Actifs",
        coaches: "Coachs Experts",
        sessions: "Séances Terminées", 
        satisfaction: "Taux de Satisfaction"
      },
      services: {
        title: "Nos Programmes Fitness",
        subtitle: "Solutions fitness complètes adaptées à la communauté soucieuse de la santé du Maroc",
        strength: {
          title: "Entraînement de Force",
          description: "Développez vos muscles, augmentez votre force et améliorez votre physique avec nos programmes complets d'entraînement avec poids."
        },
        weight: {
          title: "Gestion du Poids",
          description: "Atteignez votre poids idéal avec des programmes de nutrition et d'exercice scientifiquement prouvés conçus pour des résultats durables."
        },
        hiit: {
          title: "HIIT & Cardio", 
          description: "Entraînements à haute intensité qui maximisent la combustion des calories, améliorent la santé cardiovasculaire et augmentent l'endurance."
        }
      },
      cta: {
        title: "Prêt à Transformer Votre Vie?",
        subtitle: "Rejoignez des milliers de Marocains qui ont déjà transformé leur santé et leur fitness avec FitnessMA",
        start: "Commencer Votre Transformation",
        meetCoaches: "Rencontrer Nos Coachs"
      },
      contact: {
        title: "Visiter FitnessMA",
        subtitle: "Découvrez la destination fitness première du Maroc",
        location: "Localisation", 
        hours: "Heures",
        contact: "Contact"
      }
    },

    // Admin Dashboard  
    admin: {
      title: "Tableau de Bord Admin",
      stats: {
        totalUsers: "Total Utilisateurs",
        coaches: "Coachs",
        appointments: "Rendez-vous",
        blockedUsers: "Utilisateurs Bloqués"
      },
      tabs: {
        userManagement: "Gestion des Utilisateurs",
        coachManagement: "Gestion des Coachs",
        appointments: "Rendez-vous"
      },
      users: {
        title: "Gestion des Utilisateurs",
        addUser: "Ajouter Nouvel Utilisateur",
        createUser: "Créer Nouvel Utilisateur",
        email: "E-mail",
        password: "Mot de passe", 
        firstName: "Prénom",
        lastName: "Nom de famille",
        role: "Rôle",
        client: "Client",
        coach: "Coach",
        admin: "Admin",
        creating: "Création...",
        createUserButton: "Créer Utilisateur",
        cancel: "Annuler",
        user: "Utilisateur",
        status: "Statut",
        created: "Créé",
        actions: "Actions",
        active: "Actif",
        blocked: "Bloqué",
        blockUser: "Bloquer Utilisateur",
        unblockUser: "Débloquer Utilisateur", 
        deleteUser: "Supprimer Utilisateur",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action ne peut pas être annulée."
      },
      coaches: {
        title: "Gestion des Coachs",
        addCoach: "Ajouter Nouveau Coach",
        createCoach: "Créer Nouveau Coach",
        editCoach: "Modifier Coach",
        specialty: "Spécialité",
        hourlyRate: "Tarif Horaire ($)",
        experience: "Expérience (Années)", 
        availableDays: "Jours Disponibles",
        startTime: "Heure de Début",
        endTime: "Heure de Fin",
        bio: "Bio",
        saving: "Enregistrement...",
        updateCoach: "Mettre à Jour Coach",
        coach: "Coach",
        rate: "Tarif",
        availability: "Disponibilité",
        edit: "Modifier",
        delete: "Supprimer",
        confirmDeleteCoach: "Êtes-vous sûr de vouloir supprimer ce coach? Cela supprimera également son compte utilisateur."
      },
      appointments: {
        title: "Gestion des Rendez-vous", 
        client: "Client",
        coach: "Coach",
        dateTime: "Date et Heure",
        status: "Statut",
        created: "Créé"
      }
    },

    // Common
    common: {
      loading: "Chargement...",
      tryAgain: "Réessayer",
      book: "Réserver",
      cancel: "Annuler",
      save: "Enregistrer", 
      edit: "Modifier",
      delete: "Supprimer",
      create: "Créer",
      update: "Mettre à jour",
      confirm: "Confirmer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      actions: "Actions",
      status: "Statut",
      date: "Date",
      time: "Heure",
      notes: "Notes",
      optional: "Optionnel",
      required: "Requis"
    },

    // Appointments
    appointments: {
      title: "Mes Rendez-vous",
      noAppointments: "Aucun rendez-vous pour le moment",
      noAppointmentsDesc: "Réservez votre premier rendez-vous avec l'un de nos coachs experts.",
      bookAppointment: "Réserver un Rendez-vous",
      bookNew: "Réserver Nouveau Rendez-vous", 
      cancelling: "Annulation...",
      pastAppointment: "Rendez-vous passé",
      confirmCancel: "Êtes-vous sûr de vouloir annuler ce rendez-vous?"
    },

    // Book Appointment
    booking: {
      title: "Réserver un Rendez-vous",
      selectCoach: "Sélectionner Coach",
      selectDate: "Sélectionner Date",
      selectTime: "Sélectionner Heure",
      summary: "Résumé du Rendez-vous",
      booking: "Réservation...",
      booked: "Rendez-vous Réservé!",
      bookedDesc: "Votre rendez-vous a été programmé avec succès.",
      redirecting: "Redirection vers vos rendez-vous..."
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const language = 'fr';

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 