import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card!: Card;
  @Input() id!: string;

  getCardInfo(): string {
    if (this.card.hauteur) return this.card.hauteur;
    if (this.card.surface) return this.card.surface;
    if (this.card.population && this.card.superficie) {
      return `${this.card.population} - ${this.card.superficie}`;
    }
    if (this.card.profondeur) return this.card.profondeur;
    if (this.card.longueur) return this.card.longueur;
    if (this.card.superficie) return this.card.superficie;
    return '';
  }
}