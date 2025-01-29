import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
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
}
