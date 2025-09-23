import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlToPdfService {

  constructor() { }

  async convertHtmlToPdf(htmlContent: string): Promise<void> {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Créer un conteneur temporaire pour le HTML
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.background = 'white';
      container.style.padding = '10mm';
      container.style.boxSizing = 'border-box';
      
      document.body.appendChild(container);
      
      // Attendre que les styles se chargent
      await new Promise(r => setTimeout(r, 1000));
      
      // Convertir en canvas avec html2canvas
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        windowWidth: 794,
        width: 794,
        backgroundColor: '#ffffff'
      });
      
      // Supprimer le conteneur temporaire
      document.body.removeChild(container);
      
      // Créer le PDF avec jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false
      });
      
      // Convertir le canvas en image
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Ajuster l'image si elle dépasse la hauteur de la page
      if (imgHeight > pdfHeight) {
        const ratio = pdfHeight / imgHeight;
        const finalWidth = imgWidth * ratio;
        const finalHeight = pdfHeight;
        const xOffset = (pdfWidth - finalWidth) / 2;
        
        pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      // Télécharger le PDF
      pdf.save('document.pdf');
      
    } catch (error) {
      console.error('Erreur lors de la conversion HTML to PDF:', error);
      throw new Error('Erreur lors de la conversion en PDF');
    }
  }
}