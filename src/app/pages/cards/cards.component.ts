import { Component, OnInit, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

interface Card {
  type: string;
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
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, AfterViewInit {
  allCards: Card[] = [];
  cards: Card[] = [];
  shuffledCards: Card[] = [];
  displayedCards: Card[] = [];
  filterType: string = '';
  isLoading: boolean = false;
  progress: number = 0;
  Math = Math;
  
  showFilters: boolean = false;
  searchTerm: string = '';
  
  // Infinite scroll properties
  private cardsPerLoad = 20;
  private currentIndex = 0;
  isLoadingMore = false;
  private containerElement?: HTMLElement;
  
  // Filtres par type
  typeFilters = [
    { value: 'Sommet', label: 'Sommets', checked: false },
    { value: 'Lac', label: 'Lacs', checked: false },
    { value: 'Ville', label: 'Villes', checked: false },
    { value: 'Pays', label: 'Pays', checked: false },
    { value: 'Mer', label: 'Mers', checked: false },
    { value: 'Océan', label: 'Océans', checked: false },
    { value: 'Fleuve', label: 'Fleuves', checked: false },
    { value: 'Désert', label: 'Déserts', checked: false },
    { value: 'Île', label: 'Îles', checked: false }
  ];
  
  // Filtres par continent
  continentFilters = [
    { value: 'Europe', label: 'Europe', checked: false },
    { value: 'Asie', label: 'Asie', checked: false },
    { value: 'Afrique', label: 'Afrique', checked: false },
    { value: 'Amérique du Nord', label: 'Amérique du Nord', checked: false },
    { value: 'Amérique centrale', label: 'Amérique centrale', checked: false },
    { value: 'Amérique du Sud', label: 'Amérique du Sud', checked: false },
    { value: 'Océanie', label: 'Océanie', checked: false },
    { value: 'Antarctique', label: 'Antarctique', checked: false }
  ];

  ngOnInit() {
    this.loadCards();
    this.shuffleAndFilter();
    this.loadInitialCards();
  }

  ngAfterViewInit() {
    // Attendre que la vue soit initialisée pour trouver le container
    setTimeout(() => {
      this.containerElement = document.querySelector('.all-cards-container') as HTMLElement;
      if (this.containerElement) {
        this.containerElement.addEventListener('scroll', () => this.onContainerScroll());
      }
    }, 100);
  }

  onContainerScroll() {
    if (!this.containerElement) return;
    
    if (this.isLoadingMore || this.currentIndex >= this.shuffledCards.length) return;

    const scrollTop = this.containerElement.scrollTop;
    const scrollHeight = this.containerElement.scrollHeight;
    const clientHeight = this.containerElement.clientHeight;
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;


    if (scrollPercentage >= 80) {
      this.loadMoreCards();
    }
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('document:scroll', ['$event'])
  onScroll(event?: any) {
    this.checkScrollOnWindow();
  }

  private checkScrollOnElement(element: HTMLElement) {
    if (this.isLoadingMore || this.currentIndex >= this.shuffledCards.length) return;

    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;


    if (scrollPercentage >= 80) {
      this.loadMoreCards();
    }
  }

  private checkScrollOnWindow() {
    if (this.isLoadingMore || this.currentIndex >= this.shuffledCards.length) return;

    // Essayer différentes méthodes pour détecter le scroll
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;


    // Charger plus quand on est à 80% du scroll
    if (scrollPercentage >= 80) {
      this.loadMoreCards();
    }
  }

  private loadInitialCards() {
    this.currentIndex = 0;
    this.displayedCards = [];
    this.loadMoreCards();
  }

  private loadMoreCards() {
    if (this.isLoadingMore || this.currentIndex >= this.shuffledCards.length) return;
    
    this.isLoadingMore = true;
    
    // Simuler un petit délai pour le loading
    setTimeout(() => {
      const nextCards = this.shuffledCards.slice(this.currentIndex, this.currentIndex + this.cardsPerLoad);
      this.displayedCards = [...this.displayedCards, ...nextCards];
      this.currentIndex += this.cardsPerLoad;
      this.isLoadingMore = false;
    }, 300);
  }

  loadCards() {
    this.allCards = [
      // mountains
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/everest.jpg",
        nom: "Mont Everest",
        localisation: "Népal",
        continent: "Asie",
        hauteur: "8,848 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/k2.jpg",
        nom: "K2",
        localisation: "Pakistan et Chine",
        continent: "Asie",
        hauteur: "8,611 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/denali.jpg",
        nom: "Denali",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        hauteur: "6,190 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/kilimanjaro.jpg",
        nom: "Kilimandjaro",
        localisation: "Tanzanie",
        continent: "Afrique",
        hauteur: "5,895 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/elbrus.jpg",
        nom: "Mont Elbrouz",
        localisation: "Russie",
        continent: "Europe",
        hauteur: "5,642 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/vinson.jpg",
        nom: "Mont Vinson",
        localisation: "Antarctique",
        continent: "Antarctique",
        hauteur: "4,892 m"
      },
      {
        type: "Sommet",
        image: "assets/images/cards/mountain/aconcagua.jpg",
        nom: "Aconcagua",
        localisation: "Argentine",
        continent: "Amérique du Sud",
        hauteur: "6,961 m"
      },

      // lakes
      {
        type: "Lac",
        image: "assets/images/cards/lake/baikal.jpg",
        nom: "Lac Baïkal",
        localisation: "Russie",
        continent: "Asie",
        surface: "31,500 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/superior.jpg",
        nom: "Lac Supérieur",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "82,100 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/victoria.jpg",
        nom: "Lac Victoria",
        localisation: "Tanzanie, Ouganda et Kenya",
        continent: "Afrique",
        surface: "68,800 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/huron.jpg",
        nom: "Lac Huron",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "59,600 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/michigan.jpg",
        nom: "Lac Michigan",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        surface: "58,000 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/tanganyika.jpg",
        nom: "Lac Tanganyika",
        localisation: "Burundi, R.D.C, Tanzanie et Zambie",
        continent: "Afrique",
        surface: "32,900 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/titicaca.jpg",
        nom: "Lac Titicaca",
        localisation: "Pérou et Bolivie",
        continent: "Amérique du Sud",
        surface: "8,372 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/malawi.jpg",
        nom: "Lac Malawi",
        localisation: "Malawi, Mozambique et Tanzanie",
        continent: "Afrique",
        surface: "29,600 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/great-slave.jpg",
        nom: "Grand Lac des Esclaves",
        localisation: "Canada",
        continent: "Amérique du Nord",
        surface: "27,200 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/leman.jpg",
        nom: "Lac Léman",
        localisation: "Suisse et France",
        continent: "Europe",
        surface: "580 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/natron.png",
        nom: "Lac Natron",
        localisation: "Tanzanie",
        continent: "Afrique",
        surface: "1,040 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/almaty.jpg",
        nom: "Lac d'Almaty",
        localisation: "Kazakhstan",
        continent: "Asie",
        surface: "1.82 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/erie.jpg",
        nom: "Lac Érié",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "25,700 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/ontario.jpeg",
        nom: "Lac Ontario",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "18,960 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/great-bear.jpg",
        nom: "Grand Lac de l'Ours",
        localisation: "Canada",
        continent: "Amérique du Nord",
        surface: "31,080 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/kariba.jpg",
        nom: "Lac Kariba",
        localisation: "Zimbabwe et Zambie",
        continent: "Afrique",
        surface: "5,580 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/issyk-kul.jpg",
        nom: "Lac Issyk-Koul",
        localisation: "Kirghizistan",
        continent: "Asie",
        surface: "6,236 km²"
      },
      {
        type: "Lac",
        image: "assets/images/cards/lake/caspian.jpg",
        nom: "Mer Caspienne",
        localisation: "Iran, Russie, Kazakhstan, Turkménistan et Azerbaïdjan",
        continent: "Asie",
        surface: "371,000 km²"
      },

      // cities
      {
        type: "Ville",
        image: "assets/images/cards/city/paris.jpg",
        nom: "Paris",
        localisation: "France",
        continent: "Europe",
        population: "2,161,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/tokyo.jpg",
        nom: "Tokyo",
        localisation: "Japon",
        continent: "Asie",
        population: "13,960,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/new-york.jpg",
        nom: "New York",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        population: "8,336,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/london.jpg",
        nom: "Londres",
        localisation: "Royaume-Uni",
        continent: "Europe",
        population: "8,982,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/sydney.jpeg",
        nom: "Sydney",
        localisation: "Australie",
        continent: "Océanie",
        population: "5,312,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/berlin.jpg",
        nom: "Berlin",
        localisation: "Allemagne",
        continent: "Europe",
        population: "3,748,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/moscow.jpg",
        nom: "Moscou",
        localisation: "Russie",
        continent: "Europe",
        population: "12,506,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/rio.jpg",
        nom: "Rio de Janeiro",
        localisation: "Brésil",
        continent: "Amérique du Sud",
        population: "6,748,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/mumbai.jpg",
        nom: "Mumbai",
        localisation: "Inde",
        continent: "Asie",
        population: "20,411,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/cape-town.jpg",
        nom: "Le Cap",
        localisation: "Afrique du Sud",
        continent: "Afrique",
        population: "4,004,000 M"
      },
      {
        type: "Ville",
        image: "assets/images/cards/city/beijing.jpg",
        nom: "Pékin",
        localisation: "Chine",
        continent: "Asie",
        population: "21,893,000 M"
      },

      // countries - oceania
      {
        type: "Pays",
        image: "assets/images/cards/country/australia.png",
        nom: "Australie",
        localisation: "Océanie",
        continent: "Océanie",
        population: "25 M",
        superficie: "7,692,024 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/fiji.jpg",
        nom: "Fidji",
        localisation: "Océanie",
        continent: "Océanie",
        population: "896 K",
        superficie: "18,274 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/papua_new_guinea.jpg",
        nom: "Papouasie-Nouvelle-Guinée",
        localisation: "Océanie",
        continent: "Océanie",
        population: "9.12 M",
        superficie: "462,840 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/new_zealand.jpg",
        nom: "Nouvelle-Zélande",
        localisation: "Océanie",
        continent: "Océanie",
        population: "4.9 M",
        superficie: "268,021 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/vanuatu.jpg",
        nom: "Vanuatu",
        localisation: "Océanie",
        continent: "Océanie",
        population: "307 K",
        superficie: "12,189 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/samoa.jpg",
        nom: "Samoa",
        localisation: "Océanie",
        continent: "Océanie",
        population: "202 K",
        superficie: "2,842 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/tonga.jpg",
        nom: "Tonga",
        localisation: "Océanie",
        continent: "Océanie",
        population: "106 K",
        superficie: "747 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/kiribati.jpg",
        nom: "Kiribati",
        localisation: "Océanie",
        continent: "Océanie",
        population: "123 K",
        superficie: "811 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/marshall_islands.jpg",
        nom: "Îles Marshall",
        localisation: "Océanie",
        continent: "Océanie",
        population: "59 K",
        superficie: "181 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/micronesia.jpeg",
        nom: "Micronésie",
        localisation: "Océanie",
        continent: "Océanie",
        population: "116 K",
        superficie: "702 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/palau.jpg",
        nom: "Palaos",
        localisation: "Océanie",
        continent: "Océanie",
        population: "18 K",
        superficie: "459 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/nauru.jpg",
        nom: "Nauru",
        localisation: "Océanie",
        continent: "Océanie",
        population: "12.8 K",
        superficie: "21 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/solomon_islands.jpg",
        nom: "Îles Salomon",
        localisation: "Océanie",
        continent: "Océanie",
        population: "703 K",
        superficie: "28,400 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/tuvalu.jpg",
        nom: "Tuvalu",
        localisation: "Océanie",
        continent: "Océanie",
        population: "11.3 K",
        superficie: "26 km²"
      },

      // countries - europe
      {
        type: "Pays",
        image: "assets/images/cards/country/albania.jpg",
        nom: "Albanie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.8 M",
        superficie: "28,748 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/germany.jpg",
        nom: "Allemagne",
        localisation: "Europe",
        continent: "Europe",
        population: "83 M",
        superficie: "357,022 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/andorra.jpg",
        nom: "Andorre",
        localisation: "Europe",
        continent: "Europe",
        population: "77 K",
        superficie: "468 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/austria.jpg",
        nom: "Autriche",
        localisation: "Europe",
        continent: "Europe",
        population: "8.9 M",
        superficie: "83,879 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/belarus.jpg",
        nom: "Biélorussie",
        localisation: "Europe",
        continent: "Europe",
        population: "9.4 M",
        superficie: "207,600 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/belgium.jpg",
        nom: "Belgique",
        localisation: "Europe",
        continent: "Europe",
        population: "11.5 M",
        superficie: "30,689 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/bosnia.jpg",
        nom: "Bosnie-Herzégovine",
        localisation: "Europe",
        continent: "Europe",
        population: "3.3 M",
        superficie: "51,197 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/bulgaria.jpg",
        nom: "Bulgarie",
        localisation: "Europe",
        continent: "Europe",
        population: "7 M",
        superficie: "110,879 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/croatia.jpg",
        nom: "Croatie",
        localisation: "Europe",
        continent: "Europe",
        population: "4.1 M",
        superficie: "56,594 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/cyprus.jpg",
        nom: "Chypre",
        localisation: "Europe",
        continent: "Europe",
        population: "1.2 M",
        superficie: "9,251 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/czech-republic.jpg",
        nom: "République Tchèque",
        localisation: "Europe",
        continent: "Europe",
        population: "10.7 M",
        superficie: "78,867 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/denmark.jpeg",
        nom: "Danemark",
        localisation: "Europe",
        continent: "Europe",
        population: "5.8 M",
        superficie: "42,933 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/estonia.jpg",
        nom: "Estonie",
        localisation: "Europe",
        continent: "Europe",
        population: "1.3 M",
        superficie: "45,227 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/finland.jpg",
        nom: "Finlande",
        localisation: "Europe",
        continent: "Europe",
        population: "5.5 M",
        superficie: "338,424 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/france.jpg",
        nom: "France",
        localisation: "Europe",
        continent: "Europe",
        population: "67 M",
        superficie: "643,801 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/georgia.jpg",
        nom: "Géorgie",
        localisation: "Europe et Asie",
        continent: "Europe",
        population: "3.7 M",
        superficie: "69,700 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/greece.jpg",
        nom: "Grèce",
        localisation: "Europe",
        continent: "Europe",
        population: "10.4 M",
        superficie: "131,957 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/hungary.jpg",
        nom: "Hongrie",
        localisation: "Europe",
        continent: "Europe",
        population: "9.6 M",
        superficie: "93,028 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/iceland.jpg",
        nom: "Islande",
        localisation: "Europe",
        continent: "Europe",
        population: "364 K",
        superficie: "103,000 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/ireland.jpg",
        nom: "Irlande",
        localisation: "Europe",
        continent: "Europe",
        population: "4.9 M",
        superficie: "70,273 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/italy.jpg",
        nom: "Italie",
        localisation: "Europe",
        continent: "Europe",
        population: "60.4 M",
        superficie: "301,340 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/latvia.jpg",
        nom: "Lettonie",
        localisation: "Europe",
        continent: "Europe",
        population: "1.9 M",
        superficie: "64,589 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/lithuania.jpg",
        nom: "Lituanie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.8 M",
        superficie: "65,300 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/luxembourg.jpg",
        nom: "Luxembourg",
        localisation: "Europe",
        continent: "Europe",
        population: "626 K",
        superficie: "2,586 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/malta.jpeg",
        nom: "Malte",
        localisation: "Europe",
        continent: "Europe",
        population: "514 K",
        superficie: "316 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/moldova.jpg",
        nom: "Moldavie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.6 M",
        superficie: "33,846 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/montenegro.jpeg",
        nom: "Monténégro",
        localisation: "Europe",
        continent: "Europe",
        population: "622 K",
        superficie: "13,812 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/netherlands.jpg",
        nom: "Pays-Bas",
        localisation: "Europe",
        continent: "Europe",
        population: "17.3 M",
        superficie: "41,543 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/norway.jpg",
        nom: "Norvège",
        localisation: "Europe",
        continent: "Europe",
        population: "5.4 M",
        superficie: "385,207 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/poland.jpg",
        nom: "Pologne",
        localisation: "Europe",
        continent: "Europe",
        population: "38 M",
        superficie: "312,696 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/portugal.jpg",
        nom: "Portugal",
        localisation: "Europe",
        continent: "Europe",
        population: "10.3 M",
        superficie: "92,090 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/romania.jpg",
        nom: "Roumanie",
        localisation: "Europe",
        continent: "Europe",
        population: "19.3 M",
        superficie: "238,397 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/russia.jpg",
        nom: "Russie",
        localisation: "Europe et Asie",
        continent: "Europe",
        population: "146 M",
        superficie: "17,098,242 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/san-marino.jpg",
        nom: "Saint-Marin",
        localisation: "Europe",
        continent: "Europe",
        population: "34 K",
        superficie: "61 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/serbia.jpg",
        nom: "Serbie",
        localisation: "Europe",
        continent: "Europe",
        population: "7 M",
        superficie: "88,361 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/slovakia.jpg",
        nom: "Slovaquie",
        localisation: "Europe",
        continent: "Europe",
        population: "5.4 M",
        superficie: "49,035 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/slovenia.jpg",
        nom: "Slovénie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.1 M",
        superficie: "20,273 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/spain.jpg",
        nom: "Espagne",
        localisation: "Europe",
        continent: "Europe",
        population: "47 M",
        superficie: "505,990 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/sweden.jpg",
        nom: "Suède",
        localisation: "Europe",
        continent: "Europe",
        population: "10.3 M",
        superficie: "450,295 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/switzerland.jpeg",
        nom: "Suisse",
        localisation: "Europe",
        continent: "Europe",
        population: "8.6 M",
        superficie: "41,290 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/ukraine.jpg",
        nom: "Ukraine",
        localisation: "Europe",
        continent: "Europe",
        population: "41 M",
        superficie: "603,500 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/united-kingdom.jpg",
        nom: "Royaume-Uni",
        localisation: "Europe",
        continent: "Europe",
        population: "67 M",
        superficie: "242,495 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/macedonia.jpeg",
        nom: "Macédoine du Nord",
        localisation: "Europe",
        continent: "Europe",
        population: "2.1 M",
        superficie: "25,713 km²"
      },

      // countries - south america
      {
        type: "Pays",
        image: "assets/images/cards/country/argentina.jpeg",
        nom: "Argentine",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "45 M",
        superficie: "2,780,400 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/brazil.jpg",
        nom: "Brésil",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "213 M",
        superficie: "8,515,767 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/chile.jpg",
        nom: "Chili",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "19 M",
        superficie: "756,102 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/colombia.jpg",
        nom: "Colombie",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "51 M",
        superficie: "1,141,748 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/ecuador.jpg",
        nom: "Équateur",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "17.4 M",
        superficie: "283,561 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/peru.jpg",
        nom: "Pérou",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "33 M",
        superficie: "1,285,216 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/venezuela.jpg",
        nom: "Venezuela",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "28 M",
        superficie: "916,445 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/uruguay.jpg",
        nom: "Uruguay",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "3.5 M",
        superficie: "176,215 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/paraguay.jpg",
        nom: "Paraguay",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "7.1 M",
        superficie: "406,752 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/bolivia.jpg",
        nom: "Bolivie",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "11.6 M",
        superficie: "1,098,581 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/suriname.jpg",
        nom: "Suriname",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "0.6 M",
        superficie: "163,821 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/country/guyana.jpg",
        nom: "Guyana",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "0.8 M",
        superficie: "214,969 km²"
      },

      // Amérique du Nord
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Canada",
        localisation: "Amérique du Nord",
        continent: "Amérique du Nord",
        population: "38.2 M",
        superficie: "9,984,670 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "États-Unis",
        localisation: "Amérique du Nord",
        continent: "Amérique du Nord",
        population: "331.9 M",
        superficie: "9,833,520 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Mexique",
        localisation: "Amérique du Nord",
        continent: "Amérique du Nord",
        population: "128.9 M",
        superficie: "1,964,375 km²"
      },

      // Amérique centrale
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Guatemala",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "17.3 M",
        superficie: "108,889 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Belize",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.4 M",
        superficie: "22,966 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Honduras",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "10.1 M",
        superficie: "112,492 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Salvador",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "6.5 M",
        superficie: "21,041 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Nicaragua",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "6.8 M",
        superficie: "130,373 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Costa Rica",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "5.2 M",
        superficie: "51,100 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Panama",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "4.4 M",
        superficie: "75,417 km²"
      },

      // Amérique centrale - Caraïbes
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Cuba",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.3 M",
        superficie: "109,884 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Haïti",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.5 M",
        superficie: "27,750 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "République Dominicaine",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.0 M",
        superficie: "48,671 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Jamaïque",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "2.8 M",
        superficie: "10,991 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Porto Rico",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "3.2 M",
        superficie: "9,104 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Trinité-et-Tobago",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "1.4 M",
        superficie: "5,131 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Barbade",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.3 M",
        superficie: "439 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Bahamas",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.4 M",
        superficie: "13,943 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Sainte-Lucie",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.2 M",
        superficie: "617 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Grenade",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "344 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Antigua-et-Barbuda",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "443 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Dominique",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.07 M",
        superficie: "751 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Saint-Christophe-et-Niévès",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.05 M",
        superficie: "261 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Saint-Vincent-et-les-Grenadines",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "389 km²"
      },

      // African countries
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Algérie",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "44.9 M",
        superficie: "2,381,741 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Angola",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "35.6 M",
        superficie: "1,246,700 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Bénin",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "13.5 M",
        superficie: "112,622 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Botswana",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "2.4 M",
        superficie: "581,730 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Burkina Faso",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "22.7 M",
        superficie: "274,200 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Burundi",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "12.6 M",
        superficie: "27,830 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Cameroun",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "28.6 M",
        superficie: "475,440 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Cap-Vert",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "0.6 M",
        superficie: "4,033 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "République centrafricaine",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "5.5 M",
        superficie: "622,984 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Tchad",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "17.7 M",
        superficie: "1,284,000 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Comores",
        localisation: "Océan Indien",
        continent: "Afrique",
        population: "0.9 M",
        superficie: "2,235 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "République démocratique du Congo",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "102.3 M",
        superficie: "2,344,858 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "République du Congo",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "5.8 M",
        superficie: "342,000 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Côte d'Ivoire",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "28.2 M",
        superficie: "322,463 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Djibouti",
        localisation: "Corne de l'Afrique",
        continent: "Afrique",
        population: "1.1 M",
        superficie: "23,200 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Égypte",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "109.3 M",
        superficie: "1,001,450 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Guinée équatoriale",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "1.7 M",
        superficie: "28,051 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Érythrée",
        localisation: "Corne de l'Afrique",
        continent: "Afrique",
        population: "3.7 M",
        superficie: "117,600 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Éthiopie",
        localisation: "Corne de l'Afrique",
        continent: "Afrique",
        population: "123.4 M",
        superficie: "1,104,300 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Gabon",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "2.4 M",
        superficie: "267,667 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Gambie",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "2.7 M",
        superficie: "11,295 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Ghana",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "33.5 M",
        superficie: "238,533 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Guinée",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "14.2 M",
        superficie: "245,857 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Guinée-Bissau",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "2.1 M",
        superficie: "36,125 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Kenya",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "56.2 M",
        superficie: "580,367 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Lesotho",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "2.3 M",
        superficie: "30,355 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Libéria",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "5.4 M",
        superficie: "111,369 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Libye",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "7.0 M",
        superficie: "1,759,540 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Madagascar",
        localisation: "Océan Indien",
        continent: "Afrique",
        population: "30.3 M",
        superficie: "587,041 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Malawi",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "20.4 M",
        superficie: "118,484 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Mali",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "22.6 M",
        superficie: "1,240,192 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Mauritanie",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "5.0 M",
        superficie: "1,030,700 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Maurice",
        localisation: "Océan Indien",
        continent: "Afrique",
        population: "1.3 M",
        superficie: "2,040 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Maroc",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "37.7 M",
        superficie: "446,550 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Mozambique",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "33.9 M",
        superficie: "801,590 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Namibie",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "2.6 M",
        superficie: "824,292 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Niger",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "26.2 M",
        superficie: "1,267,000 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Nigeria",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "223.8 M",
        superficie: "923,768 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Rwanda",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "14.1 M",
        superficie: "26,338 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "São Tomé-et-Príncipe",
        localisation: "Afrique centrale",
        continent: "Afrique",
        population: "0.2 M",
        superficie: "964 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Sénégal",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "18.4 M",
        superficie: "196,722 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Seychelles",
        localisation: "Océan Indien",
        continent: "Afrique",
        population: "0.1 M",
        superficie: "455 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Sierra Leone",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "8.8 M",
        superficie: "71,740 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Somalie",
        localisation: "Corne de l'Afrique",
        continent: "Afrique",
        population: "18.1 M",
        superficie: "637,657 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Afrique du Sud",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "60.4 M",
        superficie: "1,221,037 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Soudan du Sud",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "11.1 M",
        superficie: "644,329 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Soudan",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "48.1 M",
        superficie: "1,861,484 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Eswatini",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "1.2 M",
        superficie: "17,364 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Tanzanie",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "65.5 M",
        superficie: "947,303 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Togo",
        localisation: "Afrique de l'Ouest",
        continent: "Afrique",
        population: "8.8 M",
        superficie: "56,785 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Tunisie",
        localisation: "Afrique du Nord",
        continent: "Afrique",
        population: "12.4 M",
        superficie: "163,610 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Ouganda",
        localisation: "Afrique de l'Est",
        continent: "Afrique",
        population: "48.6 M",
        superficie: "241,038 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Zambie",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "20.0 M",
        superficie: "752,612 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Zimbabwe",
        localisation: "Afrique australe",
        continent: "Afrique",
        population: "16.3 M",
        superficie: "390,757 km²"
      },

      // Asian countries
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Afghanistan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "41.1 M",
        superficie: "652,867 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Arménie",
        localisation: "Caucase",
        continent: "Asie",
        population: "3.0 M",
        superficie: "29,743 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Azerbaïdjan",
        localisation: "Caucase",
        continent: "Asie",
        population: "10.4 M",
        superficie: "86,600 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Bahreïn",
        localisation: "Golfe Persique",
        continent: "Asie",
        population: "1.8 M",
        superficie: "778 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Bangladesh",
        localisation: "Asie du Sud",
        continent: "Asie",
        population: "171.2 M",
        superficie: "147,570 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Bhoutan",
        localisation: "Himalaya",
        continent: "Asie",
        population: "0.8 M",
        superficie: "38,394 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Brunei",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "0.5 M",
        superficie: "5,765 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Cambodge",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "16.9 M",
        superficie: "181,035 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Chine",
        localisation: "Asie de l'Est",
        continent: "Asie",
        population: "1,425.7 M",
        superficie: "9,596,960 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Corée du Nord",
        localisation: "Asie de l'Est",
        continent: "Asie",
        population: "26.0 M",
        superficie: "120,538 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Corée du Sud",
        localisation: "Asie de l'Est",
        continent: "Asie",
        population: "51.7 M",
        superficie: "100,210 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Émirats arabes unis",
        localisation: "Golfe Persique",
        continent: "Asie",
        population: "9.4 M",
        superficie: "83,600 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Inde",
        localisation: "Asie du Sud",
        continent: "Asie",
        population: "1,428.6 M",
        superficie: "3,287,263 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Indonésie",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "277.5 M",
        superficie: "1,904,569 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Irak",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "44.5 M",
        superficie: "438,317 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Iran",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "86.0 M",
        superficie: "1,648,195 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Israël",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "9.7 M",
        superficie: "22,072 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Japon",
        localisation: "Asie de l'Est",
        continent: "Asie",
        population: "123.3 M",
        superficie: "377,975 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Jordanie",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "11.3 M",
        superficie: "89,342 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Kazakhstan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "20.0 M",
        superficie: "2,724,900 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Kirghizistan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "7.0 M",
        superficie: "199,951 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Koweït",
        localisation: "Golfe Persique",
        continent: "Asie",
        population: "4.3 M",
        superficie: "17,818 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Laos",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "7.5 M",
        superficie: "236,800 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Liban",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "5.5 M",
        superficie: "10,452 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Malaisie",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "34.2 M",
        superficie: "329,847 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Maldives",
        localisation: "Océan Indien",
        continent: "Asie",
        population: "0.5 M",
        superficie: "298 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Mongolie",
        localisation: "Asie de l'Est",
        continent: "Asie",
        population: "3.4 M",
        superficie: "1,564,110 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Myanmar",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "54.2 M",
        superficie: "676,578 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Népal",
        localisation: "Himalaya",
        continent: "Asie",
        population: "30.5 M",
        superficie: "147,516 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Oman",
        localisation: "Péninsule arabique",
        continent: "Asie",
        population: "4.6 M",
        superficie: "309,500 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Ouzbékistan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "35.6 M",
        superficie: "447,400 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Pakistan",
        localisation: "Asie du Sud",
        continent: "Asie",
        population: "240.5 M",
        superficie: "881,913 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Palestine",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "5.4 M",
        superficie: "6,020 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Philippines",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "117.3 M",
        superficie: "300,000 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Qatar",
        localisation: "Golfe Persique",
        continent: "Asie",
        population: "2.7 M",
        superficie: "11,586 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Arabie saoudite",
        localisation: "Péninsule arabique",
        continent: "Asie",
        population: "36.4 M",
        superficie: "2,149,690 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Singapour",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "6.0 M",
        superficie: "719 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Sri Lanka",
        localisation: "Asie du Sud",
        continent: "Asie",
        population: "22.2 M",
        superficie: "65,610 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Syrie",
        localisation: "Moyen-Orient",
        continent: "Asie",
        population: "23.2 M",
        superficie: "185,180 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Tadjikistan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "10.1 M",
        superficie: "143,100 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Thaïlande",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "71.7 M",
        superficie: "513,120 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Timor oriental",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "1.4 M",
        superficie: "14,919 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Turkménistan",
        localisation: "Asie centrale",
        continent: "Asie",
        population: "6.1 M",
        superficie: "488,100 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Turquie",
        localisation: "Anatolie",
        continent: "Asie",
        population: "85.3 M",
        superficie: "783,562 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Viêt Nam",
        localisation: "Asie du Sud-Est",
        continent: "Asie",
        population: "98.2 M",
        superficie: "331,212 km²"
      },
      {
        type: "Pays",
        image: "assets/images/cards/default.jpg",
        nom: "Yémen",
        localisation: "Péninsule arabique",
        continent: "Asie",
        population: "34.4 M",
        superficie: "527,968 km²"
      },

      // seas
      {
        type: "Mer",
        image: "assets/images/cards/sea/mediterranean.jpg",
        nom: "Mer Méditerranée",
        localisation: "Europe, Afrique et Asie",
        continent: "Europe",
        profondeur: "5,267 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/caribbean.jpeg",
        nom: "Mer des Caraïbes",
        localisation: "Amérique",
        continent: "Amérique centrale",
        profondeur: "7,686 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/baltic.jpg",
        nom: "Mer Baltique",
        localisation: "Europe",
        continent: "Europe",
        profondeur: "459 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/arabian.jpg",
        nom: "Mer d'Arabie",
        localisation: "Asie",
        continent: "Asie",
        profondeur: "4,652 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/bering.jpeg",
        nom: "Mer de Béring",
        localisation: "Amérique et Asie",
        continent: "Asie",
        profondeur: "4,097 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/south-china.jpg",
        nom: "Mer de Chine Méridionale",
        localisation: "Asie",
        continent: "Asie",
        profondeur: "5,016 m"
      },
      {
        type: "Mer",
        image: "assets/images/cards/sea/black.jpg",
        nom: "Mer Noire",
        localisation: "Europe et Asie",
        continent: "Europe",
        profondeur: "2,212 m"
      },

      // oceans
      {
        type: "Océan",
        image: "assets/images/cards/ocean/pacific.jpg",
        nom: "Océan Pacifique",
        localisation: "Amérique, Asie et Océanie",
        continent: "Océanie",
        profondeur: "10,911 m"
      },
      {
        type: "Océan",
        image: "assets/images/cards/ocean/atlantic.jpg",
        nom: "Océan Atlantique",
        localisation: "Amérique, Europe et Afrique",
        continent: "Europe",
        profondeur: "8,486 m"
      },
      {
        type: "Océan",
        image: "assets/images/cards/ocean/southern.jpg",
        nom: "Océan Austral",
        localisation: "Antarctique",
        continent: "Antarctique",
        profondeur: "7,236 m"
      },
      {
        type: "Océan",
        image: "assets/images/cards/ocean/indian.jpg",
        nom: "Océan Indien",
        localisation: "Asie, Afrique et Australie",
        continent: "Asie",
        profondeur: "7,258 m"
      },
      {
        type: "Océan",
        image: "assets/images/cards/ocean/arctic.jpg",
        nom: "Océan Arctique",
        localisation: "Arctique",
        continent: "Amérique du Nord",
        profondeur: "5,450 m"
      },

      // rivers
      {
        type: "Fleuve",
        image: "assets/images/cards/river/nil.jpg",
        nom: "Nil",
        localisation: "Égypte, Soudan et Soudan du sud",
        continent: "Afrique",
        longueur: "6,650 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/amazon.jpg",
        nom: "Amazone",
        localisation: "Brésil, Pérou, Colombie",
        continent: "Amérique du Sud",
        longueur: "7,062 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/yangtze.jpg",
        nom: "Yangtsé",
        localisation: "Chine",
        continent: "Asie",
        longueur: "6,300 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/mississippi.png",
        nom: "Mississippi",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        longueur: "3,734 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/yenisei.jpg",
        nom: "Ienisseï",
        localisation: "Russie",
        continent: "Asie",
        longueur: "5,539 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/congo.jpg",
        nom: "Congo",
        localisation: "République démocratique du Congo",
        continent: "Afrique",
        longueur: "4,700 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/volga.jpg",
        nom: "Volga",
        localisation: "Russie",
        continent: "Europe",
        longueur: "3,530 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/mekong.jpg",
        nom: "Mékong",
        localisation: "Chine, Myanmar, Laos, Thaïlande, Cambodge, Vietnam",
        continent: "Asie",
        longueur: "4,350 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/ganges.jpg",
        nom: "Gange",
        localisation: "Inde et Bangladesh",
        continent: "Asie",
        longueur: "2,525 km"
      },
      {
        type: "Fleuve",
        image: "assets/images/cards/river/danube.jpg",
        nom: "Danube",
        localisation: "Allemagne, Autriche, Slovaquie, Hongrie, Croatie, Serbie, Roumanie, Bulgarie, Moldavie, Ukraine",
        continent: "Europe",
        longueur: "2,860 km"
      },

      // deserts
      {
        type: "Désert",
        image: "assets/images/cards/desert/sahara.jpg",
        nom: "Sahara",
        localisation: "Afrique",
        continent: "Afrique",
        superficie: "9,200,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/arabian-desert.jpg",
        nom: "Désert Arabique",
        localisation: "Asie",
        continent: "Asie",
        superficie: "2,330,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/gobi.jpeg",
        nom: "Désert de Gobi",
        localisation: "Asie",
        continent: "Asie",
        superficie: "1,295,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/kalahari.jpg",
        nom: "Désert de Kalahari",
        localisation: "Afrique",
        continent: "Afrique",
        superficie: "900,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/great-basin.jpg",
        nom: "Grand Bassin",
        localisation: "Amérique",
        continent: "Amérique du Nord",
        superficie: "492,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/sonoran.jpg",
        nom: "Désert de Sonora",
        localisation: "Amérique",
        continent: "Amérique du Nord",
        superficie: "260,000 km²"
      },
      {
        type: "Désert",
        image: "assets/images/cards/desert/atacama.jpg",
        nom: "Désert d'Atacama",
        localisation: "Amérique",
        continent: "Amérique du Sud",
        superficie: "105,000 km²"
      },

      // islands
      {
        type: "Île",
        image: "assets/images/cards/island/bali.jpg",
        nom: "Bali",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "5,780 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/greenland.jpg",
        nom: "Groenland",
        localisation: "Danemark",
        continent: "Europe",
        superficie: "2,166,086 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/java.jpg",
        nom: "Java",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "138,794 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/hawaii.jpg",
        nom: "Hawaï",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        superficie: "16,635 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/sicily.jpg",
        nom: "Sicile",
        localisation: "Italie",
        continent: "Europe",
        superficie: "25,711 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/new-zealand-north.jpg",
        nom: "Île du Nord",
        localisation: "Nouvelle-Zélande",
        continent: "Océanie",
        superficie: "113,729 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/new-zealand-south.jpg",
        nom: "Île du Sud",
        localisation: "Nouvelle-Zélande",
        continent: "Océanie",
        superficie: "150,437 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/borneo.jpeg",
        nom: "Bornéo",
        localisation: "Indonésie, Malaisie et Brunei",
        continent: "Asie",
        superficie: "748,168 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/sumatra.jpg",
        nom: "Sumatra",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "473,481 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/crete.jpg",
        nom: "Crète",
        localisation: "Grèce",
        continent: "Europe",
        superficie: "8,336 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/long-island.jpg",
        nom: "Long Island",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        superficie: "3,629 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/jeju.jpg",
        nom: "Jeju",
        localisation: "Corée du Sud",
        continent: "Asie",
        superficie: "1,846 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/phuket.jpg",
        nom: "Phuket",
        localisation: "Thaïlande",
        continent: "Asie",
        superficie: "543 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/galapagos.jpg",
        nom: "Galápagos",
        localisation: "Équateur",
        continent: "Amérique du Sud",
        superficie: "8,010 km²"
      },
      {
        type: "Île",
        image: "assets/images/cards/island/majorca.jpg",
        nom: "Majorque",
        localisation: "Espagne",
        continent: "Europe",
        superficie: "3,640 km²"
      }
    ];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.shuffleAndFilter();
  }

  clearAllFilters() {
    this.typeFilters.forEach(filter => filter.checked = false);
    this.continentFilters.forEach(filter => filter.checked = false);
    this.shuffleAndFilter();
  }

  shuffleAndFilter() {
    let filtered = [...this.allCards];
    
    // Filtre par recherche textuelle
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchTermLower = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(card => this.matchesSearch(card, searchTermLower));
    }
    
    // Filtre par type
    const selectedTypes = this.typeFilters.filter(f => f.checked).map(f => f.value);
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(card => selectedTypes.includes(card.type));
    }
    
    // Filtre par continent
    const selectedContinents = this.continentFilters.filter(f => f.checked).map(f => f.value);
    if (selectedContinents.length > 0) {
      filtered = filtered.filter(card => {
        // Si la carte a une propriété continent, l'utiliser, sinon vérifier dans localisation
        if (card.continent) {
          return selectedContinents.includes(card.continent);
        } else {
          return selectedContinents.some(continent => 
            card.localisation.includes(continent)
          );
        }
      });
    }
    
    this.shuffledCards = this.shuffleArray(filtered);
    this.loadInitialCards(); // Recharger l'affichage avec les nouvelles cartes filtrées
  }

  private matchesSearch(card: Card, searchTerm: string): boolean {
    // Recherche dans toutes les propriétés textuelles de la carte
    const searchableFields = [
      card.nom,
      card.localisation,
      card.type,
      card.continent,
      card.hauteur,
      card.surface,
      card.population,
      card.superficie,
      card.profondeur,
      card.longueur
    ];
    
    return searchableFields.some(field => 
      field && field.toLowerCase().includes(searchTerm)
    );
  }

  shuffleArray(array: Card[]): Card[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async downloadAllCards() {
    if (this.shuffledCards.length === 0) {
      alert('Aucune carte à télécharger. Veuillez ajuster vos filtres.');
      return;
    }

    this.isLoading = true;
    this.progress = 0;
    const zip = new JSZip();
    const totalCards = this.shuffledCards.length;
    
    try {
      for (const [index, card] of this.shuffledCards.entries()) {
        const cardElement = document.getElementById(`card-${card.nom}`);
        if (!cardElement) {
          console.warn(`Élément de carte non trouvé pour: ${card.nom}`);
          continue;
        }
        
        // Attendre que le DOM soit prêt
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const scale = 1920 / 175; // Échelle pour une haute résolution
        const canvas = await html2canvas(cardElement, {
          scale: scale,
          useCORS: true,
          backgroundColor: null,
          logging: false
        });
        
        const roundedCanvas = this.applyRoundedCorners(canvas, scale);
        const imgData = roundedCanvas.toDataURL("image/png");
        
        // Nettoyer le nom pour éviter les caractères problématiques
        const sanitizedName = card.nom.replace(/[^a-zA-Z0-9\-_]/g, '_');
        zip.file(`${sanitizedName}.png`, imgData.split('base64,')[1], { base64: true });
        
        this.progress = ((index + 1) / totalCards) * 100;
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier basé sur les filtres actifs
      const activeFilters = [
        ...this.typeFilters.filter(f => f.checked).map(f => f.label),
        ...this.continentFilters.filter(f => f.checked).map(f => f.label)
      ];
      const fileName = activeFilters.length > 0 
        ? `cartes_${activeFilters.join('_').replace(/\s+/g, '_')}.zip`
        : 'toutes_les_cartes.zip';
      
      link.download = fileName;
      link.click();
      
      // Nettoyer l'URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors de la génération du zip:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  private applyRoundedCorners(canvas: HTMLCanvasElement, scale: number): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;
    const radius = 12 * scale;

    const roundedCanvas = document.createElement('canvas');
    roundedCanvas.width = width;
    roundedCanvas.height = height;
    const roundedCtx = roundedCanvas.getContext('2d');

    if (!roundedCtx) return canvas;

    roundedCtx.beginPath();
    roundedCtx.moveTo(radius, 0);
    roundedCtx.lineTo(width - radius, 0);
    roundedCtx.quadraticCurveTo(width, 0, width, radius);
    roundedCtx.lineTo(width, height - radius);
    roundedCtx.quadraticCurveTo(width, height, width - radius, height);
    roundedCtx.lineTo(radius, height);
    roundedCtx.quadraticCurveTo(0, height, 0, height - radius);
    roundedCtx.lineTo(0, radius);
    roundedCtx.quadraticCurveTo(0, 0, radius, 0);
    roundedCtx.closePath();
    roundedCtx.clip();
    roundedCtx.drawImage(canvas, 0, 0);

    return roundedCanvas;
  }
}