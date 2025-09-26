# Shisui - Analyseur de Données de Voyage

## Vue d'ensemble

Shisui est un composant Angular de visualisation et d'analyse de données de voyage. Il affiche des statistiques détaillées sur les villes visitées, les pays, les personnes rencontrées depuis le 1er juillet 2018.

## Fonctionnalités principales

### 📊 Visualisations graphiques
- Graphiques en secteurs (pie charts) pour les villes, personnes et pays
- Interface responsive avec adaptation automatique de la taille
- Palette de couleurs arc-en-ciel personnalisée (45+ couleurs)

### 🔍 Recherche par date
- Recherche interactive par date avec sélecteur de date moderne
- Affichage des résultats sous forme de cartes stylisées
- Information sur les pays, villes et personnes pour une date donnée

### 🏆 Tableaux de statistiques

#### Tops généraux
- **Top Villes** : Classement des villes les plus visitées
- **Top Pays** : Classement des pays les plus fréquentés  
- **Top Personnes** : Classement des personnes les plus rencontrées

#### Statistiques avancées
- **Jours consécutifs** : Record de jours consécutifs par personne
- **Personnes par pays** : Statistiques détaillées par pays
- **Statistiques annuelles** : Analyse par année (villes, pays, personnes)

## Source de données

Les données proviennent d'une Google Sheets accessible via CSV :
- **Données principales** : Entrées quotidiennes (date, drapeaux, villes, personnes)
- **Données de référence** : Correspondance villes-drapeaux
- Format de date : `DD/MM/YYYY`

## Architecture technique

### Interfaces TypeScript
```typescript
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
```

### Fonctionnalités clés du composant
- `fetchVillesData()` : Chargement de la correspondance ville-drapeau
- `fetchData()` : Récupération des données principales
- `parseData()` : Traitement et parsing des données CSV
- `computeAllStats()` : Calcul de toutes les statistiques
- `searchByDate()` : Recherche par date spécifique

### Responsive design
- Adaptation automatique des graphiques selon la taille d'écran
- Interface mobile optimisée
- Légendes repositionnées dynamiquement

## Statistiques calculées

### Par fréquence
- Villes les plus visitées
- Pays les plus fréquentés
- Personnes les plus rencontrées

### Par temporalité
- Jours consécutifs maximum par personne
- Évolution par année
- Recherche ponctuelle par date

### Par géographie
- Répartition des personnes par pays
- Correspondance villes-drapeaux via données externes

## Interface utilisateur

### Design moderne
- Dégradés colorés et animations CSS
- Cartes avec effets hover
- Spinner de chargement animé
- Tableaux avec défilement sticky headers

### Responsivité
- Mobile first approach
- Grilles CSS adaptatives
- Optimisation touch pour mobiles
- Barres de défilement personnalisées

## Utilisation

1. **Chargement** : Les données se chargent automatiquement au démarrage
2. **Navigation** : Utilisation des différentes sections (graphiques, tableaux, recherche)
3. **Recherche** : Sélection d'une date pour voir les détails
4. **Analyse** : Consultation des tops et statistiques avancées

Le composant est conçu pour une utilisation autonome avec mise à jour automatique des données depuis les sources externes.