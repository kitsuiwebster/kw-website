import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Card {
  type: string;
  emoji: string;
  image: string;
  nom: string;
  localisation: string;
  continent?: string;
  hauteur?: string;
  surface?: string;
  population?: string;
  superficie?: string;
  profondeur?: string;
  longueur?: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card!: Card;
  @Input() id!: string;
  
  isModalOpen = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeModal();
    }
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  getCardInfo(): string {
    if (this.card.hauteur) return this.card.hauteur;
    if (this.card.surface) return this.card.surface;
    if (this.card.population && this.card.superficie) {
      return `${this.card.population} - ${this.card.superficie}`;
    }
    if (this.card.profondeur) return this.card.profondeur;
    if (this.card.longueur) return this.card.longueur;
    if (this.card.superficie) return this.card.superficie;
    return '';
  }

  getFlagUrl(): string | null {
    if (this.card.type === 'Pays' || this.card.type === 'Ville') {
      // Mapping des noms vers les codes pays pour les drapeaux
      const countryMapping: { [key: string]: string } = {
        // Pays africains
        'Algérie': 'dz',
        'Angola': 'ao',
        'Bénin': 'bj',
        'Botswana': 'bw',
        'Burkina Faso': 'bf',
        'Burundi': 'bi',
        'Cameroun': 'cm',
        'Cap-Vert': 'cv',
        'République centrafricaine': 'cf',
        'Tchad': 'td',
        'Comores': 'km',
        'République démocratique du Congo': 'cd',
        'République du Congo': 'cg',
        'Côte d\'Ivoire': 'ci',
        'Djibouti': 'dj',
        'Égypte': 'eg',
        'Guinée équatoriale': 'gq',
        'Érythrée': 'er',
        'Éthiopie': 'et',
        'Gabon': 'ga',
        'Gambie': 'gm',
        'Ghana': 'gh',
        'Guinée': 'gn',
        'Guinée-Bissau': 'gw',
        'Kenya': 'ke',
        'Lesotho': 'ls',
        'Libéria': 'lr',
        'Libye': 'ly',
        'Madagascar': 'mg',
        'Malawi': 'mw',
        'Mali': 'ml',
        'Mauritanie': 'mr',
        'Maurice': 'mu',
        'Maroc': 'ma',
        'Mozambique': 'mz',
        'Namibie': 'na',
        'Niger': 'ne',
        'Nigeria': 'ng',
        'Rwanda': 'rw',
        'São Tomé-et-Príncipe': 'st',
        'Sénégal': 'sn',
        'Seychelles': 'sc',
        'Sierra Leone': 'sl',
        'Somalie': 'so',
        'Afrique du Sud': 'za',
        'Soudan du Sud': 'ss',
        'Soudan': 'sd',
        'Eswatini': 'sz',
        'Tanzanie': 'tz',
        'Togo': 'tg',
        'Tunisie': 'tn',
        'Ouganda': 'ug',
        'Zambie': 'zm',
        'Zimbabwe': 'zw',
        
        // Pays asiatiques
        'Afghanistan': 'af',
        'Arménie': 'am',
        'Azerbaïdjan': 'az',
        'Bahreïn': 'bh',
        'Bangladesh': 'bd',
        'Bhoutan': 'bt',
        'Brunei': 'bn',
        'Cambodge': 'kh',
        'Chine': 'cn',
        'Corée du Nord': 'kp',
        'Corée du Sud': 'kr',
        'Émirats arabes unis': 'ae',
        'Inde': 'in',
        'Indonésie': 'id',
        'Irak': 'iq',
        'Iran': 'ir',
        'Israël': 'il',
        'Japon': 'jp',
        'Jordanie': 'jo',
        'Kazakhstan': 'kz',
        'Kirghizistan': 'kg',
        'Koweït': 'kw',
        'Laos': 'la',
        'Liban': 'lb',
        'Malaisie': 'my',
        'Maldives': 'mv',
        'Mongolie': 'mn',
        'Myanmar': 'mm',
        'Népal': 'np',
        'Oman': 'om',
        'Ouzbékistan': 'uz',
        'Pakistan': 'pk',
        'Palestine': 'ps',
        'Philippines': 'ph',
        'Qatar': 'qa',
        'Arabie saoudite': 'sa',
        'Singapour': 'sg',
        'Sri Lanka': 'lk',
        'Syrie': 'sy',
        'Tadjikistan': 'tj',
        'Thaïlande': 'th',
        'Timor oriental': 'tl',
        'Turkménistan': 'tm',
        'Turquie': 'tr',
        'Viêt Nam': 'vn',
        'Yémen': 'ye',
        
        // Pays existants (exemples)
        'France': 'fr',
        'Belgique': 'be',
        'Allemagne': 'de',
        'Espagne': 'es',
        'Italie': 'it',
        'Russie': 'ru',
        'Géorgie': 'ge',
        
        // Villes (prendre le pays)
        'Paris': 'fr',
        'Tokyo': 'jp',
        'Mumbai': 'in',
        'Pékin': 'cn',
        'Le Cap': 'za'
      };
      
      const countryCode = countryMapping[this.card.nom];
      if (countryCode) {
        return `https://flagcdn.com/w40/${countryCode}.png`;
      }
    }
    return null;
  }
}