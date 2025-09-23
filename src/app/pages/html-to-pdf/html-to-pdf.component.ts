import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlToPdfService } from '../../services/html-to-pdf.service';

@Component({
  selector: 'app-html-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './html-to-pdf.component.html',
  styleUrl: './html-to-pdf.component.scss'
})
export class HtmlToPdfComponent {
  htmlContent: string = '';
  isConverting: boolean = false;

  constructor(private htmlToPdfService: HtmlToPdfService) {}

  async convertToPdf(): Promise<void> {
    if (!this.htmlContent.trim()) {
      alert('Veuillez saisir du contenu HTML');
      return;
    }

    this.isConverting = true;

    try {
      await this.htmlToPdfService.convertHtmlToPdf(this.htmlContent);
    } catch (error) {
      console.error('Erreur dans le composant:', error);
      alert('Erreur lors de la conversion en PDF');
    } finally {
      this.isConverting = false;
    }
  }
}