import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

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
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];
  shuffledCards: Card[] = [];
  filterType: string = '';
  isLoading: boolean = false;
  progress: number = 0;
  Math = Math;
  
  showFilters: boolean = false;
  
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
  }

  loadCards() {
    this.cards = [
      // mountains
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/everest.jpg",
        nom: "Mont Everest",
        localisation: "Népal",
        continent: "Asie",
        hauteur: "8,848 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/k2.jpg",
        nom: "K2",
        localisation: "Pakistan et Chine",
        continent: "Asie",
        hauteur: "8,611 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/denali.jpg",
        nom: "Denali",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        hauteur: "6,190 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/kilimanjaro.jpg",
        nom: "Kilimandjaro",
        localisation: "Tanzanie",
        continent: "Afrique",
        hauteur: "5,895 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/elbrus.jpg",
        nom: "Mont Elbrouz",
        localisation: "Russie",
        continent: "Europe",
        hauteur: "5,642 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/vinson.jpg",
        nom: "Mont Vinson",
        localisation: "Antarctique",
        continent: "Antarctique",
        hauteur: "4,892 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/aconcagua.jpg",
        nom: "Aconcagua",
        localisation: "Argentine",
        continent: "Amérique du Sud",
        hauteur: "6,961 m"
      },

      // lakes
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/baikal.jpg",
        nom: "Lac Baïkal",
        localisation: "Russie",
        continent: "Asie",
        surface: "31,500 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/superior.jpg",
        nom: "Lac Supérieur",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "82,100 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/victoria.jpg",
        nom: "Lac Victoria",
        localisation: "Tanzanie, Ouganda et Kenya",
        continent: "Afrique",
        surface: "68,800 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/huron.jpg",
        nom: "Lac Huron",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "59,600 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/michigan.jpg",
        nom: "Lac Michigan",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        surface: "58,000 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/tanganyika.jpg",
        nom: "Lac Tanganyika",
        localisation: "Burundi, R.D.C, Tanzanie et Zambie",
        continent: "Afrique",
        surface: "32,900 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/titicaca.jpg",
        nom: "Lac Titicaca",
        localisation: "Pérou et Bolivie",
        continent: "Amérique du Sud",
        surface: "8,372 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/malawi.jpg",
        nom: "Lac Malawi",
        localisation: "Malawi, Mozambique et Tanzanie",
        continent: "Afrique",
        surface: "29,600 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/great-slave.jpg",
        nom: "Grand Lac des Esclaves",
        localisation: "Canada",
        continent: "Amérique du Nord",
        surface: "27,200 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/leman.jpg",
        nom: "Lac Léman",
        localisation: "Suisse et France",
        continent: "Europe",
        surface: "580 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/natron.png",
        nom: "Lac Natron",
        localisation: "Tanzanie",
        continent: "Afrique",
        surface: "1,040 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/almaty.jpg",
        nom: "Lac d'Almaty",
        localisation: "Kazakhstan",
        continent: "Asie",
        surface: "1.82 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/erie.jpg",
        nom: "Lac Érié",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "25,700 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/ontario.jpeg",
        nom: "Lac Ontario",
        localisation: "États-Unis et Canada",
        continent: "Amérique du Nord",
        surface: "18,960 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/great-bear.jpg",
        nom: "Grand Lac de l'Ours",
        localisation: "Canada",
        continent: "Amérique du Nord",
        surface: "31,080 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/kariba.jpg",
        nom: "Lac Kariba",
        localisation: "Zimbabwe et Zambie",
        continent: "Afrique",
        surface: "5,580 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/issyk-kul.jpg",
        nom: "Lac Issyk-Koul",
        localisation: "Kirghizistan",
        continent: "Asie",
        surface: "6,236 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/caspian.jpg",
        nom: "Mer Caspienne",
        localisation: "Iran, Russie, Kazakhstan, Turkménistan et Azerbaïdjan",
        continent: "Asie",
        surface: "371,000 km²"
      },

      // cities
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/paris.jpg",
        nom: "Paris",
        localisation: "France",
        continent: "Europe",
        population: "2,161,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/tokyo.jpg",
        nom: "Tokyo",
        localisation: "Japon",
        continent: "Asie",
        population: "13,960,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/new-york.jpg",
        nom: "New York",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        population: "8,336,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/london.jpg",
        nom: "Londres",
        localisation: "Royaume-Uni",
        continent: "Europe",
        population: "8,982,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/sydney.jpeg",
        nom: "Sydney",
        localisation: "Australie",
        continent: "Océanie",
        population: "5,312,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/berlin.jpg",
        nom: "Berlin",
        localisation: "Allemagne",
        continent: "Europe",
        population: "3,748,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/moscow.jpg",
        nom: "Moscou",
        localisation: "Russie",
        continent: "Europe",
        population: "12,506,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/rio.jpg",
        nom: "Rio de Janeiro",
        localisation: "Brésil",
        continent: "Amérique du Sud",
        population: "6,748,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/mumbai.jpg",
        nom: "Mumbai",
        localisation: "Inde",
        continent: "Asie",
        population: "20,411,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/cape-town.jpg",
        nom: "Le Cap",
        localisation: "Afrique du Sud",
        continent: "Afrique",
        population: "4,004,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/beijing.jpg",
        nom: "Pékin",
        localisation: "Chine",
        continent: "Asie",
        population: "21,893,000 M"
      },

      // countries - oceania
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/australia.png",
        nom: "Australie",
        localisation: "Océanie",
        continent: "Océanie",
        population: "25 M",
        superficie: "7,692,024 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/fiji.jpg",
        nom: "Fidji",
        localisation: "Océanie",
        continent: "Océanie",
        population: "896 K",
        superficie: "18,274 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/papua_new_guinea.jpg",
        nom: "Papouasie-Nouvelle-Guinée",
        localisation: "Océanie",
        continent: "Océanie",
        population: "9.12 M",
        superficie: "462,840 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/new_zealand.jpg",
        nom: "Nouvelle-Zélande",
        localisation: "Océanie",
        continent: "Océanie",
        population: "4.9 M",
        superficie: "268,021 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/vanuatu.jpg",
        nom: "Vanuatu",
        localisation: "Océanie",
        continent: "Océanie",
        population: "307 K",
        superficie: "12,189 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/samoa.jpg",
        nom: "Samoa",
        localisation: "Océanie",
        continent: "Océanie",
        population: "202 K",
        superficie: "2,842 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/tonga.jpg",
        nom: "Tonga",
        localisation: "Océanie",
        continent: "Océanie",
        population: "106 K",
        superficie: "747 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/kiribati.jpg",
        nom: "Kiribati",
        localisation: "Océanie",
        continent: "Océanie",
        population: "123 K",
        superficie: "811 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/marshall_islands.jpg",
        nom: "Îles Marshall",
        localisation: "Océanie",
        continent: "Océanie",
        population: "59 K",
        superficie: "181 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/micronesia.jpeg",
        nom: "Micronésie",
        localisation: "Océanie",
        continent: "Océanie",
        population: "116 K",
        superficie: "702 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/palau.jpg",
        nom: "Palaos",
        localisation: "Océanie",
        continent: "Océanie",
        population: "18 K",
        superficie: "459 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/nauru.jpg",
        nom: "Nauru",
        localisation: "Océanie",
        continent: "Océanie",
        population: "12.8 K",
        superficie: "21 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/solomon_islands.jpg",
        nom: "Îles Salomon",
        localisation: "Océanie",
        continent: "Océanie",
        population: "703 K",
        superficie: "28,400 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
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
        emoji: "🤠",
        image: "assets/images/cards/country/albania.jpg",
        nom: "Albanie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.8 M",
        superficie: "28,748 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/germany.jpg",
        nom: "Allemagne",
        localisation: "Europe",
        continent: "Europe",
        population: "83 M",
        superficie: "357,022 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/andorra.jpg",
        nom: "Andorre",
        localisation: "Europe",
        continent: "Europe",
        population: "77 K",
        superficie: "468 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/austria.jpg",
        nom: "Autriche",
        localisation: "Europe",
        continent: "Europe",
        population: "8.9 M",
        superficie: "83,879 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/belarus.jpg",
        nom: "Biélorussie",
        localisation: "Europe",
        continent: "Europe",
        population: "9.4 M",
        superficie: "207,600 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/belgium.jpg",
        nom: "Belgique",
        localisation: "Europe",
        continent: "Europe",
        population: "11.5 M",
        superficie: "30,689 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bosnia.jpg",
        nom: "Bosnie-Herzégovine",
        localisation: "Europe",
        continent: "Europe",
        population: "3.3 M",
        superficie: "51,197 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bulgaria.jpg",
        nom: "Bulgarie",
        localisation: "Europe",
        continent: "Europe",
        population: "7 M",
        superficie: "110,879 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/croatia.jpg",
        nom: "Croatie",
        localisation: "Europe",
        continent: "Europe",
        population: "4.1 M",
        superficie: "56,594 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/cyprus.jpg",
        nom: "Chypre",
        localisation: "Europe",
        continent: "Europe",
        population: "1.2 M",
        superficie: "9,251 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/czech-republic.jpg",
        nom: "République Tchèque",
        localisation: "Europe",
        continent: "Europe",
        population: "10.7 M",
        superficie: "78,867 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/denmark.jpeg",
        nom: "Danemark",
        localisation: "Europe",
        continent: "Europe",
        population: "5.8 M",
        superficie: "42,933 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/estonia.jpg",
        nom: "Estonie",
        localisation: "Europe",
        continent: "Europe",
        population: "1.3 M",
        superficie: "45,227 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/finland.jpg",
        nom: "Finlande",
        localisation: "Europe",
        continent: "Europe",
        population: "5.5 M",
        superficie: "338,424 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/france.jpg",
        nom: "France",
        localisation: "Europe",
        continent: "Europe",
        population: "67 M",
        superficie: "643,801 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/georgia.jpg",
        nom: "Géorgie",
        localisation: "Europe et Asie",
        continent: "Europe",
        population: "3.7 M",
        superficie: "69,700 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/greece.jpg",
        nom: "Grèce",
        localisation: "Europe",
        continent: "Europe",
        population: "10.4 M",
        superficie: "131,957 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/hungary.jpg",
        nom: "Hongrie",
        localisation: "Europe",
        continent: "Europe",
        population: "9.6 M",
        superficie: "93,028 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/iceland.jpg",
        nom: "Islande",
        localisation: "Europe",
        continent: "Europe",
        population: "364 K",
        superficie: "103,000 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ireland.jpg",
        nom: "Irlande",
        localisation: "Europe",
        continent: "Europe",
        population: "4.9 M",
        superficie: "70,273 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/italy.jpg",
        nom: "Italie",
        localisation: "Europe",
        continent: "Europe",
        population: "60.4 M",
        superficie: "301,340 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/latvia.jpg",
        nom: "Lettonie",
        localisation: "Europe",
        continent: "Europe",
        population: "1.9 M",
        superficie: "64,589 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/lithuania.jpg",
        nom: "Lituanie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.8 M",
        superficie: "65,300 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/luxembourg.jpg",
        nom: "Luxembourg",
        localisation: "Europe",
        continent: "Europe",
        population: "626 K",
        superficie: "2,586 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/malta.jpeg",
        nom: "Malte",
        localisation: "Europe",
        continent: "Europe",
        population: "514 K",
        superficie: "316 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/moldova.jpg",
        nom: "Moldavie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.6 M",
        superficie: "33,846 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/montenegro.jpeg",
        nom: "Monténégro",
        localisation: "Europe",
        continent: "Europe",
        population: "622 K",
        superficie: "13,812 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/netherlands.jpg",
        nom: "Pays-Bas",
        localisation: "Europe",
        continent: "Europe",
        population: "17.3 M",
        superficie: "41,543 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/norway.jpg",
        nom: "Norvège",
        localisation: "Europe",
        continent: "Europe",
        population: "5.4 M",
        superficie: "385,207 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/poland.jpg",
        nom: "Pologne",
        localisation: "Europe",
        continent: "Europe",
        population: "38 M",
        superficie: "312,696 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/portugal.jpg",
        nom: "Portugal",
        localisation: "Europe",
        continent: "Europe",
        population: "10.3 M",
        superficie: "92,090 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/romania.jpg",
        nom: "Roumanie",
        localisation: "Europe",
        continent: "Europe",
        population: "19.3 M",
        superficie: "238,397 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/russia.jpg",
        nom: "Russie",
        localisation: "Europe et Asie",
        continent: "Europe",
        population: "146 M",
        superficie: "17,098,242 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/san-marino.jpg",
        nom: "Saint-Marin",
        localisation: "Europe",
        continent: "Europe",
        population: "34 K",
        superficie: "61 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/serbia.jpg",
        nom: "Serbie",
        localisation: "Europe",
        continent: "Europe",
        population: "7 M",
        superficie: "88,361 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/slovakia.jpg",
        nom: "Slovaquie",
        localisation: "Europe",
        continent: "Europe",
        population: "5.4 M",
        superficie: "49,035 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/slovenia.jpg",
        nom: "Slovénie",
        localisation: "Europe",
        continent: "Europe",
        population: "2.1 M",
        superficie: "20,273 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/spain.jpg",
        nom: "Espagne",
        localisation: "Europe",
        continent: "Europe",
        population: "47 M",
        superficie: "505,990 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/sweden.jpg",
        nom: "Suède",
        localisation: "Europe",
        continent: "Europe",
        population: "10.3 M",
        superficie: "450,295 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/switzerland.jpeg",
        nom: "Suisse",
        localisation: "Europe",
        continent: "Europe",
        population: "8.6 M",
        superficie: "41,290 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ukraine.jpg",
        nom: "Ukraine",
        localisation: "Europe",
        continent: "Europe",
        population: "41 M",
        superficie: "603,500 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/united-kingdom.jpg",
        nom: "Royaume-Uni",
        localisation: "Europe",
        continent: "Europe",
        population: "67 M",
        superficie: "242,495 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
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
        emoji: "🤠",
        image: "assets/images/cards/country/argentina.jpeg",
        nom: "Argentine",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "45 M",
        superficie: "2,780,400 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/brazil.jpg",
        nom: "Brésil",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "213 M",
        superficie: "8,515,767 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/chile.jpg",
        nom: "Chili",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "19 M",
        superficie: "756,102 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/colombia.jpg",
        nom: "Colombie",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "51 M",
        superficie: "1,141,748 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ecuador.jpg",
        nom: "Équateur",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "17.4 M",
        superficie: "283,561 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/peru.jpg",
        nom: "Pérou",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "33 M",
        superficie: "1,285,216 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/venezuela.jpg",
        nom: "Venezuela",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "28 M",
        superficie: "916,445 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/uruguay.jpg",
        nom: "Uruguay",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "3.5 M",
        superficie: "176,215 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/paraguay.jpg",
        nom: "Paraguay",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "7.1 M",
        superficie: "406,752 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bolivia.jpg",
        nom: "Bolivie",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "11.6 M",
        superficie: "1,098,581 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/suriname.jpg",
        nom: "Suriname",
        localisation: "Amérique du Sud",
        continent: "Amérique du Sud",
        population: "0.6 M",
        superficie: "163,821 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
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
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Canada",
        localisation: "Amérique du Nord",
        continent: "Amérique du Nord",
        population: "38.2 M",
        superficie: "9,984,670 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "États-Unis",
        localisation: "Amérique du Nord",
        continent: "Amérique du Nord",
        population: "331.9 M",
        superficie: "9,833,520 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
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
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Guatemala",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "17.3 M",
        superficie: "108,889 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Belize",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.4 M",
        superficie: "22,966 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Honduras",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "10.1 M",
        superficie: "112,492 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Salvador",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "6.5 M",
        superficie: "21,041 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Nicaragua",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "6.8 M",
        superficie: "130,373 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Costa Rica",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "5.2 M",
        superficie: "51,100 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
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
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Cuba",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.3 M",
        superficie: "109,884 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Haïti",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.5 M",
        superficie: "27,750 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "République Dominicaine",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "11.0 M",
        superficie: "48,671 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Jamaïque",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "2.8 M",
        superficie: "10,991 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Porto Rico",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "3.2 M",
        superficie: "9,104 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Trinité-et-Tobago",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "1.4 M",
        superficie: "5,131 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Barbade",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.3 M",
        superficie: "439 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Bahamas",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.4 M",
        superficie: "13,943 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Sainte-Lucie",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.2 M",
        superficie: "617 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Grenade",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "344 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Antigua-et-Barbuda",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "443 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Dominique",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.07 M",
        superficie: "751 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Saint-Christophe-et-Niévès",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.05 M",
        superficie: "261 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/default.jpg",
        nom: "Saint-Vincent-et-les-Grenadines",
        localisation: "Amérique centrale",
        continent: "Amérique centrale",
        population: "0.1 M",
        superficie: "389 km²"
      },

      // seas
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/mediterranean.jpg",
        nom: "Mer Méditerranée",
        localisation: "Europe, Afrique et Asie",
        continent: "Europe",
        profondeur: "5,267 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/caribbean.jpeg",
        nom: "Mer des Caraïbes",
        localisation: "Amérique",
        continent: "Amérique centrale",
        profondeur: "7,686 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/baltic.jpg",
        nom: "Mer Baltique",
        localisation: "Europe",
        continent: "Europe",
        profondeur: "459 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/arabian.jpg",
        nom: "Mer d'Arabie",
        localisation: "Asie",
        continent: "Asie",
        profondeur: "4,652 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/bering.jpeg",
        nom: "Mer de Béring",
        localisation: "Amérique et Asie",
        continent: "Asie",
        profondeur: "4,097 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/south-china.jpg",
        nom: "Mer de Chine Méridionale",
        localisation: "Asie",
        continent: "Asie",
        profondeur: "5,016 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/black.jpg",
        nom: "Mer Noire",
        localisation: "Europe et Asie",
        continent: "Europe",
        profondeur: "2,212 m"
      },

      // oceans
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/pacific.jpg",
        nom: "Océan Pacifique",
        localisation: "Amérique, Asie et Océanie",
        continent: "Océanie",
        profondeur: "10,911 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/atlantic.jpg",
        nom: "Océan Atlantique",
        localisation: "Amérique, Europe et Afrique",
        continent: "Europe",
        profondeur: "8,486 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/southern.jpg",
        nom: "Océan Austral",
        localisation: "Antarctique",
        continent: "Antarctique",
        profondeur: "7,236 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/indian.jpg",
        nom: "Océan Indien",
        localisation: "Asie, Afrique et Australie",
        continent: "Asie",
        profondeur: "7,258 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/arctic.jpg",
        nom: "Océan Arctique",
        localisation: "Arctique",
        continent: "Amérique du Nord",
        profondeur: "5,450 m"
      },

      // rivers
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/nil.jpg",
        nom: "Nil",
        localisation: "Égypte, Soudan et Soudan du sud",
        continent: "Afrique",
        longueur: "6,650 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/amazon.jpg",
        nom: "Amazone",
        localisation: "Brésil, Pérou, Colombie",
        continent: "Amérique du Sud",
        longueur: "7,062 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/yangtze.jpg",
        nom: "Yangtsé",
        localisation: "Chine",
        continent: "Asie",
        longueur: "6,300 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/mississippi.png",
        nom: "Mississippi",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        longueur: "3,734 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/yenisei.jpg",
        nom: "Ienisseï",
        localisation: "Russie",
        continent: "Asie",
        longueur: "5,539 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/congo.jpg",
        nom: "Congo",
        localisation: "République démocratique du Congo",
        continent: "Afrique",
        longueur: "4,700 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/volga.jpg",
        nom: "Volga",
        localisation: "Russie",
        continent: "Europe",
        longueur: "3,530 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/mekong.jpg",
        nom: "Mékong",
        localisation: "Chine, Myanmar, Laos, Thaïlande, Cambodge, Vietnam",
        continent: "Asie",
        longueur: "4,350 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/ganges.jpg",
        nom: "Gange",
        localisation: "Inde et Bangladesh",
        continent: "Asie",
        longueur: "2,525 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/danube.jpg",
        nom: "Danube",
        localisation: "Allemagne, Autriche, Slovaquie, Hongrie, Croatie, Serbie, Roumanie, Bulgarie, Moldavie, Ukraine",
        continent: "Europe",
        longueur: "2,860 km"
      },

      // deserts
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/sahara.jpg",
        nom: "Sahara",
        localisation: "Afrique",
        continent: "Afrique",
        superficie: "9,200,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/arabian-desert.jpg",
        nom: "Désert Arabique",
        localisation: "Asie",
        continent: "Asie",
        superficie: "2,330,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/gobi.jpeg",
        nom: "Désert de Gobi",
        localisation: "Asie",
        continent: "Asie",
        superficie: "1,295,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/kalahari.jpg",
        nom: "Désert de Kalahari",
        localisation: "Afrique",
        continent: "Afrique",
        superficie: "900,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/great-basin.jpg",
        nom: "Grand Bassin",
        localisation: "Amérique",
        continent: "Amérique du Nord",
        superficie: "492,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/sonoran.jpg",
        nom: "Désert de Sonora",
        localisation: "Amérique",
        continent: "Amérique du Nord",
        superficie: "260,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/atacama.jpg",
        nom: "Désert d'Atacama",
        localisation: "Amérique",
        continent: "Amérique du Sud",
        superficie: "105,000 km²"
      },

      // islands
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/bali.jpg",
        nom: "Bali",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "5,780 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/greenland.jpg",
        nom: "Groenland",
        localisation: "Danemark",
        continent: "Europe",
        superficie: "2,166,086 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/java.jpg",
        nom: "Java",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "138,794 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/hawaii.jpg",
        nom: "Hawaï",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        superficie: "16,635 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/sicily.jpg",
        nom: "Sicile",
        localisation: "Italie",
        continent: "Europe",
        superficie: "25,711 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/new-zealand-north.jpg",
        nom: "Île du Nord",
        localisation: "Nouvelle-Zélande",
        continent: "Océanie",
        superficie: "113,729 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/new-zealand-south.jpg",
        nom: "Île du Sud",
        localisation: "Nouvelle-Zélande",
        continent: "Océanie",
        superficie: "150,437 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/borneo.jpeg",
        nom: "Bornéo",
        localisation: "Indonésie, Malaisie et Brunei",
        continent: "Asie",
        superficie: "748,168 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/sumatra.jpg",
        nom: "Sumatra",
        localisation: "Indonésie",
        continent: "Asie",
        superficie: "473,481 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/crete.jpg",
        nom: "Crète",
        localisation: "Grèce",
        continent: "Europe",
        superficie: "8,336 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/long-island.jpg",
        nom: "Long Island",
        localisation: "États-Unis",
        continent: "Amérique du Nord",
        superficie: "3,629 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/jeju.jpg",
        nom: "Jeju",
        localisation: "Corée du Sud",
        continent: "Asie",
        superficie: "1,846 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/phuket.jpg",
        nom: "Phuket",
        localisation: "Thaïlande",
        continent: "Asie",
        superficie: "543 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/galapagos.jpg",
        nom: "Galápagos",
        localisation: "Équateur",
        continent: "Amérique du Sud",
        superficie: "8,010 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
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
    let filtered = [...this.cards];
    
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