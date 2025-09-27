import { Component, Input, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../interfaces/card.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() card!: Card;
  @Input() id!: string;
  
  isModalOpen = false;
  imageLoaded = false;
  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.imageLoaded) {
            this.imageLoaded = true;
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

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
    return '';
  }

  getCardInfoLabel(): string {
    if (this.card.hauteur) return 'Hauteur:';
    if (this.card.surface && this.card.profondeur) {
      return 'Surface:\nProfondeur:';
    }
    if (this.card.surface) return 'Surface:';
    if (this.card.population && this.card.agglomeration) {
      return 'Population:\nAgglomération:';
    }
    if (this.card.population && this.card.superficie) {
      return 'Population:\nSuperficie:';
    }
    if (this.card.population) return 'Population:';
    if (this.card.profondeur) return 'Profondeur:';
    if (this.card.longueur) return 'Longueur:';
    if (this.card.superficie) return 'Superficie:';
    return '';
  }

  getCardInfoValue(): string {
    if (this.card.hauteur) return this.card.hauteur;
    if (this.card.surface && this.card.profondeur) {
      const surface = this.formatArea(this.card.surface);
      return `${surface}\n${this.card.profondeur}`;
    }
    if (this.card.surface) return this.formatArea(this.card.surface);
    if (this.card.population && this.card.agglomeration) {
      const pop = this.formatNumber(this.card.population);
      const agglo = this.formatNumber(this.card.agglomeration);
      return `${pop}\n${agglo}`;
    }
    if (this.card.population && this.card.superficie) {
      const pop = this.formatNumber(this.card.population);
      const superficie = this.formatArea(this.card.superficie);
      return `${pop}\n${superficie}`;
    }
    if (this.card.population) return this.formatNumber(this.card.population);
    if (this.card.profondeur) return this.card.profondeur;
    if (this.card.longueur) return this.formatArea(this.card.longueur);
    if (this.card.superficie) return this.formatArea(this.card.superficie);
    return '';
  }

  private formatNumber(value: string): string {
    // Convertir "12,506,000 M" en "12.5 M"
    if (value.includes(',') && value.includes(' M')) {
      const numStr = value.replace(' M', '').replace(/,/g, '');
      const num = parseFloat(numStr) / 1000000;
      return `${num.toFixed(1)} M`;
    }
    return value;
  }

  private formatArea(value: string): string {
    // Convertir "82,100 km²" en "82.1 km²" ou "643,801 km²" en "643.8 km²"
    if (value.includes('km²') || value.includes('km')) {
      const match = value.match(/^([\d,]+)\s*(km²?)/);
      if (match) {
        const numStr = match[1].replace(/,/g, '');
        const num = parseFloat(numStr);
        const unit = match[2];
        
        if (num >= 1000) {
          return `${(num / 1000).toFixed(1)}k ${unit}`;
        } else {
          return `${num.toFixed(1)} ${unit}`;
        }
      }
    }
    return value;
  }

  getSmallImageUrl(): string {
    // Pour l'instant, utiliser l'image originale (on peut optimiser plus tard)
    return this.card.image;
  }

  getFullImageUrl(): string {
    // Retourner l'image en taille originale
    return this.card.image;
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
        'Centrafrique': 'cf',
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
        
        // Pays européens
        'France': 'fr',
        'Belgique': 'be',
        'Allemagne': 'de',
        'Espagne': 'es',
        'Italie': 'it',
        'Russie': 'ru',
        'Géorgie': 'ge',
        'Albanie': 'al',
        'Andorre': 'ad',
        'Autriche': 'at',
        'Biélorussie': 'by',
        'Bosnie-Herzégovine': 'ba',
        'Bulgarie': 'bg',
        'Chypre': 'cy',
        'Croatie': 'hr',
        'Danemark': 'dk',
        'Estonie': 'ee',
        'Finlande': 'fi',
        'Grèce': 'gr',
        'Hongrie': 'hu',
        'Irlande': 'ie',
        'Islande': 'is',
        'Lettonie': 'lv',
        'Lituanie': 'lt',
        'Luxembourg': 'lu',
        'Macédoine du Nord': 'mk',
        'Malte': 'mt',
        'Moldavie': 'md',
        'Monténégro': 'me',
        'Norvège': 'no',
        'Pays-Bas': 'nl',
        'Pologne': 'pl',
        'Portugal': 'pt',
        'République Tchèque': 'cz',
        'Roumanie': 'ro',
        'Royaume-Uni': 'gb',
        'Saint-Marin': 'sm',
        'Serbie': 'rs',
        'Slovaquie': 'sk',
        'Slovénie': 'si',
        'Suisse': 'ch',
        'Suède': 'se',
        'Ukraine': 'ua',
        
        // Pays américains
        'Argentine': 'ar',
        'Antigua-et-Barbuda': 'ag',
        'Bahamas': 'bs',
        'Barbade': 'bb',
        'Belize': 'bz',
        'Bolivie': 'bo',
        'Brésil': 'br',
        'Canada': 'ca',
        'Chili': 'cl',
        'Colombie': 'co',
        'Costa Rica': 'cr',
        'Cuba': 'cu',
        'Dominique': 'dm',
        'États-Unis': 'us',
        'Équateur': 'ec',
        'Grenade': 'gd',
        'Guatemala': 'gt',
        'Guyana': 'gy',
        'Haïti': 'ht',
        'Honduras': 'hn',
        'Jamaïque': 'jm',
        'Mexique': 'mx',
        'Nicaragua': 'ni',
        'Panama': 'pa',
        'Paraguay': 'py',
        'Porto Rico': 'pr',
        'Pérou': 'pe',
        'République Dominicaine': 'do',
        'Saint-Christophe-et-Niévès': 'kn',
        'St-Christophe-et-Niévès': 'kn',
        'Saint-Vincent-et-les-Grenadines': 'vc',
        'St-Vincent-et-les-Grenadines': 'vc',
        'Sainte-Lucie': 'lc',
        'Salvador': 'sv',
        'Suriname': 'sr',
        'Trinité-et-Tobago': 'tt',
        'Uruguay': 'uy',
        'Venezuela': 've',
        
        // Pays océaniens
        'Australie': 'au',
        'Fidji': 'fj',
        'Kiribati': 'ki',
        'Micronésie': 'fm',
        'Nauru': 'nr',
        'Nouvelle-Zélande': 'nz',
        'Palaos': 'pw',
        'Papouasie-Nouvelle-Guinée': 'pg',
        'Samoa': 'ws',
        'Tonga': 'to',
        'Tuvalu': 'tv',
        'Vanuatu': 'vu',
        'Îles Marshall': 'mh',
        'Îles Salomon': 'sb',
        
        // Villes (prendre le pays)
        'Paris': 'fr',
        'Tokyo': 'jp',
        'Mumbai': 'in',
        'Pékin': 'cn',
        'Le Cap': 'za',
        'Berlin': 'de',
        'Londres': 'gb',
        'Moscou': 'ru',
        'New York': 'us',
        'Rio de Janeiro': 'br',
        'Sydney': 'au',
        // Nouvelles villes africaines
        'Lagos': 'ng',
        'Kinshasa': 'cd',
        'Le Caire': 'eg',
        'Casablanca': 'ma',
        'Nairobi': 'ke',
        'Johannesburg': 'za',
        'Luanda': 'ao',
        'Addis-Abeba': 'et',
        'Abidjan': 'ci',
        'Alexandrie': 'eg',
        'Khartoum': 'sd',
        'Dakar': 'sn',
        'Accra': 'gh',
        'Tunis': 'tn',
        'Rabat': 'ma',
        'Alger': 'dz',
        'Oran': 'dz'
      };
      
      const countryCode = countryMapping[this.card.nom];
      if (countryCode) {
        // Cas spéciaux pour les drapeaux non-rectangulaires
        if (countryCode === 'ch' || countryCode === 'np') {
          // Utiliser une version rectangulaire alternative
          return `https://flagpedia.net/data/flags/w580/${countryCode}.webp`;
        }
        return `https://flagcdn.com/w40/${countryCode}.png`;
      }
    }
    return null;
  }
}