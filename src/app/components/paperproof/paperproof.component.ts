import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'paper-proof',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paperproof">
      <img [src]="src" [alt]="alt" class="paperproof-image" />
      <p class="paperproof-date">{{ date }}</p>
    </div>
  `,
  styleUrls: ['./paperproof.component.scss']
})
export class PaperProofComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() date: string = '';
}
