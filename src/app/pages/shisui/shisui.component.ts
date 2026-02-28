// shisui.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour ngModel
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ActivatedRoute, Router } from '@angular/router';

interface Entry {
  date: string;
  day: string;
  cn: string;
  cityNight: string;
  peopleNight: string[];
  c1: string;
  city1: string;
  people1: string[];
  c2: string;
  city2: string;
  people2: string[];
  c3: string;
  city3: string;
  people3: string[];
}

interface DateSearchResult {
  date: string;
  countries: string[];
  cities: string[];
  people: string[];
  nightCity?: string;
  nightPeople?: string[];
  found: boolean;
  allYearsResults?: DateSearchResultByYear[];
}

interface DateSearchResultByYear {
  year: string;
  date: string;
  countries: string[];
  cities: string[];
  people: string[];
  nightCity: string;
  nightPeople: string[];
  found: boolean;
}

interface PersonSearchResult {
  person: string;
  dates: PersonDateEntry[];
  nights: PersonNightEntry[];
  found: boolean;
}

interface PersonDateEntry {
  date: string;
  countries: string[];
  year: string;
}

interface PersonNightEntry {
  date: string;
  country: string;
  city: string;
  year: string;
}

interface CitySearchResult {
  city: string;
  dates: CityDateEntry[];
  nights: CityNightEntry[];
  found: boolean;
}

interface CityDateEntry {
  date: string;
  countries: string[];
  people: string[];
  year: string;
  column: string; // c1, c2, ou c3
}

interface CityNightEntry {
  date: string;
  country: string;
  people: string[];
  year: string;
}

interface CityWithFlag {
  city: string;
  flag: string;
}

@Component({
  selector: 'app-shisui',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule], // Ajouté FormsModule
  templateUrl: './shisui.component.html',
  styleUrls: ['./shisui.component.scss'],
})
export class ShisuiComponent implements OnInit, OnDestroy {
  // Utiliser une chaîne simple pour la position de la légende
  legendPosition: string = 'right';
  
  // Palette de couleurs arc-en-ciel étendue
  colorScheme: Color = {
    name: 'rainbowColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00', // Rouges et jaunes
      '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', // Verts
      '#00FF33', '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', // Cyans
      '#00CCFF', '#0099FF', '#0066FF', '#0033FF', '#0000FF', // Bleus
      '#3300FF', '#6600FF', '#9900FF', '#CC00FF', '#FF00FF', // Violets
      '#FF00CC', '#FF0099', '#FF0066', '#FF0033', // Retour au rouge
      '#E6005C', '#B3005C', '#800040', '#400030', '#000000', // Dégradé vers le noir
      '#19376D', '#A5D7E8', '#576CBC', '#0B2447', '#7B8FA1', // Bleus variés
      '#82AAE3', '#91D8E4', '#BFEAF5', '#FFF9DE', '#A5C0DD', // Tons pastels
      '#F6F7C1', '#C6EBC5', '#51557E', '#816797', '#D6D5A8', // Tons terreux
      '#1B9C85', '#E8F6EF', '#B8E7E1', '#D2E0FB', '#AFB4FF', // Verts et bleus clairs
      '#FFCEFE', '#FFDEB4', '#FFB4B4', '#B46060', '#4E6C50', // Roses et bruns
      '#F1F0C0', '#7743DB', '#5EAAA8', '#F05454', '#9E7676'  // Couleurs diverses
    ]
  };
  
  view: [number, number] = [1200, 800];
  showLegend = true;
  
  entries: Entry[] = [];
  cityStats: { name: string; value: number }[] = [];
  peopleStats: { name: string; value: number }[] = [];
  flagStats: { name: string; value: number }[] = [];
  
  // Nouvelles statistiques
  peopleByCountryStats: { [country: string]: { name: string; value: number }[] } = {};
  consecutiveDaysStats: { name: string; value: number }[] = [];
  
  // Statistiques par jour de la semaine
  peopleByDayStats: {
    [day: string]: { name: string; value: number }[]
  } = {};
  
  // Map pour stocker la correspondance ville -> drapeau (plus utilisé avec la nouvelle structure)
  cityFlagMap: Map<string, string> = new Map();
  
  // Statistiques par année
  yearlyStats: {
    [year: string]: {
      cities: { name: string; value: number }[];
      countries: { name: string; value: number }[];
      people: { name: string; value: number }[];
    }
  } = {};
  
  // Statistiques des weekends par année
  weekendStatsByYear: {
    [year: string]: { name: string; value: number }[]
  } = {};
  
  // Statistiques des nuits
  nightCityStats: { name: string; value: number }[] = [];
  nightCountryStats: { name: string; value: number }[] = [];
  nightPeopleStats: { name: string; value: number }[] = [];
  
  // Statistiques des nuits par année
  nightStatsByYear: {
    [year: string]: {
      cities: { name: string; value: number }[];
      countries: { name: string; value: number }[];
      people: { name: string; value: number }[];
    }
  } = {};
  
  // Statistiques weekend générales
  weekendStats: { name: string; value: number }[] = [];
  
  // Propriétés pour la recherche par date
  searchDate: string = '';
  dateSearchResult: DateSearchResult | null = null;

  // Propriétés pour la recherche par personne
  searchPerson: string = '';
  personSearchResult: PersonSearchResult | null = null;
  personSearchLoading: boolean = false;
  
  // Propriétés pour la recherche par ville
  searchCity: string = '';
  citySearchResult: CitySearchResult | null = null;
  citySearchLoading: boolean = false;
  
  // Propriété pour le filtre de type de table
  selectedTableType: string = 'all';
  
  loading = true;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.updateChartSize();
  }

  ngOnInit(): void {
    document.body.classList.add('life-page');
    document.documentElement.classList.add('life-page');
    this.updateChartSize();
    
    // Lire les paramètres d'URL d'abord
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.selectedTableType = params['filter'];
      }
      if (params['date']) {
        this.searchDate = params['date'];
      }
      if (params['person']) {
        this.searchPerson = params['person'];
      }
      if (params['city']) {
        this.searchCity = params['city'];
      }
      
      // Charger les données puis déclencher les recherches
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('life-page');
    document.documentElement.classList.remove('life-page');
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChartSize();
  }

  updateChartSize() {
    const width = window.innerWidth;
    
    if (width <= 400) {
      this.view = [280, 280];
      this.showLegend = false;
    } else if (width <= 576) {
      this.view = [300, 300];
      this.showLegend = false;
    } else if (width <= 768) {
      this.view = [450, 300];
      this.showLegend = true;
      this.legendPosition = 'bottom';
    } else if (width <= 992) {
      this.view = [500, 350];
      this.showLegend = true;
      this.legendPosition = 'right';
    } else if (width <= 1200) {
      this.view = [550, 400];
      this.showLegend = true;
      this.legendPosition = 'right';
    } else {
      this.view = [1200, 800];
      this.showLegend = true;
      this.legendPosition = 'right';
    }
  }

  // Plus besoin de charger la sheet villes séparée avec la nouvelle structure
  // Les drapeaux sont maintenant directement dans les colonnes c1, c2, c3

  fetchData(): void {
    const csvUrl =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTA7o5kyxn2EljodBFyQE2yG6t9s2Rg9gYrpuK080_TBhNRrygO7o_zk5cksPtcqo6py_onhoOdboAc/pub?gid=0&single=true&output=csv';

    this.http.get(csvUrl, { responseType: 'text' }).subscribe({
      next: (csvText: string) => {
        this.parseData(csvText);
        this.loading = false;
        
        // Déclencher les recherches après le chargement des données
        this.executeSearchesFromUrl();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.loading = false;
      }
    });
  }

  // Méthode pour déclencher les recherches après le chargement des données
  private executeSearchesFromUrl(): void {
    if (this.searchDate) {
      this.searchByDate();
    }
    if (this.searchPerson) {
      this.searchByPerson();
    }
    if (this.searchCity) {
      this.searchByCity();
    }
  }

  parseData(csvText: string): void {
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');
    
    if (lines.length > 0) {
      const [, ...dataLines] = lines;
      const data = dataLines.map((line) => line.split(','));

      this.entries = data.map((row: string[]) => ({
        date: row[0]?.trim() || '',
        day: row[1]?.trim() || '',
        cn: row[2]?.trim() || '',
        cityNight: row[3]?.trim() || '',
        peopleNight: row[4] ? row[4].split(' ').map((p) => p.trim()).filter(p => p) : [],
        c1: row[5]?.trim() || '',
        city1: row[6]?.trim() || '',
        people1: row[7] ? row[7].split(' ').map((p) => p.trim()).filter(p => p) : [],
        c2: row[8]?.trim() || '',
        city2: row[9]?.trim() || '',
        people2: row[10] ? row[10].split(' ').map((p) => p.trim()).filter(p => p) : [],
        c3: row[11]?.trim() || '',
        city3: row[12]?.trim() || '',
        people3: row[13] ? row[13].split(' ').map((p) => p.trim()).filter(p => p) : [],
      }));

      this.computeAllStats();
    }
  }

  // Méthode pour formater automatiquement l'input
  onDateInput(): void {
    // Effacer les résultats de recherche par personne et ville
    this.personSearchResult = null;
    this.searchPerson = '';
    this.citySearchResult = null;
    this.searchCity = '';

    // Supprimer tous les caractères non numériques
    let value = this.searchDate.replace(/\D/g, '');
    
    // Formater automatiquement avec /
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    this.searchDate = value;
    this.updateUrlWithDate();
    this.searchByDate();
  }

  // Mettre à jour l'URL avec le filtre
  updateUrlWithFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        filter: this.selectedTableType === 'all' ? null : this.selectedTableType,
        date: this.searchDate || null,
        person: this.searchPerson || null,
        city: this.searchCity || null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Mettre à jour l'URL avec la date
  updateUrlWithDate(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        filter: this.selectedTableType === 'all' ? null : this.selectedTableType,
        date: this.searchDate || null,
        person: null,
        city: null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Mettre à jour l'URL avec la personne
  updateUrlWithPerson(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        filter: this.selectedTableType === 'all' ? null : this.selectedTableType,
        person: this.searchPerson || null,
        date: null,
        city: null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Mettre à jour l'URL avec la ville
  updateUrlWithCity(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        filter: this.selectedTableType === 'all' ? null : this.selectedTableType,
        city: this.searchCity || null,
        date: null,
        person: null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Méthode pour rechercher par jour/mois
  searchByDate(): void {
    if (!this.searchDate || !this.searchDate.includes('/')) {
      this.dateSearchResult = null;
      return;
    }

    // Parser le format DD/MM
    const parts = this.searchDate.split('/');
    if (parts.length !== 2 || !parts[1]) {
      this.dateSearchResult = null;
      return;
    }

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const dayMonth = `${day}/${month}`;

    // Rechercher pour toutes les années
    const allYearsResults: DateSearchResultByYear[] = [];
    const availableYears = this.getAvailableYears();
    
    for (const year of availableYears) {
      const dateForYear = `${dayMonth}/${year}`;
      const entryForYear = this.entries.find(e => e.date === dateForYear);
      const resultForYear = this.processDateEntry(entryForYear, dateForYear);
      
      allYearsResults.push({
        year: year,
        date: dateForYear,
        countries: resultForYear.countries,
        cities: resultForYear.cities,
        people: resultForYear.people,
        nightCity: resultForYear.nightCity || '',
        nightPeople: resultForYear.nightPeople || [],
        found: resultForYear.found
      });
    }

    // Trier par année décroissante
    allYearsResults.sort((a, b) => b.year.localeCompare(a.year));

    this.dateSearchResult = {
      date: dayMonth,
      countries: [],
      cities: [],
      people: [],
      found: allYearsResults.some(r => r.found),
      allYearsResults: allYearsResults
    };
  }

  private processDateEntry(entry: Entry | undefined, formattedDate: string): DateSearchResult {
    if (entry) {
      // Utiliser des Sets pour éviter les doublons
      const countriesSet = new Set<string>();
      const citiesSet = new Set<string>();
      const peopleSet = new Set<string>();
      
      // Données de jour UNIQUEMENT (colonnes F, G, H et I, J, K et L, M, N)
      if (entry.c1) countriesSet.add(entry.c1);
      if (entry.c2) countriesSet.add(entry.c2);
      if (entry.c3) countriesSet.add(entry.c3);
      
      // Séparer les villes de jour UNIQUEMENT
      if (entry.city1) {
        entry.city1.split(' ').forEach(city => {
          if (city.trim()) citiesSet.add(city.trim());
        });
      }
      if (entry.city2) {
        entry.city2.split(' ').forEach(city => {
          if (city.trim()) citiesSet.add(city.trim());
        });
      }
      if (entry.city3) {
        entry.city3.split(' ').forEach(city => {
          if (city.trim()) citiesSet.add(city.trim());
        });
      }
      
      // Ajouter les personnes de jour UNIQUEMENT (colonnes H, K, N)
      entry.people1.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      entry.people2.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      entry.people3.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      
      // Données de nuit (séparées)
      let nightCity = '';
      if (entry.cityNight && entry.cityNight.trim()) {
        nightCity = entry.cityNight.trim();
        // Ajouter le drapeau de nuit si disponible
        if (entry.cn && entry.cn.trim()) {
          nightCity = `${entry.cn} ${nightCity}`;
        }
      }
      
      const nightPeople = entry.peopleNight.filter(person => person && person.trim());
      
      return {
        date: formattedDate,
        countries: Array.from(countriesSet),
        cities: Array.from(citiesSet),
        people: Array.from(peopleSet),
        nightCity: nightCity,
        nightPeople: nightPeople,
        found: true
      };
    } else {
      return {
        date: formattedDate,
        countries: [],
        cities: [],
        people: [],
        nightCity: '',
        nightPeople: [],
        found: false
      };
    }
  }

  private getAvailableYears(): string[] {
    const years = new Set<string>();
    this.entries.forEach(entry => {
      const parts = entry.date.split('/');
      if (parts.length === 3) {
        years.add(parts[2]);
      }
    });
    return Array.from(years).sort();
  }


  // Méthode pour effacer la recherche
  clearSearch(): void {
    this.searchDate = '';
    this.dateSearchResult = null;
    this.updateUrlWithDate();
  }

  // Méthode pour la recherche par personne
  onPersonInput(): void {
    // Effacer les résultats de recherche par date et ville
    this.dateSearchResult = null;
    this.searchDate = '';
    this.citySearchResult = null;
    this.searchCity = '';

    if (!this.searchPerson || this.searchPerson.trim().length < 2) {
      this.personSearchResult = null;
      this.updateUrlWithPerson();
      return;
    }
    
    this.personSearchLoading = true;
    this.updateUrlWithPerson();
    
    // Simule un délai de chargement pour l'UX
    setTimeout(() => {
      this.searchByPerson();
      this.personSearchLoading = false;
    }, 300);
  }

  // Méthode pour rechercher par personne
  searchByPerson(): void {
    if (!this.searchPerson || this.searchPerson.trim().length < 2) {
      this.personSearchResult = null;
      return;
    }

    const searchName = this.searchPerson.trim().toLowerCase();
    const personDates: PersonDateEntry[] = [];
    const personNights: PersonNightEntry[] = [];

    // Parcourir toutes les entrées pour trouver celles qui contiennent cette personne
    for (const entry of this.entries) {
      const parts = entry.date.split('/');
      const year = parts.length === 3 ? parts[2] : '';

      // Gérer les nuits séparément
      if (entry.peopleNight.some(p => p && p.trim().toLowerCase() === searchName)) {
        if (entry.cn && entry.cityNight) {
          personNights.push({
            date: entry.date,
            country: entry.cn,
            city: entry.cityNight,
            year: year
          });
        }
      }

      // Gérer les jours (seulement c1, c2, c3 - pas cn)
      const foundCountries: string[] = [];
      
      // Vérifier dans people1 (colonne H) -> drapeau c1 (colonne F)
      if (entry.people1.some(p => p && p.trim().toLowerCase() === searchName)) {
        if (entry.c1) foundCountries.push(entry.c1);
      }
      // Vérifier dans people2 (colonne K) -> drapeau c2 (colonne I)
      if (entry.people2.some(p => p && p.trim().toLowerCase() === searchName)) {
        if (entry.c2) foundCountries.push(entry.c2);
      }
      // Vérifier dans people3 (colonne N) -> drapeau c3 (colonne L)
      if (entry.people3.some(p => p && p.trim().toLowerCase() === searchName)) {
        if (entry.c3) foundCountries.push(entry.c3);
      }

      // Dédoublonner les pays identiques
      const uniqueCountries = [...new Set(foundCountries)];

      // Si la personne a été trouvée dans une ou plusieurs colonnes de jour
      if (uniqueCountries.length > 0) {
        personDates.push({
          date: entry.date,
          countries: uniqueCountries,
          year: year
        });
      }
    }

    // Trier les dates par ordre décroissant
    const sortByDate = (a: any, b: any) => {
      const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    };

    personDates.sort(sortByDate);
    personNights.sort(sortByDate);

    this.personSearchResult = {
      person: this.searchPerson,
      dates: personDates,
      nights: personNights,
      found: personDates.length > 0 || personNights.length > 0
    };
  }

  // Méthode pour effacer la recherche par personne
  clearPersonSearch(): void {
    this.searchPerson = '';
    this.personSearchResult = null;
    this.personSearchLoading = false;
    this.updateUrlWithPerson();
  }

  // Méthode pour la recherche par ville
  onCityInput(): void {
    // Effacer les résultats de recherche par date et personne
    this.dateSearchResult = null;
    this.searchDate = '';
    this.personSearchResult = null;
    this.searchPerson = '';

    if (!this.searchCity || this.searchCity.trim().length < 2) {
      this.citySearchResult = null;
      this.updateUrlWithCity();
      return;
    }
    
    this.citySearchLoading = true;
    this.updateUrlWithCity();
    
    // Simule un délai de chargement pour l'UX
    setTimeout(() => {
      this.searchByCity();
      this.citySearchLoading = false;
    }, 300);
  }

  // Méthode helper pour vérifier si une ville correspond exactement
  private cityMatchesExactly(cityString: string, searchCity: string): boolean {
    // Diviser la chaîne par des espaces pour obtenir toutes les villes
    const cities = cityString.trim().split(' ').map(city => city.trim().toLowerCase()).filter(city => city);
    // Vérifier si la ville recherchée correspond exactement à l'une des villes
    return cities.includes(searchCity.toLowerCase());
  }

  // Méthode pour rechercher par ville
  searchByCity(): void {
    if (!this.searchCity || this.searchCity.trim().length < 2) {
      this.citySearchResult = null;
      return;
    }

    const searchCityName = this.searchCity.trim().toLowerCase();
    const cityDates: CityDateEntry[] = [];
    const cityNights: CityNightEntry[] = [];

    // Parcourir toutes les entrées pour trouver celles qui contiennent cette ville
    for (const entry of this.entries) {
      const parts = entry.date.split('/');
      const year = parts.length === 3 ? parts[2] : '';

      // Gérer les nuits séparément
      if (entry.cityNight && entry.cityNight.trim().toLowerCase() === searchCityName) {
        cityNights.push({
          date: entry.date,
          country: entry.cn || '',
          people: entry.peopleNight.filter(p => p && p.trim()),
          year: year
        });
      }

      // Gérer les jours (city1, city2, city3)
      const foundEntries: {countries: string[], people: string[], column: string}[] = [];
      
      // Vérifier dans city1 -> drapeau c1 + personnes people1
      if (entry.city1 && this.cityMatchesExactly(entry.city1, searchCityName)) {
        foundEntries.push({
          countries: entry.c1 ? [entry.c1] : [],
          people: entry.people1.filter(p => p && p.trim()),
          column: 'c1'
        });
      }
      // Vérifier dans city2 -> drapeau c2 + personnes people2
      if (entry.city2 && this.cityMatchesExactly(entry.city2, searchCityName)) {
        foundEntries.push({
          countries: entry.c2 ? [entry.c2] : [],
          people: entry.people2.filter(p => p && p.trim()),
          column: 'c2'
        });
      }
      // Vérifier dans city3 -> drapeau c3 + personnes people3
      if (entry.city3 && this.cityMatchesExactly(entry.city3, searchCityName)) {
        foundEntries.push({
          countries: entry.c3 ? [entry.c3] : [],
          people: entry.people3.filter(p => p && p.trim()),
          column: 'c3'
        });
      }

      // Combiner les résultats pour cette date
      foundEntries.forEach(foundEntry => {
        if (foundEntry.countries.length > 0 || foundEntry.people.length > 0) {
          cityDates.push({
            date: entry.date,
            countries: foundEntry.countries,
            people: foundEntry.people,
            year: year,
            column: foundEntry.column
          });
        }
      });
    }

    // Trier les dates par ordre décroissant
    const sortByDate = (a: any, b: any) => {
      const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    };

    cityDates.sort(sortByDate);
    cityNights.sort(sortByDate);

    this.citySearchResult = {
      city: this.searchCity,
      dates: cityDates,
      nights: cityNights,
      found: cityDates.length > 0 || cityNights.length > 0
    };
  }

  // Méthode pour effacer la recherche par ville
  clearCitySearch(): void {
    this.searchCity = '';
    this.citySearchResult = null;
    this.citySearchLoading = false;
    this.updateUrlWithCity();
  }

  // Méthode pour scroll vers la section nuits
  scrollToNights(): void {
    const nightsSection = document.getElementById('nights-section');
    if (nightsSection) {
      nightsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Méthode pour calculer les statistiques de la recherche par personne
  getPersonSearchStats(): any {
    if (!this.personSearchResult) {
      return null;
    }

    const totalDays = this.personSearchResult.dates.length;
    const totalNights = this.personSearchResult.nights.length;

    // Stats des pays (jours uniquement)
    const dayCountries: { [country: string]: number } = {};
    this.personSearchResult.dates.forEach(dateEntry => {
      dateEntry.countries.forEach(country => {
        dayCountries[country] = (dayCountries[country] || 0) + 1;
      });
    });

    // Stats des pays (nuits)
    const nightCountries: { [country: string]: number } = {};
    this.personSearchResult.nights.forEach(nightEntry => {
      nightCountries[nightEntry.country] = (nightCountries[nightEntry.country] || 0) + 1;
    });

    // Stats des villes de nuit
    const nightCities: { [city: string]: number } = {};
    this.personSearchResult.nights.forEach(nightEntry => {
      const cityKey = `${nightEntry.country} ${nightEntry.city}`;
      nightCities[cityKey] = (nightCities[cityKey] || 0) + 1;
    });

    // Convertir en arrays triées
    const topDayCountries = Object.entries(dayCountries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    const topNightCountries = Object.entries(nightCountries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const topNightCities = Object.entries(nightCities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalDays,
      totalNights,
      topDayCountries,
      topNightCountries,
      topNightCities
    };
  }

  // Méthode pour grouper les résultats par année puis par mois
  getPersonResultsByYear(): { year: string; months: { month: string; monthName: string; dates: PersonDateEntry[] }[] }[] {
    if (!this.personSearchResult || !this.personSearchResult.dates) {
      return [];
    }

    const yearGroups: { [year: string]: { [month: string]: PersonDateEntry[] } } = {};
    
    this.personSearchResult.dates.forEach(dateEntry => {
      const parts = dateEntry.date.split('/');
      const month = parts.length >= 2 ? parts[1] : '01';
      
      if (!yearGroups[dateEntry.year]) {
        yearGroups[dateEntry.year] = {};
      }
      if (!yearGroups[dateEntry.year][month]) {
        yearGroups[dateEntry.year][month] = [];
      }
      yearGroups[dateEntry.year][month].push(dateEntry);
    });

    const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Convertir en array et trier par année décroissante, puis par mois décroissant
    return Object.entries(yearGroups)
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .map(([month, dates]) => ({
            month,
            monthName: monthNames[parseInt(month)] || 'Mois ' + month,
            dates
          }))
          .sort((a, b) => parseInt(b.month) - parseInt(a.month))
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  // Méthode pour grouper les nuits par année puis par mois
  getPersonNightsByYear(): { year: string; months: { month: string; monthName: string; nights: PersonNightEntry[] }[] }[] {
    if (!this.personSearchResult || !this.personSearchResult.nights) {
      return [];
    }

    const yearGroups: { [year: string]: { [month: string]: PersonNightEntry[] } } = {};
    
    this.personSearchResult.nights.forEach(nightEntry => {
      const parts = nightEntry.date.split('/');
      const month = parts.length >= 2 ? parts[1] : '01';
      
      if (!yearGroups[nightEntry.year]) {
        yearGroups[nightEntry.year] = {};
      }
      if (!yearGroups[nightEntry.year][month]) {
        yearGroups[nightEntry.year][month] = [];
      }
      yearGroups[nightEntry.year][month].push(nightEntry);
    });

    const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Convertir en array et trier par année décroissante, puis par mois décroissant
    return Object.entries(yearGroups)
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .map(([month, nights]) => ({
            month,
            monthName: monthNames[parseInt(month)] || 'Mois ' + month,
            nights
          }))
          .sort((a, b) => parseInt(b.month) - parseInt(a.month))
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  // Getter pour savoir si on est en mode recherche
  get isSearching(): boolean {
    return !!(this.searchDate && this.dateSearchResult) || 
           !!(this.searchPerson && this.personSearchResult) || 
           !!(this.searchCity && this.citySearchResult);
  }

  // Méthode pour calculer les statistiques de la recherche par ville
  getCitySearchStats(): any {
    if (!this.citySearchResult) {
      return null;
    }

    const totalDays = this.citySearchResult.dates.length;
    const totalNights = this.citySearchResult.nights.length;

    // Stats des pays (jours uniquement)
    const dayCountries: { [country: string]: number } = {};
    this.citySearchResult.dates.forEach(dateEntry => {
      dateEntry.countries.forEach(country => {
        dayCountries[country] = (dayCountries[country] || 0) + 1;
      });
    });

    // Stats des pays (nuits)
    const nightCountries: { [country: string]: number } = {};
    this.citySearchResult.nights.forEach(nightEntry => {
      nightCountries[nightEntry.country] = (nightCountries[nightEntry.country] || 0) + 1;
    });

    return {
      totalDays,
      totalNights
    };
  }

  // Méthode pour grouper les résultats de ville par année puis par mois
  getCityResultsByYear(): { year: string; months: { month: string; monthName: string; dates: CityDateEntry[] }[] }[] {
    if (!this.citySearchResult || !this.citySearchResult.dates) {
      return [];
    }

    const yearGroups: { [year: string]: { [month: string]: CityDateEntry[] } } = {};
    
    this.citySearchResult.dates.forEach(dateEntry => {
      const parts = dateEntry.date.split('/');
      const month = parts.length >= 2 ? parts[1] : '01';
      
      if (!yearGroups[dateEntry.year]) {
        yearGroups[dateEntry.year] = {};
      }
      if (!yearGroups[dateEntry.year][month]) {
        yearGroups[dateEntry.year][month] = [];
      }
      yearGroups[dateEntry.year][month].push(dateEntry);
    });

    const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Convertir en array et trier par année décroissante, puis par mois décroissant
    return Object.entries(yearGroups)
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .map(([month, dates]) => ({
            month,
            monthName: monthNames[parseInt(month)] || 'Mois ' + month,
            dates
          }))
          .sort((a, b) => parseInt(b.month) - parseInt(a.month))
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  // Méthode pour grouper les nuits de ville par année puis par mois
  getCityNightsByYear(): { year: string; months: { month: string; monthName: string; nights: CityNightEntry[] }[] }[] {
    if (!this.citySearchResult || !this.citySearchResult.nights) {
      return [];
    }

    const yearGroups: { [year: string]: { [month: string]: CityNightEntry[] } } = {};
    
    this.citySearchResult.nights.forEach(nightEntry => {
      const parts = nightEntry.date.split('/');
      const month = parts.length >= 2 ? parts[1] : '01';
      
      if (!yearGroups[nightEntry.year]) {
        yearGroups[nightEntry.year] = {};
      }
      if (!yearGroups[nightEntry.year][month]) {
        yearGroups[nightEntry.year][month] = [];
      }
      yearGroups[nightEntry.year][month].push(nightEntry);
    });

    const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    // Convertir en array et trier par année décroissante, puis par mois décroissant
    return Object.entries(yearGroups)
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .map(([month, nights]) => ({
            month,
            monthName: monthNames[parseInt(month)] || 'Mois ' + month,
            nights
          }))
          .sort((a, b) => parseInt(b.month) - parseInt(a.month))
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  computeAllStats(): void {
    this.computeCityStats();
    this.computePeopleStats();
    this.computeFlagStats();
    this.computePeopleByCountryStats();
    this.computeConsecutiveDaysStats();
    this.computePeopleByDayStats();
    this.computeYearlyStats();
    this.computeWeekendStatsByYear();
    this.computeNightStats();
    this.computeNightStatsByYear();
    this.computeWeekendStats();
  }

  computeCityStats(): void {
    const count: { [city: string]: number } = {};
    for (const entry of this.entries) {
      // Ne compter qu'une seule fois par jour, même si plusieurs pays
      const cities = new Set<string>();
      
      // Séparer les villes si plusieurs dans une même cellule
      if (entry.cityNight) {
        entry.cityNight.split(' ').forEach(city => {
          if (city.trim()) cities.add(city.trim());
        });
      }
      if (entry.city1) {
        entry.city1.split(' ').forEach(city => {
          if (city.trim()) cities.add(city.trim());
        });
      }
      if (entry.city2) {
        entry.city2.split(' ').forEach(city => {
          if (city.trim()) cities.add(city.trim());
        });
      }
      if (entry.city3) {
        entry.city3.split(' ').forEach(city => {
          if (city.trim()) cities.add(city.trim());
        });
      }
      
      for (const city of cities) {
        count[city] = (count[city] || 0) + 1;
      }
    }
    this.cityStats = Object.entries(count)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  computePeopleStats(): void {
    const count: { [person: string]: number } = {};
    for (const entry of this.entries) {
      // Ne compter qu'une seule fois par personne par jour (colonnes H et K seulement)
      const people = new Set<string>();
      entry.people1.forEach(p => people.add(p)); // Colonne H
      entry.people3.forEach(p => people.add(p)); // Colonne K
      
      for (const person of people) {
        count[person] = (count[person] || 0) + 1;
      }
    }
    this.peopleStats = Object.entries(count)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  computeFlagStats(): void {
    const count: { [flag: string]: number } = {};
    for (const entry of this.entries) {
      // Ne compter que les drapeaux de jour (c1, c2, c3), pas les drapeaux de nuit (cn)
      const flags = new Set<string>();
      if (entry.c1) flags.add(entry.c1);
      if (entry.c2) flags.add(entry.c2);
      if (entry.c3) flags.add(entry.c3);
      
      for (const flag of flags) {
        count[flag] = (count[flag] || 0) + 1;
      }
    }
    this.flagStats = Object.entries(count)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  computePeopleByCountryStats(): void {
    this.peopleByCountryStats = {};
    
    // Collecter tous les pays uniques (seulement les jours, pas les nuits)
    const allCountries = new Set<string>();
    for (const entry of this.entries) {
      if (entry.c1) allCountries.add(entry.c1);
      if (entry.c2) allCountries.add(entry.c2);
      if (entry.c3) allCountries.add(entry.c3);
    }
    
    for (const country of allCountries) {
      const countForCountry: { [person: string]: number } = {};
      
      for (const entry of this.entries) {
        // Collecter toutes les personnes pour ce pays dans cette entrée (éviter les doublons)
        const peopleInCountryThisDay = new Set<string>();
        
        // Associer les personnes au bon pays (seulement les jours, pas les nuits)
        // Note: cn (nuits) supprimé pour cohérence avec le calcul du "Top Pays"
        if (entry.c1 === country) {
          entry.people1.forEach(person => {
            if (person && person.trim()) {
              peopleInCountryThisDay.add(person.trim());
            }
          });
        }
        if (entry.c2 === country) {
          entry.people2.forEach(person => {
            if (person && person.trim()) {
              peopleInCountryThisDay.add(person.trim());
            }
          });
        }
        if (entry.c3 === country) {
          entry.people3.forEach(person => {
            if (person && person.trim()) {
              peopleInCountryThisDay.add(person.trim());
            }
          });
        }
        
        // Compter chaque personne une seule fois par jour pour ce pays
        for (const person of peopleInCountryThisDay) {
          countForCountry[person] = (countForCountry[person] || 0) + 1;
        }
      }
      
      if (Object.keys(countForCountry).length > 0) {
        this.peopleByCountryStats[country] = Object.entries(countForCountry)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value }));
      }
    }
  }

  computeConsecutiveDaysStats(): void {
    const sortedEntries = [...this.entries].sort((a, b) => {
      const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    const maxConsecutive: { [person: string]: number } = {};
    
    // Collecter toutes les personnes uniques (colonnes H et K seulement)
    const allPeople = new Set<string>();
    this.entries.forEach(entry => {
      entry.people1.forEach(p => allPeople.add(p)); // Colonne H
      entry.people3.forEach(p => allPeople.add(p)); // Colonne K
    });
    
    for (const person of allPeople) {
      let currentStreak = 0;
      let maxStreak = 0;
      let previousDate: Date | null = null;
      
      for (const entry of sortedEntries) {
        const parseDate = (dateStr: string): Date => {
          const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
          return new Date(year, month - 1, day);
        };
        
        const currentDate = parseDate(entry.date);
        const personIsPresent = entry.people1.includes(person) || // Colonne H
                               entry.people3.includes(person);   // Colonne K
        
        if (personIsPresent) {
          if (previousDate) {
            const dayDifference = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
            if (Math.abs(dayDifference - 1) < 0.1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }
          
          maxStreak = Math.max(maxStreak, currentStreak);
          previousDate = currentDate;
        } else {
          currentStreak = 0;
          previousDate = null;
        }
      }
      
      if (maxStreak > 0) {
        maxConsecutive[person] = maxStreak;
      }
    }

    this.consecutiveDaysStats = Object.entries(maxConsecutive)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  computePeopleByDayStats(): void {
    this.peopleByDayStats = {};
    
    // Mapping entre jours anglais et français
    const dayMapping: { [englishDay: string]: string } = {
      'Mon': 'Lundi',
      'Tue': 'Mardi', 
      'Wed': 'Mercredi',
      'Thu': 'Jeudi',
      'Fri': 'Vendredi',
      'Sat': 'Samedi',
      'Sun': 'Dimanche',
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi', 
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    };
    
    // Jours de la semaine en français pour l'affichage
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    // Initialiser les statistiques pour chaque jour
    for (const frenchDay of daysOfWeek) {
      const countForDay: { [person: string]: number } = {};
      
      for (const entry of this.entries) {
        // Convertir le jour anglais en français
        const frenchDayFromData = dayMapping[entry.day?.trim()] || '';
        
        if (frenchDayFromData === frenchDay) {
          // Collecter toutes les personnes de cette entrée
          const people = new Set<string>();
          entry.peopleNight.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people1.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people2.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people3.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          
          for (const person of people) {
            if (person) {
              countForDay[person] = (countForDay[person] || 0) + 1;
            }
          }
        }
      }
      
      if (Object.keys(countForDay).length > 0) {
        this.peopleByDayStats[frenchDay] = Object.entries(countForDay)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value }));
      } else {
        this.peopleByDayStats[frenchDay] = [];
      }
    }
  }

  computeYearlyStats(): void {
    this.yearlyStats = {};
    
    // Grouper les entrées par année
    const entriesByYear: { [year: string]: Entry[] } = {};
    
    for (const entry of this.entries) {
      // Extraire l'année de la date (format DD/MM/YYYY)
      const parts = entry.date.split('/');
      if (parts.length === 3) {
        const year = parts[2];
        if (!entriesByYear[year]) {
          entriesByYear[year] = [];
        }
        entriesByYear[year].push(entry);
      }
    }
    
    // Calculer les statistiques pour chaque année
    for (const [year, yearEntries] of Object.entries(entriesByYear)) {
      // Statistiques des villes (ne compter qu'une fois par jour)
      const cityCount: { [city: string]: number } = {};
      for (const entry of yearEntries) {
        const cities = new Set<string>();
        
        // Séparer les villes si plusieurs dans une même cellule
        if (entry.cityNight) {
          entry.cityNight.split(' ').forEach(city => {
            if (city.trim()) cities.add(city.trim());
          });
        }
        if (entry.city1) {
          entry.city1.split(' ').forEach(city => {
            if (city.trim()) cities.add(city.trim());
          });
        }
        if (entry.city2) {
          entry.city2.split(' ').forEach(city => {
            if (city.trim()) cities.add(city.trim());
          });
        }
        if (entry.city3) {
          entry.city3.split(' ').forEach(city => {
            if (city.trim()) cities.add(city.trim());
          });
        }
        
        for (const city of cities) {
          cityCount[city] = (cityCount[city] || 0) + 1;
        }
      }
      
      // Statistiques des pays (ne compter qu'une fois par jour)
      const countryCount: { [country: string]: number } = {};
      for (const entry of yearEntries) {
        const countries = new Set<string>();
        if (entry.cn) countries.add(entry.cn);
        if (entry.c1) countries.add(entry.c1);
        if (entry.c2) countries.add(entry.c2);
        if (entry.c3) countries.add(entry.c3);
        
        for (const country of countries) {
          countryCount[country] = (countryCount[country] || 0) + 1;
        }
      }
      
      // Statistiques des personnes (ne compter qu'une fois par jour)
      const peopleCount: { [person: string]: number } = {};
      for (const entry of yearEntries) {
        const people = new Set<string>();
        entry.peopleNight.forEach(p => people.add(p));
        entry.people1.forEach(p => people.add(p));
        entry.people2.forEach(p => people.add(p));
        entry.people3.forEach(p => people.add(p));
        
        for (const person of people) {
          peopleCount[person] = (peopleCount[person] || 0) + 1;
        }
      }
      
      this.yearlyStats[year] = {
        cities: Object.entries(cityCount)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value })),
        countries: Object.entries(countryCount)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value })),
        people: Object.entries(peopleCount)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value }))
      };
    }
  }

  computeWeekendStatsByYear(): void {
    this.weekendStatsByYear = {};
    
    // Mapping entre jours anglais et français pour identifier les weekends
    const dayMapping: { [englishDay: string]: string } = {
      'Mon': 'Lundi',
      'Tue': 'Mardi', 
      'Wed': 'Mercredi',
      'Thu': 'Jeudi',
      'Fri': 'Vendredi',
      'Sat': 'Samedi',
      'Sun': 'Dimanche',
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi', 
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    };
    
    // Grouper les entrées par année
    const entriesByYear: { [year: string]: Entry[] } = {};
    
    for (const entry of this.entries) {
      // Extraire l'année de la date (format DD/MM/YYYY)
      const parts = entry.date.split('/');
      if (parts.length === 3) {
        const year = parts[2];
        if (!entriesByYear[year]) {
          entriesByYear[year] = [];
        }
        entriesByYear[year].push(entry);
      }
    }
    
    // Calculer les statistiques weekend pour chaque année
    for (const [year, yearEntries] of Object.entries(entriesByYear)) {
      const weekendCount: { [person: string]: number } = {};
      
      for (const entry of yearEntries) {
        // Convertir le jour anglais en français
        const frenchDay = dayMapping[entry.day?.trim()] || '';
        
        // Vérifier si c'est un weekend (Samedi ou Dimanche)
        if (frenchDay === 'Samedi' || frenchDay === 'Dimanche') {
          // Collecter toutes les personnes de cette entrée
          const people = new Set<string>();
          entry.peopleNight.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people1.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people2.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          entry.people3.forEach(p => {
            if (p && p.trim()) people.add(p.trim());
          });
          
          for (const person of people) {
            if (person) {
              weekendCount[person] = (weekendCount[person] || 0) + 1;
            }
          }
        }
      }
      
      if (Object.keys(weekendCount).length > 0) {
        this.weekendStatsByYear[year] = Object.entries(weekendCount)
          .map(([name, value], index) => ({ name, value, index }))
          .sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return b.index - a.index; // Plus récent en premier lors d'égalité
          })
          .map(({ name, value }) => ({ name, value }));
      } else {
        this.weekendStatsByYear[year] = [];
      }
    }
  }

  getCountriesWithPeople(): string[] {
    return Object.keys(this.peopleByCountryStats);
  }
  
  getYear(entry: Entry): string {
    const parts = entry.date.split('/');
    return parts.length === 3 ? parts[2] : '';
  }

  getYears(): string[] {
    const allYears = new Set<string>();
    
    // Ajouter les années de yearlyStats
    Object.keys(this.yearlyStats).forEach(year => allYears.add(year));
    
    // Ajouter les années de nightStatsByYear
    Object.keys(this.nightStatsByYear).forEach(year => allYears.add(year));
    
    return Array.from(allYears).sort((a, b) => b.localeCompare(a)); // Tri décroissant
  }

  getDaysOfWeek(): string[] {
    return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  }

  getAllUniqueCities(): string[] {
    const allCities = new Set<string>();
    for (const entry of this.entries) {
      // Séparer les villes si plusieurs dans une même cellule
      if (entry.cityNight && entry.cityNight.trim()) {
        entry.cityNight.split(' ').forEach(city => {
          if (city.trim()) allCities.add(city.trim());
        });
      }
      if (entry.city1 && entry.city1.trim()) {
        entry.city1.split(' ').forEach(city => {
          if (city.trim()) allCities.add(city.trim());
        });
      }
      if (entry.city2 && entry.city2.trim()) {
        entry.city2.split(' ').forEach(city => {
          if (city.trim()) allCities.add(city.trim());
        });
      }
      if (entry.city3 && entry.city3.trim()) {
        entry.city3.split(' ').forEach(city => {
          if (city.trim()) allCities.add(city.trim());
        });
      }
    }
    return Array.from(allCities).sort();
  }
  
  getCityWithFlag(cityName: string): string {
    // Chercher dans quelle colonne se trouve cette ville pour récupérer le bon drapeau
    for (const entry of this.entries) {
      // Vérifier si la ville est dans cityNight
      if (entry.cityNight && entry.cityNight.includes(cityName) && entry.cn) {
        return `${entry.cn} ${cityName}`;
      }
      // Vérifier si la ville est dans city1 (peut être avec d'autres villes)
      if (entry.city1 && entry.city1.includes(cityName) && entry.c1) {
        return `${entry.c1} ${cityName}`;
      }
      if (entry.city2 && entry.city2.includes(cityName) && entry.c2) {
        return `${entry.c2} ${cityName}`;
      }
      if (entry.city3 && entry.city3.includes(cityName) && entry.c3) {
        return `${entry.c3} ${cityName}`;
      }
    }
    return cityName; // Si pas trouvé, retourner juste le nom
  }

  getNightCityWithFlag(cityName: string): string {
    // Chercher spécifiquement dans la colonne cityNight pour récupérer le drapeau cn
    for (const entry of this.entries) {
      if (entry.cityNight && entry.cityNight.includes(cityName) && entry.cn) {
        return `${entry.cn} ${cityName}`;
      }
    }
    return cityName; // Si pas trouvé, retourner juste le nom
  }


  computeNightStats(): void {
    // Statistiques des villes de nuit (colonne D)
    const nightCityCount: { [city: string]: number } = {};
    for (const entry of this.entries) {
      if (entry.cityNight && entry.cityNight.trim()) {
        // Séparer les villes si plusieurs dans une même cellule
        entry.cityNight.split(' ').forEach(city => {
          const trimmedCity = city.trim();
          if (trimmedCity) {
            nightCityCount[trimmedCity] = (nightCityCount[trimmedCity] || 0) + 1;
          }
        });
      }
    }
    this.nightCityStats = Object.entries(nightCityCount)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));

    // Statistiques des pays de nuit (colonne C)
    const nightCountryCount: { [country: string]: number } = {};
    for (const entry of this.entries) {
      if (entry.cn && entry.cn.trim()) {
        nightCountryCount[entry.cn] = (nightCountryCount[entry.cn] || 0) + 1;
      }
    }
    this.nightCountryStats = Object.entries(nightCountryCount)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));

    // Statistiques des personnes de nuit (colonne E)
    const nightPeopleCount: { [person: string]: number } = {};
    for (const entry of this.entries) {
      entry.peopleNight.forEach(person => {
        if (person && person.trim()) {
          nightPeopleCount[person] = (nightPeopleCount[person] || 0) + 1;
        }
      });
    }
    this.nightPeopleStats = Object.entries(nightPeopleCount)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  computeNightStatsByYear(): void {
    this.nightStatsByYear = {};
    
    for (const entry of this.entries) {
      const year = this.getYear(entry);
      
      if (!this.nightStatsByYear[year]) {
        this.nightStatsByYear[year] = {
          cities: [],
          countries: [],
          people: []
        };
      }
      
      // Comptage des villes de nuit (colonne D)
      if (entry.cityNight && entry.cityNight.trim()) {
        entry.cityNight.split(' ').forEach(city => {
          const trimmedCity = city.trim();
          if (trimmedCity) {
            const existing = this.nightStatsByYear[year].cities.find(c => c.name === trimmedCity);
            if (existing) {
              existing.value++;
            } else {
              this.nightStatsByYear[year].cities.push({ name: trimmedCity, value: 1 });
            }
          }
        });
      }
      
      // Comptage des pays de nuit (colonne C)
      if (entry.cn && entry.cn.trim()) {
        const existing = this.nightStatsByYear[year].countries.find(c => c.name === entry.cn);
        if (existing) {
          existing.value++;
        } else {
          this.nightStatsByYear[year].countries.push({ name: entry.cn, value: 1 });
        }
      }
      
      // Comptage des personnes de nuit (colonne E)
      entry.peopleNight.forEach(person => {
        if (person && person.trim()) {
          const existing = this.nightStatsByYear[year].people.find(p => p.name === person);
          if (existing) {
            existing.value++;
          } else {
            this.nightStatsByYear[year].people.push({ name: person, value: 1 });
          }
        }
      });
    }
    
    // Trier chaque catégorie par valeur décroissante pour chaque année
    for (const year in this.nightStatsByYear) {
      this.nightStatsByYear[year].cities.sort((a, b) => b.value - a.value);
      this.nightStatsByYear[year].countries.sort((a, b) => b.value - a.value);
      this.nightStatsByYear[year].people.sort((a, b) => b.value - a.value);
    }
  }

  computeWeekendStats(): void {
    // Mapping entre jours anglais et français pour identifier les weekends
    const dayMapping: { [englishDay: string]: string } = {
      'Mon': 'Lundi',
      'Tue': 'Mardi', 
      'Wed': 'Mercredi',
      'Thu': 'Jeudi',
      'Fri': 'Vendredi',
      'Sat': 'Samedi',
      'Sun': 'Dimanche',
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi', 
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    };
    
    const weekendsPerPerson: { [person: string]: Set<string> } = {};
    
    for (const entry of this.entries) {
      if (!entry.date) continue;
      
      // Convertir le jour anglais en français
      const frenchDay = dayMapping[entry.day?.trim()] || '';
      
      // Vérifier si c'est un weekend (Samedi ou Dimanche)
      if (frenchDay === 'Samedi' || frenchDay === 'Dimanche') {
        // Collecter toutes les personnes de cette entrée (jours seulement, pas les nuits)
        const people = new Set<string>();
        entry.people1.forEach(p => {
          if (p && p.trim()) people.add(p.trim());
        });
        entry.people2.forEach(p => {
          if (p && p.trim()) people.add(p.trim());
        });
        entry.people3.forEach(p => {
          if (p && p.trim()) people.add(p.trim());
        });
        
        // Calculer la clé du week-end pour identifier le week-end unique
        const date = new Date(entry.date);
        if (isNaN(date.getTime())) {
          continue; // Skip invalid dates
        }
        
        // Créer une clé basée sur le samedi du week-end
        const dayOfWeek = date.getDay(); // 0 = dimanche, 6 = samedi
        let weekendStart = new Date(date);
        
        if (dayOfWeek === 0) {
          // Si c'est dimanche, prendre le samedi précédent
          weekendStart.setDate(date.getDate() - 1);
        } else if (dayOfWeek === 6) {
          // Si c'est samedi, garder cette date
          // weekendStart reste la même
        }
        
        const weekKey = weekendStart.toISOString().split('T')[0]; // Format YYYY-MM-DD du samedi
        
        for (const person of people) {
          if (person) {
            if (!weekendsPerPerson[person]) {
              weekendsPerPerson[person] = new Set<string>();
            }
            weekendsPerPerson[person].add(weekKey);
          }
        }
      }
    }
    
    // Convertir en format final avec le nombre de week-ends uniques
    const weekendCount: { [person: string]: number } = {};
    for (const [person, weekSet] of Object.entries(weekendsPerPerson)) {
      weekendCount[person] = weekSet.size;
    }
    
    this.weekendStats = Object.entries(weekendCount)
      .map(([name, value], index) => ({ name, value, index }))
      .sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        return b.index - a.index; // Plus récent en premier lors d'égalité
      })
      .map(({ name, value }) => ({ name, value }));
  }

  formatLabel(label: string): string {
    const width = window.innerWidth;
    if (width <= 576) {
      return label.length > 10 ? label.substring(0, 10) + '...' : label;
    }
    return label.length > 20 ? label.substring(0, 20) + '...' : label;
  }
}
