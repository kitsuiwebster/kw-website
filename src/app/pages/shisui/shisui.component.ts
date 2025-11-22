// shisui.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour ngModel
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

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
  found: boolean;
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
export class ShisuiComponent implements OnInit {
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
  
  // Statistiques weekend générales
  weekendStats: { name: string; value: number }[] = [];
  
  // Nouvelle propriété pour la recherche par date
  searchDate: string = '';
  dateSearchResult: DateSearchResult | null = null;
  
  // Propriété pour le filtre de type de table
  selectedTableType: string = 'all';
  
  loading = true;

  constructor(private http: HttpClient) {
    this.updateChartSize();
  }

  ngOnInit(): void {
    this.fetchData();
    this.updateChartSize();
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
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.loading = false;
      }
    });
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

  // Nouvelle méthode pour rechercher par date
  searchByDate(): void {
    if (!this.searchDate) {
      this.dateSearchResult = null;
      return;
    }

    // Convertir la date du format YYYY-MM-DD vers DD/MM/YYYY
    const [year, month, day] = this.searchDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Chercher l'entrée correspondante
    const entry = this.entries.find(e => e.date === formattedDate);

    if (entry) {
      // Utiliser des Sets pour éviter les doublons
      const countriesSet = new Set<string>();
      const citiesSet = new Set<string>();
      const peopleSet = new Set<string>();
      
      if (entry.cn) countriesSet.add(entry.cn);
      if (entry.c1) countriesSet.add(entry.c1);
      if (entry.c2) countriesSet.add(entry.c2);
      if (entry.c3) countriesSet.add(entry.c3);
      
      // Séparer les villes si plusieurs dans une même cellule
      if (entry.cityNight) {
        entry.cityNight.split(' ').forEach(city => {
          if (city.trim()) citiesSet.add(city.trim());
        });
      }
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
      
      // Ajouter les personnes en évitant les doublons
      entry.peopleNight.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      entry.people1.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      entry.people2.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      entry.people3.forEach(person => {
        if (person && person.trim()) peopleSet.add(person.trim());
      });
      
      this.dateSearchResult = {
        date: formattedDate,
        countries: Array.from(countriesSet),
        cities: Array.from(citiesSet),
        people: Array.from(peopleSet),
        found: true
      };
    } else {
      this.dateSearchResult = {
        date: formattedDate,
        countries: [],
        cities: [],
        people: [],
        found: false
      };
    }
  }

  // Méthode pour effacer la recherche
  clearSearch(): void {
    this.searchDate = '';
    this.dateSearchResult = null;
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
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
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
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  computeFlagStats(): void {
    const count: { [flag: string]: number } = {};
    for (const entry of this.entries) {
      // Ne compter qu'une seule fois par pays par jour
      const flags = new Set<string>();
      if (entry.cn) flags.add(entry.cn);
      if (entry.c1) flags.add(entry.c1);
      if (entry.c2) flags.add(entry.c2);
      if (entry.c3) flags.add(entry.c3);
      
      for (const flag of flags) {
        count[flag] = (count[flag] || 0) + 1;
      }
    }
    this.flagStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  computePeopleByCountryStats(): void {
    this.peopleByCountryStats = {};
    
    // Collecter tous les pays uniques
    const allCountries = new Set<string>();
    for (const entry of this.entries) {
      if (entry.cn) allCountries.add(entry.cn);
      if (entry.c1) allCountries.add(entry.c1);
      if (entry.c2) allCountries.add(entry.c2);
      if (entry.c3) allCountries.add(entry.c3);
    }
    
    for (const country of allCountries) {
      const countForCountry: { [person: string]: number } = {};
      
      for (const entry of this.entries) {
        // Collecter toutes les personnes pour ce pays dans cette entrée (éviter les doublons)
        const peopleInCountryThisDay = new Set<string>();
        
        // Associer les personnes au bon pays
        if (entry.cn === country) {
          entry.peopleNight.forEach(person => {
            if (person && person.trim()) {
              peopleInCountryThisDay.add(person.trim());
            }
          });
        }
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
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
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
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
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
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
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
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value),
        countries: Object.entries(countryCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value),
        people: Object.entries(peopleCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
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
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
      } else {
        this.weekendStatsByYear[year] = [];
      }
    }
  }

  getCountriesWithPeople(): string[] {
    return Object.keys(this.peopleByCountryStats);
  }
  
  getYears(): string[] {
    return Object.keys(this.yearlyStats).sort((a, b) => b.localeCompare(a)); // Tri décroissant
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
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Statistiques des pays de nuit (colonne C)
    const nightCountryCount: { [country: string]: number } = {};
    for (const entry of this.entries) {
      if (entry.cn && entry.cn.trim()) {
        nightCountryCount[entry.cn] = (nightCountryCount[entry.cn] || 0) + 1;
      }
    }
    this.nightCountryStats = Object.entries(nightCountryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

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
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
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
    
    const weekendCount: { [person: string]: number } = {};
    
    for (const entry of this.entries) {
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
        
        for (const person of people) {
          if (person) {
            weekendCount[person] = (weekendCount[person] || 0) + 1;
          }
        }
      }
    }
    
    this.weekendStats = Object.entries(weekendCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  formatLabel(label: string): string {
    const width = window.innerWidth;
    if (width <= 576) {
      return label.length > 10 ? label.substring(0, 10) + '...' : label;
    }
    return label.length > 20 ? label.substring(0, 20) + '...' : label;
  }
}