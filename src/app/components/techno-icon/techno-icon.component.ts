import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'techno-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="techno-icon">
      <img [src]="src" [alt]="alt" class="techno-icon-image" />
      <p class="techno-icon-name">{{name}}</p>
      <div class='techno-icon-star-container'>
        <img loading="lazy" [src]="star1" alt="rating star" class="techno-icon-star" />
        <img loading="lazy" [src]="star2" alt="rating star" class="techno-icon-star" />
        <img loading="lazy" [src]="star3" alt="rating star" class="techno-icon-star" />
        <img loading="lazy" [src]="star4" alt="rating star" class="techno-icon-star" />
        <img loading="lazy" [src]="star5" alt="rating star" class="techno-icon-star" />
      </div>
    </div>
  `,
  styleUrls: ['./techno-icon.component.scss']
})
export class TechnoIconComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() name: string = '';
  @Input() star1: string = '';
  @Input() star2: string = '';
  @Input() star3: string = '';
  @Input() star4: string = '';
  @Input() star5: string = '';
}