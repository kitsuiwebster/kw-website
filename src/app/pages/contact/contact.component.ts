import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  isDiscordCopied = false;
  private discordToastTimeoutId?: number;

  copyDiscordUsername(): void {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      this.isDiscordCopied = true;
      if (this.discordToastTimeoutId) {
        window.clearTimeout(this.discordToastTimeoutId);
      }
      this.discordToastTimeoutId = window.setTimeout(() => {
        this.isDiscordCopied = false;
      }, 2200);
    });
  }
}
