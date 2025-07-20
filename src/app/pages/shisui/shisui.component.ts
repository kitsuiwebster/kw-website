// shisui.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour ngModel
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

interface Entry {
  date: string;
  flag: string[];
  cities: string[];
  people: string[];
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
  
  // Map pour stocker la correspondance ville -> drapeau
  cityFlagMap: Map<string, string> = new Map();
  
  // Statistiques par année
  yearlyStats: {
    [year: string]: {
      cities: { name: string; value: number }[];
      countries: { name: string; value: number }[];
      people: { name: string; value: number }[];
    }
  } = {};
  
  // Nouvelle propriété pour la recherche par date
  searchDate: string = '';
  dateSearchResult: DateSearchResult | null = null;
  
  loading = true;

  constructor(private http: HttpClient) {
    this.updateChartSize();
  }

  ngOnInit(): void {
    this.fetchVillesData().then(() => {
      this.fetchData();
    });
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

  async fetchVillesData(): Promise<void> {
    const villesUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTA7o5kyxn2EljodBFyQE2yG6t9s2Rg9gYrpuK080_TBhNRrygO7o_zk5cksPtcqo6py_onhoOdboAc/pub?gid=1937358699&single=true&output=csv';
    
    try {
      const csvText = await this.http.get(villesUrl, { responseType: 'text' }).toPromise();
      if (csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 1) {
          const [, ...dataLines] = lines;
          dataLines.forEach(line => {
            const [ville, pays] = line.split(',').map(s => s.trim());
            if (ville && pays) {
              this.cityFlagMap.set(ville, pays);
            }
          });
        }
      }
      console.log('Sheet villes chargée avec succès:', this.cityFlagMap.size, 'villes');
    } catch (error) {
      console.warn('La sheet villes n\'est pas disponible. Assurez-vous que le gid est correct.');
      // L'application continue de fonctionner sans les drapeaux
    }
  }

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
        flag: row[1] ? row[1].split(' ').map((f) => f.trim()).filter(f => f) : [],
        cities: row[2] ? row[2].split(' ').map((c) => c.trim()).filter(c => c) : [],
        people: row[3] ? row[3].split(' ').map((p) => p.trim()).filter(p => p) : [],
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
      this.dateSearchResult = {
        date: formattedDate,
        countries: entry.flag,
        cities: entry.cities,
        people: entry.people,
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
    this.computeYearlyStats();
  }

  computeCityStats(): void {
    const count: { [city: string]: number } = {};
    for (const entry of this.entries) {
      for (const city of entry.cities) {
        if (city) {
          count[city] = (count[city] || 0) + 1;
        }
      }
    }
    this.cityStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  computePeopleStats(): void {
    const count: { [person: string]: number } = {};
    for (const entry of this.entries) {
      for (const person of entry.people) {
        if (person) {
          count[person] = (count[person] || 0) + 1;
        }
      }
    }
    this.peopleStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  computeFlagStats(): void {
    const count: { [flag: string]: number } = {};
    for (const entry of this.entries) {
      for (const flag of entry.flag) {
        if (flag) {
          count[flag] = (count[flag] || 0) + 1;
        }
      }
    }
    this.flagStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }

  computePeopleByCountryStats(): void {
    this.peopleByCountryStats = {};
    
    for (const entry of this.entries) {
      for (const flag of entry.flag) {
        if (flag) {
          if (!this.peopleByCountryStats[flag]) {
            this.peopleByCountryStats[flag] = [];
          }
          
          const countForCountry: { [person: string]: number } = {};
          
          for (const otherEntry of this.entries) {
            if (otherEntry.flag.includes(flag)) {
              for (const person of otherEntry.people) {
                if (person) {
                  countForCountry[person] = (countForCountry[person] || 0) + 1;
                }
              }
            }
          }
          
          this.peopleByCountryStats[flag] = Object.entries(countForCountry)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
        }
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
    
    const allPeople = [...new Set(this.entries.flatMap(entry => entry.people))].filter(p => p);
    
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
        const personIsPresent = entry.people.includes(person);
        
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
      // Statistiques des villes
      const cityCount: { [city: string]: number } = {};
      for (const entry of yearEntries) {
        for (const city of entry.cities) {
          if (city) {
            cityCount[city] = (cityCount[city] || 0) + 1;
          }
        }
      }
      
      // Statistiques des pays
      const countryCount: { [country: string]: number } = {};
      for (const entry of yearEntries) {
        for (const country of entry.flag) {
          if (country) {
            countryCount[country] = (countryCount[country] || 0) + 1;
          }
        }
      }
      
      // Statistiques des personnes
      const peopleCount: { [person: string]: number } = {};
      for (const entry of yearEntries) {
        for (const person of entry.people) {
          if (person) {
            peopleCount[person] = (peopleCount[person] || 0) + 1;
          }
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

  getCountriesWithPeople(): string[] {
    return Object.keys(this.peopleByCountryStats);
  }
  
  getYears(): string[] {
    return Object.keys(this.yearlyStats).sort((a, b) => b.localeCompare(a)); // Tri décroissant
  }

  getAllUniqueCities(): string[] {
    const allCities = new Set<string>();
    for (const entry of this.entries) {
      for (const city of entry.cities) {
        if (city && city.trim()) {
          allCities.add(city.trim());
        }
      }
    }
    return Array.from(allCities).sort();
  }
  
  getCityWithFlag(cityName: string): string {
    const flag = this.cityFlagMap.get(cityName);
    return flag ? `${flag} ${cityName}` : cityName;
  }


  formatLabel(label: string): string {
    const width = window.innerWidth;
    if (width <= 576) {
      return label.length > 10 ? label.substring(0, 10) + '...' : label;
    }
    return label.length > 20 ? label.substring(0, 20) + '...' : label;
  }
}