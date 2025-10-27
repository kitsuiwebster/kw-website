import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
  subtitle?: string;
  popular?: boolean;
}

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitrine.component.html',
  styleUrl: './vitrine.component.scss'
})
export class VitrineComponent {
  plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 450,
      subtitle: 'Site une page',
      features: [
        'Design moderne et professionnel',
        'Site vitrine 1 page optimisée',
        'Architecture orientée conversion',
        'Responsive design multi-écrans',
        'Formulaire de contact + intégration réseaux sociaux',
        'Géolocalisation Google Maps intégrée',
        'Mise en ligne et configuration hébergement',
        'Suivi projet avec points réguliers',
        'Environnement de prévisualisation client',
        'SEO de base inclus',
        'Optimisation performances et vitesse',
        'Sécurisation et protection avancée',
        'Rapport de livraison détaillé'
      ]
    },
    {
      name: 'Standard',
      price: 650,
      subtitle: 'Site multi-pages complet',
      features: [
        'Tous les avantages Starter inclus',
        'Site multi-pages jusqu\'à 5 sections',
        'Formulaires intelligents (devis, prise de RDV)',
        'Section témoignages clients',
        'Hébergement offert 1 an, puis option à 99€/an'
      ]
    },
    {
      name: 'Premium',
      price: 950,
      subtitle: 'Site étendu 10 pages',
      features: [
        'Tous les avantages Standard inclus',
        'Site étendu jusqu\'à 10 pages',
        'SEO complet et optimisé',
        'Intégrations (Calendly, Newsletter, Spotify, PayPal, Stripe, etc.)',
        'Analyse de trafic Google Analytics',
        'Maintenance et support 3 mois'
      ]
    }
  ];
}