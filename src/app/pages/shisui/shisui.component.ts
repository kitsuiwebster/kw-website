import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface Entry {
  date: string;
  flag: string;
  city: string;
  people: string[];
}

@Component({
  selector: 'app-shisui',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './shisui.component.html',
  styleUrls: ['./shisui.component.scss'],
})
export class ShisuiComponent implements OnInit {
  // Utiliser une chaîne simple pour la position de la légende
  legendPosition = 'right';
  
  // Utiliser une chaîne pour le schéma de couleurs
  colorScheme = 'vivid';
  view: [number, number] = [800, 400];
  
  entries: Entry[] = [];
  cityStats: { name: string; value: number }[] = [];
  peopleStats: { name: string; value: number }[] = [];
  flagStats: { name: string; value: number }[] = [];
  
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
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
        flag: row[1]?.trim() || '',
        city: row[2]?.trim() || '',
        people: row[3] ? row[3].split(' ').map((p) => p.trim()).filter(p => p) : [],
      }));

      this.computeAllStats();
    }
  }

  computeAllStats(): void {
    this.computeCityStats();
    this.computePeopleStats();
    this.computeFlagStats();
  }

  computeCityStats(): void {
    const count: { [city: string]: number } = {};
    for (const entry of this.entries) {
      if (entry.city) {
        count[entry.city] = (count[entry.city] || 0) + 1;
      }
    }
    this.cityStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Tri par ordre décroissant
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
      .sort((a, b) => b.value - a.value); // Tri par ordre décroissant
  }

  computeFlagStats(): void {
    const count: { [flag: string]: number } = {};
    for (const entry of this.entries) {
      if (entry.flag) {
        count[entry.flag] = (count[entry.flag] || 0) + 1;
      }
    }
    this.flagStats = Object.entries(count)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Tri par ordre décroissant
  }

  // Méthode pour formater les étiquettes des graphiques
  formatLabel(label: string): string {
    return label.length > 20 ? label.substring(0, 20) + '...' : label;
  }
}