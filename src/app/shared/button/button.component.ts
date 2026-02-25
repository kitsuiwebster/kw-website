import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() routerLink?: string;
  @Input() href?: string;
  @Input() target?: string;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() label?: string;

  getButtonType(): 'router' | 'link' | 'button' {
    if (this.routerLink) return 'router';
    if (this.href) return 'link';
    return 'button';
  }

  getClasses(): { [key: string]: boolean } {
    return {
      [`btn-${this.variant}`]: true,
      [`btn-${this.size}`]: true,
      'btn-full-width': this.fullWidth,
      'btn-disabled': this.disabled
    };
  }
}
