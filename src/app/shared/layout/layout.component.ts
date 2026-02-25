import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [RouterModule, CommonModule],
})
export class LayoutComponent {
  isTasksPage = false;
  isDouzePage = false;
  isVitrinePage = false;
  isLifePage = false;
  isLegalPage = false;
  showCopiedToast = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isTasksPage = event.url === '/tasks' || event.url.startsWith('/tasks#');
        this.isDouzePage = event.url === '/douze';
        this.isVitrinePage = event.url === '/vitrine';
        this.isLifePage = event.url === '/life' || event.url === '/shisui' || event.url.startsWith('/life?') || event.url.startsWith('/shisui?');
        this.isLegalPage = event.url === '/legal';
      }
    });
  }

  copyDiscordUsername(): void {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      this.showCopiedToast = true;
      setTimeout(() => {
        this.showCopiedToast = false;
      }, 2500);
    });
  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
