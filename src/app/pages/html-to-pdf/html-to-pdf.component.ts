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
      container.style.width = '210mm';
      container.style.background = 'white';
      container.style.padding = '10mm';
      container.style.boxSizing = 'border-box';
      
      document.body.appendChild(container);
      
      await new Promise(r => setTimeout(r, 1000));
      
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        windowWidth: 794,
        width: 794,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(container);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
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