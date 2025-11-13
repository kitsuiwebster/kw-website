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
  isCozybotPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isTasksPage = event.url === '/tasks' || event.url.startsWith('/tasks#');
        this.isDouzePage = event.url === '/douze';
        this.isVitrinePage = event.url === '/vitrine';
        this.isCozybotPage = event.url === '/cozybot' || event.url.startsWith('/cozybot?');
      }
    });
  }

  copyDiscordUsername(): void {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      const copiedMessage = document.createElement('div');
      copiedMessage.id = 'copiedMessage';
      copiedMessage.innerText = 'Copied to clipboard!';

      copiedMessage.style.position = 'fixed';
      copiedMessage.style.top = '40px';
      copiedMessage.style.left = '50%';
      copiedMessage.style.transform = 'translateX(-50%)';
      copiedMessage.style.color = 'red';
      copiedMessage.style.padding = '10px 20px';
      copiedMessage.style.borderRadius = '4px';
      copiedMessage.style.zIndex = '9999';

      document.body.appendChild(copiedMessage);
      setTimeout(() => {
        document.body.removeChild(copiedMessage);
      }, 3000);
    });
  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
