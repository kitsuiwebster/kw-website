import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-decoder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './decoder.component.html',
  styleUrls: ['./decoder.component.scss'],
})
export class DecoderComponent {
  inputMessage = '';
  secretKey = '';
  result = signal(`Result`);
  copyButtonText = signal('Copy');

  decode(): void {
    const message = this.inputMessage.trim();
    const key = this.secretKey.trim();

    if (!message && !key) {
      this.result.set(`Result`);
      return;
    }

    if (!key) {
      this.result.set('Result');
      return;
    }

    if (!message) {
      this.result.set('Result');
      return;
    }

    try {
      // Nettoie le message
      const clean = message.replace(/[✨🔐]/g, '').trim();

      if (!clean) {
        this.result.set('Message vide après nettoyage');
        return;
      }

      // Décode Base64
      const decoded = atob(clean);

      // Déchiffre avec XOR
      const decrypted = this.simpleXOR(decoded, key);

      this.result.set(decrypted);
    } catch (error) {
      this.result.set('Incorrect');
    }
  }

  private simpleXOR(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  copyResult(): void {
    const resultText = this.result();
    if (resultText && !this.isWaiting() && !this.isError()) {
      navigator.clipboard.writeText(resultText).then(() => {
        this.copyButtonText.set('Copied!');
        setTimeout(() => {
          this.copyButtonText.set('Copy');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = resultText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        this.copyButtonText.set('Copied!');
        setTimeout(() => {
          this.copyButtonText.set('Copy');
        }, 2000);
      });
    }
  }

  shouldShowCopyButton(): boolean {
    return this.isSuccess() && this.result().trim().length > 0;
  }

  isSuccess(): boolean {
    const resultText = this.result();
    return (
      !resultText.includes('Message vide') &&
      resultText.length > 0 &&
      !resultText.includes('🔑') &&
      !resultText.includes('Result')
    );
  }

  isError(): boolean {
    return this.result().includes('Incorrect');
  }

  isWaiting(): boolean {
    const resultText = this.result();
    return (
      resultText.includes('Result') ||
      resultText.includes('Il faut') ||
      resultText.includes('Message vide')
    );
  }
}