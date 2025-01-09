import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  copyDiscordUsername(): void {
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
