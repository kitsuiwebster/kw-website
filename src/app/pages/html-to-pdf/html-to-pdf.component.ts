import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  async convertToPdf(): Promise<void> {
    this.isConverting = true;

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const container = document.createElement('div');
      container.innerHTML = this.htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // Largeur A4
      container.style.background = 'white';
      container.style.padding = '10mm';
      container.style.boxSizing = 'border-box';
      
      document.body.appendChild(container);
      
      await new Promise(r => setTimeout(r, 1000));
      
      // Haute résolution pour éviter le flou
      const canvas = await html2canvas(container, {
        scale: 3, // Augmenter la résolution
        useCORS: true,
        logging: false,
        windowWidth: 794, // Largeur A4 en pixels à 96dpi
        width: 794,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(container);
      
      // PDF en haute qualité
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false // Pas de compression pour garder la qualité
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0); // Qualité maximale
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculer les dimensions pour garder le ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Si l'image est plus haute que la page, ajuster
      if (imgHeight > pdfHeight) {
        const ratio = pdfHeight / imgHeight;
        const finalWidth = imgWidth * ratio;
        const finalHeight = pdfHeight;
        const xOffset = (pdfWidth - finalWidth) / 2;
        
        pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save('document.pdf');
      
      this.isConverting = false;
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la conversion');
      this.isConverting = false;
    }
  }
}