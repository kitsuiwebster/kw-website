import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-douze',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './douze.component.html',
  styleUrls: ['./douze.component.scss']
})
export class DouzeComponent {
  isGiftOpened = false;

  openGift() {
    this.isGiftOpened = true;
  }

  downloadApk() {
    const link = document.createElement('a');
    link.href = 'assets/apk/hello-bubble.apk';
    link.download = 'hello-bubble.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}