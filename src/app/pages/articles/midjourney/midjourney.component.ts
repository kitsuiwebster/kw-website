import { Component, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { GlobalWorkerOptions } from 'pdfjs-dist';

@Component({
  selector: 'app-midjourney',
  standalone: true,
  imports: [PdfViewerModule, CommonModule],
  template: `
    <div class="container">
      <div class="pdf-container">
        <pdf-viewer
          [src]="pdfSrc"
          [render-text]="true"
          [original-size]="false"
          [show-all]="true"
          [zoom]="1"
          [rotation]="0"
          [external-link-target]="'blank'"
          [autoresize]="true"
          [fit-to-page]="false"
          class="pdf-viewer"
          (after-load-complete)="onLoadComplete($event)"
          (error)="onError($event)"
        ></pdf-viewer>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        min-width: 800px; /* Larger default size for PC/TV */
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
      }

      .pdf-container {
        width: 100%;
        min-width: 780px; /* Adjusted to match container */
        min-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f5f5f5;
        border-radius: 8px;
        overflow: hidden;
      }

      .pdf-viewer {
        width: 100%;
        min-width: 760px; /* Adjusted to match container */
        max-width: 1000px;
        min-height: 90vh;
        display: block;
      }

      /* Large screens (PC/TV) */
      @media screen and (min-width: 1024px) {
        .container {
          min-width: 1000px;
        }

        .pdf-container {
          min-width: 980px;
        }

        .pdf-viewer {
          min-width: 960px;
        }
      }

      /* Tablets */
      @media screen and (max-width: 1023px) {
        .container {
          min-width: 700px;
        }

        .pdf-container {
          min-width: 680px;
        }

        .pdf-viewer {
          min-width: 660px;
        }
      }

      /* Mobile devices */
      @media screen and (max-width: 768px) {
        .container {
          min-width: 300px;
          padding: 10px;
        }

        .pdf-container {
          min-width: 280px;
        }

        .pdf-viewer {
          min-width: 260px;
        }
      }
    `,
  ],
})
export class MidjourneyComponent implements OnInit {
  pdfSrc = '/assets/midjourney.pdf';
  totalPages = 0;

  constructor() {
    GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  ngOnInit() {
    console.log('Component initialized');
  }

  onLoadComplete(pdf: any) {
    this.totalPages = pdf.numPages;
    console.log('PDF loaded successfully', pdf);
  }

  onError(error: any) {
    console.error('Error loading PDF:', error);
  }
}
