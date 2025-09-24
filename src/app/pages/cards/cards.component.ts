import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';

interface Card {
  type: string;
  emoji: string;
  image: string;
  nom: string;
  localisation: string;
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
        hauteur: "8,848 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/k2.jpg",
        nom: "K2",
        localisation: "Pakistan et Chine",
        hauteur: "8,611 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/denali.jpg",
        nom: "Denali",
        localisation: "États-Unis",
        hauteur: "6,190 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/kilimanjaro.jpg",
        nom: "Kilimandjaro",
        localisation: "Tanzanie",
        hauteur: "5,895 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/elbrus.jpg",
        nom: "Mont Elbrouz",
        localisation: "Russie",
        hauteur: "5,642 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/vinson.jpg",
        nom: "Mont Vinson",
        localisation: "Antarctique",
        hauteur: "4,892 m"
      },
      {
        type: "Sommet",
        emoji: "🏔️",
        image: "assets/images/cards/mountain/aconcagua.jpg",
        nom: "Aconcagua",
        localisation: "Argentine",
        hauteur: "6,961 m"
      },

      // lakes
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/baikal.jpg",
        nom: "Lac Baïkal",
        localisation: "Russie",
        surface: "31,500 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/superior.jpg",
        nom: "Lac Supérieur",
        localisation: "États-Unis et Canada",
        surface: "82,100 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/victoria.jpg",
        nom: "Lac Victoria",
        localisation: "Tanzanie, Ouganda et Kenya",
        surface: "68,800 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/huron.jpg",
        nom: "Lac Huron",
        localisation: "États-Unis et Canada",
        surface: "59,600 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/michigan.jpg",
        nom: "Lac Michigan",
        localisation: "États-Unis",
        surface: "58,000 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/tanganyika.jpg",
        nom: "Lac Tanganyika",
        localisation: "Burundi, R.D.C, Tanzanie et Zambie",
        surface: "32,900 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/titicaca.jpg",
        nom: "Lac Titicaca",
        localisation: "Pérou et Bolivie",
        surface: "8,372 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/malawi.jpg",
        nom: "Lac Malawi",
        localisation: "Malawi, Mozambique et Tanzanie",
        surface: "29,600 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/great-slave.jpg",
        nom: "Grand Lac des Esclaves",
        localisation: "Canada",
        surface: "27,200 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/leman.jpg",
        nom: "Lac Léman",
        localisation: "Suisse et France",
        surface: "580 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/natron.png",
        nom: "Lac Natron",
        localisation: "Tanzanie",
        surface: "1,040 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/almaty.jpg",
        nom: "Lac d'Almaty",
        localisation: "Kazakhstan",
        surface: "1.82 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/erie.jpg",
        nom: "Lac Érié",
        localisation: "États-Unis et Canada",
        surface: "25,700 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/ontario.jpeg",
        nom: "Lac Ontario",
        localisation: "États-Unis et Canada",
        surface: "18,960 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/great-bear.jpg",
        nom: "Grand Lac de l'Ours",
        localisation: "Canada",
        surface: "31,080 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/kariba.jpg",
        nom: "Lac Kariba",
        localisation: "Zimbabwe et Zambie",
        surface: "5,580 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/issyk-kul.jpg",
        nom: "Lac Issyk-Koul",
        localisation: "Kirghizistan",
        surface: "6,236 km²"
      },
      {
        type: "Lac",
        emoji: "🐟",
        image: "assets/images/cards/lake/caspian.jpg",
        nom: "Mer Caspienne",
        localisation: "Iran, Russie, Kazakhstan, Turkménistan et Azerbaïdjan",
        surface: "371,000 km²"
      },

      // cities
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/paris.jpg",
        nom: "Paris",
        localisation: "France",
        population: "2,161,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/tokyo.jpg",
        nom: "Tokyo",
        localisation: "Japon",
        population: "13,960,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/new-york.jpg",
        nom: "New York",
        localisation: "États-Unis",
        population: "8,336,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/london.jpg",
        nom: "Londres",
        localisation: "Royaume-Uni",
        population: "8,982,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/sydney.jpeg",
        nom: "Sydney",
        localisation: "Australie",
        population: "5,312,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/berlin.jpg",
        nom: "Berlin",
        localisation: "Allemagne",
        population: "3,748,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/moscow.jpg",
        nom: "Moscou",
        localisation: "Russie",
        population: "12,506,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/rio.jpg",
        nom: "Rio de Janeiro",
        localisation: "Brésil",
        population: "6,748,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/mumbai.jpg",
        nom: "Mumbai",
        localisation: "Inde",
        population: "20,411,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/cape-town.jpg",
        nom: "Le Cap",
        localisation: "Afrique du Sud",
        population: "4,004,000 M"
      },
      {
        type: "Ville",
        emoji: "🏘️",
        image: "assets/images/cards/city/beijing.jpg",
        nom: "Pékin",
        localisation: "Chine",
        population: "21,893,000 M"
      },

      // countries - oceania
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/australia.png",
        nom: "Australie",
        localisation: "Océanie",
        population: "25 M",
        superficie: "7,692,024 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/fiji.jpg",
        nom: "Fidji",
        localisation: "Océanie",
        population: "896 K",
        superficie: "18,274 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/papua_new_guinea.jpg",
        nom: "Papouasie-Nouvelle-Guinée",
        localisation: "Océanie",
        population: "9.12 M",
        superficie: "462,840 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/new_zealand.jpg",
        nom: "Nouvelle-Zélande",
        localisation: "Océanie",
        population: "4.9 M",
        superficie: "268,021 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/vanuatu.jpg",
        nom: "Vanuatu",
        localisation: "Océanie",
        population: "307 K",
        superficie: "12,189 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/samoa.jpg",
        nom: "Samoa",
        localisation: "Océanie",
        population: "202 K",
        superficie: "2,842 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/tonga.jpg",
        nom: "Tonga",
        localisation: "Océanie",
        population: "106 K",
        superficie: "747 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/kiribati.jpg",
        nom: "Kiribati",
        localisation: "Océanie",
        population: "123 K",
        superficie: "811 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/marshall_islands.jpg",
        nom: "Îles Marshall",
        localisation: "Océanie",
        population: "59 K",
        superficie: "181 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/micronesia.jpeg",
        nom: "Micronésie",
        localisation: "Océanie",
        population: "116 K",
        superficie: "702 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/palau.jpg",
        nom: "Palaos",
        localisation: "Océanie",
        population: "18 K",
        superficie: "459 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/nauru.jpg",
        nom: "Nauru",
        localisation: "Océanie",
        population: "12.8 K",
        superficie: "21 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/solomon_islands.jpg",
        nom: "Îles Salomon",
        localisation: "Océanie",
        population: "703 K",
        superficie: "28,400 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/tuvalu.jpg",
        nom: "Tuvalu",
        localisation: "Océanie",
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
        population: "2.8 M",
        superficie: "28,748 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/germany.jpg",
        nom: "Allemagne",
        localisation: "Europe",
        population: "83 M",
        superficie: "357,022 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/andorra.jpg",
        nom: "Andorre",
        localisation: "Europe",
        population: "77 K",
        superficie: "468 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/austria.jpg",
        nom: "Autriche",
        localisation: "Europe",
        population: "8.9 M",
        superficie: "83,879 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/belarus.jpg",
        nom: "Biélorussie",
        localisation: "Europe",
        population: "9.4 M",
        superficie: "207,600 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/belgium.jpg",
        nom: "Belgique",
        localisation: "Europe",
        population: "11.5 M",
        superficie: "30,689 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bosnia.jpg",
        nom: "Bosnie-Herzégovine",
        localisation: "Europe",
        population: "3.3 M",
        superficie: "51,197 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bulgaria.jpg",
        nom: "Bulgarie",
        localisation: "Europe",
        population: "7 M",
        superficie: "110,879 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/croatia.jpg",
        nom: "Croatie",
        localisation: "Europe",
        population: "4.1 M",
        superficie: "56,594 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/cyprus.jpg",
        nom: "Chypre",
        localisation: "Europe",
        population: "1.2 M",
        superficie: "9,251 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/czech-republic.jpg",
        nom: "République Tchèque",
        localisation: "Europe",
        population: "10.7 M",
        superficie: "78,867 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/denmark.jpeg",
        nom: "Danemark",
        localisation: "Europe",
        population: "5.8 M",
        superficie: "42,933 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/estonia.jpg",
        nom: "Estonie",
        localisation: "Europe",
        population: "1.3 M",
        superficie: "45,227 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/finland.jpg",
        nom: "Finlande",
        localisation: "Europe",
        population: "5.5 M",
        superficie: "338,424 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/france.jpg",
        nom: "France",
        localisation: "Europe",
        population: "67 M",
        superficie: "643,801 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/georgia.jpg",
        nom: "Géorgie",
        localisation: "Europe et Asie",
        population: "3.7 M",
        superficie: "69,700 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/greece.jpg",
        nom: "Grèce",
        localisation: "Europe",
        population: "10.4 M",
        superficie: "131,957 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/hungary.jpg",
        nom: "Hongrie",
        localisation: "Europe",
        population: "9.6 M",
        superficie: "93,028 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/iceland.jpg",
        nom: "Islande",
        localisation: "Europe",
        population: "364 K",
        superficie: "103,000 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ireland.jpg",
        nom: "Irlande",
        localisation: "Europe",
        population: "4.9 M",
        superficie: "70,273 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/italy.jpg",
        nom: "Italie",
        localisation: "Europe",
        population: "60.4 M",
        superficie: "301,340 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/latvia.jpg",
        nom: "Lettonie",
        localisation: "Europe",
        population: "1.9 M",
        superficie: "64,589 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/lithuania.jpg",
        nom: "Lituanie",
        localisation: "Europe",
        population: "2.8 M",
        superficie: "65,300 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/luxembourg.jpg",
        nom: "Luxembourg",
        localisation: "Europe",
        population: "626 K",
        superficie: "2,586 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/malta.jpeg",
        nom: "Malte",
        localisation: "Europe",
        population: "514 K",
        superficie: "316 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/moldova.jpg",
        nom: "Moldavie",
        localisation: "Europe",
        population: "2.6 M",
        superficie: "33,846 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/montenegro.jpeg",
        nom: "Monténégro",
        localisation: "Europe",
        population: "622 K",
        superficie: "13,812 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/netherlands.jpg",
        nom: "Pays-Bas",
        localisation: "Europe",
        population: "17.3 M",
        superficie: "41,543 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/norway.jpg",
        nom: "Norvège",
        localisation: "Europe",
        population: "5.4 M",
        superficie: "385,207 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/poland.jpg",
        nom: "Pologne",
        localisation: "Europe",
        population: "38 M",
        superficie: "312,696 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/portugal.jpg",
        nom: "Portugal",
        localisation: "Europe",
        population: "10.3 M",
        superficie: "92,090 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/romania.jpg",
        nom: "Roumanie",
        localisation: "Europe",
        population: "19.3 M",
        superficie: "238,397 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/russia.jpg",
        nom: "Russie",
        localisation: "Europe et Asie",
        population: "146 M",
        superficie: "17,098,242 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/san-marino.jpg",
        nom: "Saint-Marin",
        localisation: "Europe",
        population: "34 K",
        superficie: "61 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/serbia.jpg",
        nom: "Serbie",
        localisation: "Europe",
        population: "7 M",
        superficie: "88,361 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/slovakia.jpg",
        nom: "Slovaquie",
        localisation: "Europe",
        population: "5.4 M",
        superficie: "49,035 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/slovenia.jpg",
        nom: "Slovénie",
        localisation: "Europe",
        population: "2.1 M",
        superficie: "20,273 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/spain.jpg",
        nom: "Espagne",
        localisation: "Europe",
        population: "47 M",
        superficie: "505,990 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/sweden.jpg",
        nom: "Suède",
        localisation: "Europe",
        population: "10.3 M",
        superficie: "450,295 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/switzerland.jpeg",
        nom: "Suisse",
        localisation: "Europe",
        population: "8.6 M",
        superficie: "41,290 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ukraine.jpg",
        nom: "Ukraine",
        localisation: "Europe",
        population: "41 M",
        superficie: "603,500 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/united-kingdom.jpg",
        nom: "Royaume-Uni",
        localisation: "Europe",
        population: "67 M",
        superficie: "242,495 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/macedonia.jpeg",
        nom: "Macédoine du Nord",
        localisation: "Europe",
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
        population: "45 M",
        superficie: "2,780,400 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/brazil.jpg",
        nom: "Brésil",
        localisation: "Amérique du Sud",
        population: "213 M",
        superficie: "8,515,767 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/chile.jpg",
        nom: "Chili",
        localisation: "Amérique du Sud",
        population: "19 M",
        superficie: "756,102 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/colombia.jpg",
        nom: "Colombie",
        localisation: "Amérique du Sud",
        population: "51 M",
        superficie: "1,141,748 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/ecuador.jpg",
        nom: "Équateur",
        localisation: "Amérique du Sud",
        population: "17.4 M",
        superficie: "283,561 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/peru.jpg",
        nom: "Pérou",
        localisation: "Amérique du Sud",
        population: "33 M",
        superficie: "1,285,216 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/venezuela.jpg",
        nom: "Venezuela",
        localisation: "Amérique du Sud",
        population: "28 M",
        superficie: "916,445 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/uruguay.jpg",
        nom: "Uruguay",
        localisation: "Amérique du Sud",
        population: "3.5 M",
        superficie: "176,215 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/paraguay.jpg",
        nom: "Paraguay",
        localisation: "Amérique du Sud",
        population: "7.1 M",
        superficie: "406,752 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/bolivia.jpg",
        nom: "Bolivie",
        localisation: "Amérique du Sud",
        population: "11.6 M",
        superficie: "1,098,581 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/suriname.jpg",
        nom: "Suriname",
        localisation: "Amérique du Sud",
        population: "0.6 M",
        superficie: "163,821 km²"
      },
      {
        type: "Pays",
        emoji: "🤠",
        image: "assets/images/cards/country/guyana.jpg",
        nom: "Guyana",
        localisation: "Amérique du Sud",
        population: "0.8 M",
        superficie: "214,969 km²"
      },

      // seas
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/mediterranean.jpg",
        nom: "Mer Méditerranée",
        localisation: "Europe, Afrique et Asie",
        profondeur: "5,267 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/caribbean.jpeg",
        nom: "Mer des Caraïbes",
        localisation: "Amérique",
        profondeur: "7,686 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/baltic.jpg",
        nom: "Mer Baltique",
        localisation: "Europe",
        profondeur: "459 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/arabian.jpg",
        nom: "Mer d'Arabie",
        localisation: "Asie",
        profondeur: "4,652 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/bering.jpeg",
        nom: "Mer de Béring",
        localisation: "Amérique et Asie",
        profondeur: "4,097 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/south-china.jpg",
        nom: "Mer de Chine Méridionale",
        localisation: "Asie",
        profondeur: "5,016 m"
      },
      {
        type: "Mer",
        emoji: "🌊",
        image: "assets/images/cards/sea/black.jpg",
        nom: "Mer Noire",
        localisation: "Europe et Asie",
        profondeur: "2,212 m"
      },

      // oceans
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/pacific.jpg",
        nom: "Océan Pacifique",
        localisation: "Amérique, Asie et Océanie",
        profondeur: "10,911 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/atlantic.jpg",
        nom: "Océan Atlantique",
        localisation: "Amérique, Europe et Afrique",
        profondeur: "8,486 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/southern.jpg",
        nom: "Océan Austral",
        localisation: "Antarctique",
        profondeur: "7,236 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/indian.jpg",
        nom: "Océan Indien",
        localisation: "Asie, Afrique et Australie",
        profondeur: "7,258 m"
      },
      {
        type: "Océan",
        emoji: "🌀",
        image: "assets/images/cards/ocean/arctic.jpg",
        nom: "Océan Arctique",
        localisation: "Arctique",
        profondeur: "5,450 m"
      },

      // rivers
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/nil.jpg",
        nom: "Nil",
        localisation: "Égypte, Soudan et Soudan du sud",
        longueur: "6,650 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/amazon.jpg",
        nom: "Amazone",
        localisation: "Brésil, Pérou, Colombie",
        longueur: "7,062 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/yangtze.jpg",
        nom: "Yangtsé",
        localisation: "Chine",
        longueur: "6,300 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/mississippi.png",
        nom: "Mississippi",
        localisation: "États-Unis",
        longueur: "3,734 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/yenisei.jpg",
        nom: "Ienisseï",
        localisation: "Russie",
        longueur: "5,539 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/congo.jpg",
        nom: "Congo",
        localisation: "République démocratique du Congo",
        longueur: "4,700 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/volga.jpg",
        nom: "Volga",
        localisation: "Russie",
        longueur: "3,530 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/mekong.jpg",
        nom: "Mékong",
        localisation: "Chine, Myanmar, Laos, Thaïlande, Cambodge, Vietnam",
        longueur: "4,350 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/ganges.jpg",
        nom: "Gange",
        localisation: "Inde et Bangladesh",
        longueur: "2,525 km"
      },
      {
        type: "Fleuve",
        emoji: "💦",
        image: "assets/images/cards/river/danube.jpg",
        nom: "Danube",
        localisation: "Allemagne, Autriche, Slovaquie, Hongrie, Croatie, Serbie, Roumanie, Bulgarie, Moldavie, Ukraine",
        longueur: "2,860 km"
      },

      // deserts
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/sahara.jpg",
        nom: "Sahara",
        localisation: "Afrique",
        superficie: "9,200,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/arabian-desert.jpg",
        nom: "Désert Arabique",
        localisation: "Asie",
        superficie: "2,330,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/gobi.jpeg",
        nom: "Désert de Gobi",
        localisation: "Asie",
        superficie: "1,295,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/kalahari.jpg",
        nom: "Désert de Kalahari",
        localisation: "Afrique",
        superficie: "900,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/great-basin.jpg",
        nom: "Grand Bassin",
        localisation: "Amérique",
        superficie: "492,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/sonoran.jpg",
        nom: "Désert de Sonora",
        localisation: "Amérique",
        superficie: "260,000 km²"
      },
      {
        type: "Désert",
        emoji: "🌵",
        image: "assets/images/cards/desert/atacama.jpg",
        nom: "Désert d'Atacama",
        localisation: "Amérique",
        superficie: "105,000 km²"
      },

      // islands
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/bali.jpg",
        nom: "Bali",
        localisation: "Indonésie",
        superficie: "5,780 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/greenland.jpg",
        nom: "Groenland",
        localisation: "Danemark",
        superficie: "2,166,086 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/java.jpg",
        nom: "Java",
        localisation: "Indonésie",
        superficie: "138,794 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/hawaii.jpg",
        nom: "Hawaï",
        localisation: "États-Unis",
        superficie: "16,635 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/sicily.jpg",
        nom: "Sicile",
        localisation: "Italie",
        superficie: "25,711 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/new-zealand-north.jpg",
        nom: "Île du Nord",
        localisation: "Nouvelle-Zélande",
        superficie: "113,729 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/new-zealand-south.jpg",
        nom: "Île du Sud",
        localisation: "Nouvelle-Zélande",
        superficie: "150,437 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/borneo.jpeg",
        nom: "Bornéo",
        localisation: "Indonésie, Malaisie et Brunei",
        superficie: "748,168 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/sumatra.jpg",
        nom: "Sumatra",
        localisation: "Indonésie",
        superficie: "473,481 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/crete.jpg",
        nom: "Crète",
        localisation: "Grèce",
        superficie: "8,336 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/long-island.jpg",
        nom: "Long Island",
        localisation: "États-Unis",
        superficie: "3,629 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/jeju.jpg",
        nom: "Jeju",
        localisation: "Corée du Sud",
        superficie: "1,846 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/phuket.jpg",
        nom: "Phuket",
        localisation: "Thaïlande",
        superficie: "543 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/galapagos.jpg",
        nom: "Galápagos",
        localisation: "Équateur",
        superficie: "8,010 km²"
      },
      {
        type: "Île",
        emoji: "🌴",
        image: "assets/images/cards/island/majorca.jpg",
        nom: "Majorque",
        localisation: "Espagne",
        superficie: "3,640 km²"
      }
    ];
  }

  handleFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterType = target.value;
    this.shuffleAndFilter();
  }

  shuffleAndFilter() {
    const filtered = this.filterType ? 
      this.cards.filter(card => card.type === this.filterType) : 
      this.cards;
    this.shuffledCards = this.shuffleArray([...filtered]);
  }

  shuffleArray(array: Card[]): Card[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async downloadAllCards() {
    this.isLoading = true;
    this.progress = 0;
    
    alert('La fonctionnalité de téléchargement sera implémentée prochainement');
    
    this.isLoading = false;
  }
}