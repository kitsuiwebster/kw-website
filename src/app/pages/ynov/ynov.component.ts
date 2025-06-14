import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { animate, style, transition, trigger } from '@angular/animations';

interface Option {
  title: string;
  image: string;
  impact: string;
  cityScale: string;
  countryScale: string;
}

interface Question {
  id: number;
  text: string;
  scenario: string;
  options: Option[];
  selectedOption?: number;
}

@Component({
  selector: 'app-ynov',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [provideAnimations()],
  templateUrl: './ynov.component.html',
  styleUrl: './ynov.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '500ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class YnovComponent implements OnInit {
  currentQuestionIndex = signal(0);
  quizStarted = signal(false);
  quizFinished = signal(false);
  progressPercentage = signal(0);
  confetti = signal(false);
  showExplanation = signal(false);
  viewAlternativeOption = signal(false);
  completedQuestions = signal(0);

  // Arrays for ngFor loops
  particleArray = Array.from({ length: 10 }, (_, i) => i + 1);
  confettiArray = Array.from({ length: 20 }, (_, i) => i + 1);
  optionLetters = ['A', 'B'];

  quizQuestions: Question[] = [
    {
      id: 1,
      text: 'Recherche de recettes de cuisine',
      scenario:
        'Vous et 15 millions de Français cherchez une recette simple chaque semaine (pâtes, omelette...)',
      options: [
        {
          title: 'Demander à ChatGPT',
          image: '/assets/images/ynov/gpt1.png',
          impact:
            'Consommation équivalente à alimenter la ville de Nice pendant 3 jours entiers (340 000 habitants)',
          cityScale:
            "Lille consommerait 40% d'énergie supplémentaire chaque semaine",
          countryScale:
            'La France augmenterait sa consommation électrique de 3% uniquement pour la cuisine',
        },
        {
          title: 'Consulter un site de cuisine classique ou un livre',
          image: '/assets/images/ynov/food.png',
          impact:
            'Consommation équivalente à alimenter une petite ville de 8 000 habitants pendant 1 jour',
          cityScale: 'Impact négligeable sur la consommation énergétique',
          countryScale:
            'Aucun impact mesurable sur la consommation électrique nationale',
        },
      ],
    },
    {
      id: 2,
      text: "Les emails d'excuse au travail",
      scenario:
        "20 millions d'actifs français écrivent 1 email d'excuse par semaine (retard, absence...)",
      options: [
        {
          title: 'Utiliser ChatGPT pour les rédiger',
          image:
            'https://img.freepik.com/free-photo/ai-nuclear-energy-background-future-innovation-disruptive-technology_53876-129783.jpg',
          impact:
            'Émissions équivalentes à 1,5 million de voitures qui font Paris-Lyon (500 km) chaque semaine',
          cityScale:
            "Lyon produirait autant de CO2 qu'une ville de 2 millions d'habitants",
          countryScale:
            "L'Allemagne augmenterait ses émissions de 5% annuellement",
        },
        {
          title: 'Les écrire soi-même',
          image:
            'https://img.freepik.com/free-photo/business-concept-with-laptop-desk_23-2149073032.jpg',
          impact: 'Pratiquement zéro émission',
          cityScale: 'Aucun impact sur les émissions urbaines',
          countryScale: 'Aucune augmentation des émissions nationales',
        },
      ],
    },
    {
      id: 3,
      text: "Résumé d'articles de presse",
      scenario:
        "25 millions de Français demandent un résumé d'un article de presse par jour",
      options: [
        {
          title: "Utiliser ChatGPT pour résumer l'article",
          image: '/assets/images/ynov/gpt2.png',
          impact:
            'Consommation équivalente à faire fonctionner 800 000 réfrigérateurs pendant 1 an',
          cityScale:
            "Strasbourg consommerait autant qu'une métropole de 2 millions d'habitants",
          countryScale:
            "L'Italie augmenterait sa consommation médiatique de 25%",
        },
        {
          title: "Lire directement l'article ou le résumé déjà présent",
          image: '/assets/images/ynov/article.png',
          impact: 'Équivalent à 15 000 réfrigérateurs seulement',
          cityScale: 'Impact minimal sur la consommation énergétique urbaine',
          countryScale:
            'Augmentation négligeable de la consommation médiatique (0,1%)',
        },
      ],
    },
    {
      id: 4,
      text: "Génération d'avatars pour réseaux sociaux",
      scenario:
        "100 millions d'utilisateurs mondiaux génèrent 1 avatar IA par mois",
      options: [
        {
          title: 'Utiliser Midjourney/DALL-E',
          image: '/assets/images/ynov/gpt3.png',
          impact:
            "Consommation électrique équivalente à alimenter la Suisse pendant 2 jours complets (8,7 millions d'habitants)",
          cityScale:
            "New York consommerait 25% d'électricité supplémentaire chaque mois",
          countryScale: "Le Danemark devrait importer 30% d'énergie en plus",
        },
        {
          title: 'Utiliser des photos existantes ou des avatars pré-faits',
          image: '/assets/images/ynov/photo.png',
          impact:
            'Équivalent à alimenter une ville de 50 000 habitants pendant 1 heure',
          cityScale: 'Augmentation de consommation inférieure à 0,1%',
          countryScale: 'Impact énergétique quasi inexistant',
        },
      ],
    },
    {
      id: 5,
      text: 'Aide aux devoirs des collégiens',
      scenario:
        "3 millions de collégiens français demandent de l'aide pour 1 exercice par jour",
      options: [
        {
          title: 'Utiliser ChatGPT',
          image: '/assets/images/ynov/gpt4.png',
          impact:
            "Émissions équivalentes à 5 millions de smartphones chargés CHAQUE JOUR = l'équivalent de recharger le téléphone de toute la population de la Norvège quotidiennement",
          cityScale: "Toulouse consommerait autant qu'une capitale européenne",
          countryScale:
            'La Belgique doublerait sa consommation électrique liée au numérique',
        },
        {
          title: 'Demander à leurs parents/utiliser leur manuel',
          image: '/assets/images/ynov/manual.png',
          impact: 'Pratiquement zéro émission',
          cityScale: 'Aucun impact énergétique mesurable',
          countryScale:
            'Aucune augmentation de la consommation électrique éducative',
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.updateProgressBar();
  }

  startQuiz(): void {
    this.quizStarted.set(true);
    this.updateProgressBar();
  }

  selectOption(optionIndex: number): void {
    if (
      this.quizQuestions[this.currentQuestionIndex()].selectedOption !==
      undefined
    ) {
      return; // Prevent changing the answer
    }

    this.quizQuestions[this.currentQuestionIndex()].selectedOption =
      optionIndex;
    this.showExplanation.set(true);
    this.completedQuestions.update((val) => val + 1);
  }

  toggleAlternativeView(): void {
    this.viewAlternativeOption.update((val) => !val);
  }

  nextQuestion(): void {
    this.showExplanation.set(false);
    this.viewAlternativeOption.set(false);

    if (this.currentQuestionIndex() < this.quizQuestions.length - 1) {
      this.currentQuestionIndex.update((val) => val + 1);
      this.updateProgressBar();
    } else {
      this.finishQuiz();
    }
  }

  updateProgressBar(): void {
    const progress =
      ((this.currentQuestionIndex() + 1) / this.quizQuestions.length) * 100;
    this.progressPercentage.set(progress);
  }

  finishQuiz(): void {
    this.quizFinished.set(true);

    // Show confetti for completing the quiz
    this.confetti.set(true);

    // Disable confetti after 5 seconds
    setTimeout(() => {
      this.confetti.set(false);
    }, 5000);
  }

  restartQuiz(): void {
    // Reset all variables
    this.currentQuestionIndex.set(0);
    this.quizStarted.set(false);
    this.quizFinished.set(false);
    this.showExplanation.set(false);
    this.viewAlternativeOption.set(false);
    this.progressPercentage.set(0);
    this.confetti.set(false);
    this.completedQuestions.set(0);

    // Reset user answers
    this.quizQuestions.forEach((question) => {
      delete question.selectedOption;
    });
  }

  getCurrentQuestion(): Question {
    return this.quizQuestions[this.currentQuestionIndex()];
  }

  getSelectedOption(): Option | null {
    const question = this.getCurrentQuestion();
    if (question.selectedOption !== undefined) {
      return question.options[question.selectedOption];
    }
    return null;
  }

  getAlternativeOption(): Option | null {
    const question = this.getCurrentQuestion();
    if (question.selectedOption !== undefined) {
      // Return the other option
      return question.options[question.selectedOption === 0 ? 1 : 0];
    }
    return null;
  }

  // Ajouter cette méthode à la classe YnovComponent
  shareQuiz(): void {
    // L'URL à copier
    const shareUrl = 'https://kitsuiwebster.com/ynov';

    // Copier l'URL dans le presse-papiers
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // Créer une notification toast
        this.showToastNotification();
      })
      .catch((err) => {
        console.error('Erreur lors de la copie du lien:', err);
      });
  }

  // Méthode complètement remaniée avec styles inline
  showToastNotification(): void {
    // Supprimer tout toast existant pour éviter l'empilement
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    // Créer l'élément toast avec des styles inline
    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    // Appliquer des styles inline pour s'assurer qu'ils sont correctement appliqués
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%) translateY(100px)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow:
        '0 8px 32px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      borderRadius: '50px',
      zIndex: '9999',
      transition:
        'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
      opacity: '0',
      maxWidth: '90%',
      pointerEvents: 'none',
    });

    // Créer l'icône
    const iconDiv = document.createElement('div');
    Object.assign(iconDiv.style, {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #22c55e, #0ea5e9)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px',
      color: 'white',
      flexShrink: '0',
    });

    iconDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

    // Créer le message
    const messageDiv = document.createElement('div');
    Object.assign(messageDiv.style, {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#252a41',
      margin: '0',
      padding: '0',
    });
    messageDiv.textContent = 'Lien copié dans le presse-papiers !';

    // Assembler le toast
    toast.appendChild(iconDiv);
    toast.appendChild(messageDiv);

    // Ajouter au DOM
    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    // Supprimer après 3 secondes
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}
