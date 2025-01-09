import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [RouterModule],
})
export class LayoutComponent {
  copyDiscordUsername() {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      const copiedMessage = document.createElement('div');
      copiedMessage.id = 'copiedMessage';
      copiedMessage.innerText = 'Copied to clipboard!';
      document.body.appendChild(copiedMessage);
      setTimeout(() => {
        document.body.removeChild(copiedMessage);
      }, 3000);
    });
  }
}


