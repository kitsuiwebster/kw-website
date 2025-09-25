# Cards System Documentation

## Overview
The cards system is a geographic learning application featuring interactive cards representing various geographical features like countries, cities, mountains, lakes, rivers, seas, oceans, deserts, and islands.

## Architecture

### Components
- **CardComponent** (`src/app/components/card/card.component.ts`): Individual card display component
- **CardsComponent** (`src/app/pages/cards/cards.component.ts`): Main cards page with filtering and display logic

### Data Structure

Each card follows this interface:
```typescript
interface Card {
  type: string;           // Card category (Pays, Ville, Sommet, Lac, etc.)
  emoji: string;          // Representative emoji
  image: string;          // Path to card image
  nom: string;            // Name in French
  localisation: string;   // Geographic location
  continent: string;      // Continent for filtering (Afrique, Asie, Europe, etc.)
  
  // Type-specific properties:
  hauteur?: string;       // Mountains
  surface?: string;       // Lakes, countries
  population?: string;    // Cities, countries  
  superficie?: string;    // Countries, islands
  profondeur?: string;    // Seas, oceans
  longueur?: string;      // Rivers
}
```

### Card Types & Colors
- **Sommet** (Mountains): Brown (#A0522D)
- **Lac** (Lakes): Blue (#4169E1) 
- **Ville** (Cities): Orange (#FFA500)
- **Pays** (Countries): Green (#228B22)
- **Mer** (Seas): Light Cyan (#20B2AA)
- **Océan** (Oceans): Steel Blue (#4682B4)
- **Fleuve** (Rivers): Cadet Blue (#5F9EA0)
- **Désert** (Deserts): Chocolate (#D2691E)
- **Île** (Islands): Medium Sea Green (#3CB371)

## Features

### Filtering System
- **By Type**: Filter cards by geographic feature type
- **By Continent**: Filter by continent (Afrique, Asie, Europe, Amérique du Nord, Amérique du Sud, Océanie, Antarctique)
- **Search**: Text search across card names and locations

### Visual Design
- Color-coded cards with type-specific box shadows
- Small colored dot indicator (pastille) on each card
- Category labels displayed in bold with matching colors
- Hover effects with enhanced shadows

### Export Functionality
- Generate and download cards as images
- Batch export with ZIP compression

## File Locations

### Card Data
- Main data: `src/app/pages/cards/cards.component.ts` (lines ~14-1600+)
- All card data is embedded in the Angular component

### Images
- Card images: `public/assets/images/cards/[category]/[name].jpg`
- Categories: city, country, desert, island, lake, mountain, ocean, river, sea
- Default fallback: `public/assets/images/cards/default.jpg`

### Styling
- Card styles: `src/app/components/card/card.component.scss`
- Type-specific colors and hover effects
- Category text styling with `!important` to override defaults

## Important Notes

### Continent Data Integrity
- All cards MUST have the `continent` property defined for filtering to work
- Missing continent data causes cards to not appear in continent-specific filters
- Recently fixed 19+ cards that were missing continent information

### Color System Consistency  
- Each card type has a specific color used for:
  - Box shadow on hover
  - Colored dot indicator (pastille)
  - Category text color (bold)
- Colors must be consistent across all three elements

### Image Organization
- Images are organized by type in subdirectories
- Naming convention follows card names (kebab-case)
- Supports .jpg, .jpeg, .png formats

## Technical Implementation

### Component Communication
- Cards data is stored in the parent CardsComponent
- Individual CardComponent receives card data via `@Input()`
- Card display uses Angular data binding with proper typing

### Performance Considerations
- Large dataset (~150+ cards) uses virtual scrolling concepts
- Image lazy loading for better performance
- Efficient filtering using array methods

### Styling Architecture
- SCSS with nested selectors for type-specific styling
- CSS custom properties could be used for color theming
- Uses `!important` to override base styles where needed