// Europe
export { franceCitiesData } from './france.data';
export { royaumeUniCitiesData } from './royaume-uni.data';
export { allemagneCitiesData } from './allemagne.data';
export { russieCitiesData } from './russie.data';

// Asie
export { japonCitiesData } from './japon.data';
export { indeCitiesData } from './inde.data';
export { chineCitiesData } from './chine.data';

// Amérique du Nord
export { etatsUnisCitiesData } from './etats-unis.data';

// Amérique du Sud
export { bresilCitiesData } from './bresil.data';

// Océanie
export { australieCitiesData } from './australie.data';

// Afrique
export { algerieCitiesData } from './algerie.data';
export { afriqueDuSudCitiesData } from './afrique-du-sud.data';
export { nigeriaCitiesData } from './nigeria.data';
export { republicDemocratiqueDuCongoCitiesData } from './republique-democratique-du-congo.data';
export { egypteCitiesData } from './egypte.data';
export { marocCitiesData } from './maroc.data';
export { kenyaCitiesData } from './kenya.data';
export { angolaCitiesData } from './angola.data';
export { ethiopieCitiesData } from './ethiopie.data';
export { coteDivoireCitiesData } from './cote-divoire.data';
export { soudanCitiesData } from './soudan.data';
export { senegalCitiesData } from './senegal.data';
export { ghanaCitiesData } from './ghana.data';
export { tunisieCitiesData } from './tunisie.data';

// Combined cities data
import { Card } from '../../interfaces/card.interface';
import { franceCitiesData } from './france.data';
import { royaumeUniCitiesData } from './royaume-uni.data';
import { allemagneCitiesData } from './allemagne.data';
import { russieCitiesData } from './russie.data';
import { japonCitiesData } from './japon.data';
import { indeCitiesData } from './inde.data';
import { chineCitiesData } from './chine.data';
import { etatsUnisCitiesData } from './etats-unis.data';
import { bresilCitiesData } from './bresil.data';
import { australieCitiesData } from './australie.data';
import { algerieCitiesData } from './algerie.data';
import { afriqueDuSudCitiesData } from './afrique-du-sud.data';
import { nigeriaCitiesData } from './nigeria.data';
import { republicDemocratiqueDuCongoCitiesData } from './republique-democratique-du-congo.data';
import { egypteCitiesData } from './egypte.data';
import { marocCitiesData } from './maroc.data';
import { kenyaCitiesData } from './kenya.data';
import { angolaCitiesData } from './angola.data';
import { ethiopieCitiesData } from './ethiopie.data';
import { coteDivoireCitiesData } from './cote-divoire.data';
import { soudanCitiesData } from './soudan.data';
import { senegalCitiesData } from './senegal.data';
import { ghanaCitiesData } from './ghana.data';
import { tunisieCitiesData } from './tunisie.data';

export const allCitiesData: Card[] = [
  // Europe
  ...franceCitiesData,
  ...royaumeUniCitiesData,
  ...allemagneCitiesData,
  ...russieCitiesData,
  
  // Asie
  ...japonCitiesData,
  ...indeCitiesData,
  ...chineCitiesData,
  
  // Amérique du Nord
  ...etatsUnisCitiesData,
  
  // Amérique du Sud
  ...bresilCitiesData,
  
  // Océanie
  ...australieCitiesData,
  
  // Afrique
  ...algerieCitiesData,
  ...afriqueDuSudCitiesData,
  ...nigeriaCitiesData,
  ...republicDemocratiqueDuCongoCitiesData,
  ...egypteCitiesData,
  ...marocCitiesData,
  ...kenyaCitiesData,
  ...angolaCitiesData,
  ...ethiopieCitiesData,
  ...coteDivoireCitiesData,
  ...soudanCitiesData,
  ...senegalCitiesData,
  ...ghanaCitiesData,
  ...tunisieCitiesData
];