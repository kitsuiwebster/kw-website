import { Component, Input, HostListener } from '@angular/core';
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
  
  isModalOpen = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeModal();
    }
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

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