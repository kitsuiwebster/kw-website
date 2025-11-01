import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  url?: string;
  images: string[];
  category: string;
  status: string;
}

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent {
  currentImageIndex: { [key: number]: number } = {};
  
  projects: Project[] = [
    {
      title: 'Palma Encyclopedia',
      description: 'Encyclopédie interactive dédiée aux espèces de palmiers du monde entier',
      url: 'https://palma-encyclopedia.com',
      images: [
        'assets/images/sites/palma/00.png',
        'assets/images/sites/palma/07.png',
        'assets/images/sites/palma/03.png',
        'assets/images/sites/palma/11.png',
        'assets/images/sites/palma/01.png',
        'assets/images/sites/palma/09.png',
        'assets/images/sites/palma/05.png',
        'assets/images/sites/palma/12.png',
        'assets/images/sites/palma/02.png',
        'assets/images/sites/palma/08.png',
        'assets/images/sites/palma/04.png',
        'assets/images/sites/palma/10.png',
        'assets/images/sites/palma/06.png'
      ],
      category: 'Site Vitrine',
      status: 'En ligne'
    },
    {
      title: 'Maison Breval',
      description: 'Expertise horlogère haut de gamme - Vente et réparation de montres',
      images: [
        'assets/images/sites/maison-breval/00.png',
        'assets/images/sites/maison-breval/02.png',
        'assets/images/sites/maison-breval/01.png'
      ],
      category: 'Web App',
      status: 'En développement'
    },
    {
      title: 'VCG Recordz',
      description: 'Site vitrine d\'un label de musique avec artistes et releases',
      url: 'https://vcgrecordz.eu',
      images: [
        'assets/images/sites/vcg-recordz/00.png',
        'assets/images/sites/vcg-recordz/04.png',
        'assets/images/sites/vcg-recordz/02.png',
        'assets/images/sites/vcg-recordz/06.png',
        'assets/images/sites/vcg-recordz/01.png',
        'assets/images/sites/vcg-recordz/07.png',
        'assets/images/sites/vcg-recordz/03.png',
        'assets/images/sites/vcg-recordz/05.png'
      ],
      category: 'Site Vitrine',
      status: 'En ligne'
    },
    {
      title: 'MADPOOF',
      description: 'Site d\'un artiste indépendant de musique électronique avec son univers',
      url: 'https://madpoof.com',
      images: [
        'assets/images/sites/madpoof/00.png',
        'assets/images/sites/madpoof/05.png',
        'assets/images/sites/madpoof/02.png',
        'assets/images/sites/madpoof/07.png',
        'assets/images/sites/madpoof/01.png',
        'assets/images/sites/madpoof/04.png',
        'assets/images/sites/madpoof/06.png',
        'assets/images/sites/madpoof/03.png'
      ],
      category: 'Web App',
      status: 'En ligne'
    },
    {
      title: 'FlappyPoof',
      description: 'Jeu en ligne avec système de scores et classements',
      url: 'https://flappypoof.com',
      images: [
        'assets/images/sites/flappypoof/00.png',
        'assets/images/sites/flappypoof/08.png',
        'assets/images/sites/flappypoof/03.png',
        'assets/images/sites/flappypoof/10.png',
        'assets/images/sites/flappypoof/01.png',
        'assets/images/sites/flappypoof/06.png',
        'assets/images/sites/flappypoof/09.png',
        'assets/images/sites/flappypoof/02.png',
        'assets/images/sites/flappypoof/07.png',
        'assets/images/sites/flappypoof/04.png',
        'assets/images/sites/flappypoof/05.png'
      ],
      category: 'Web App',
      status: 'En ligne'
    }
  ];

  constructor() {
    // Initialiser l'index des images pour chaque projet
    this.projects.forEach((_, index) => {
      this.currentImageIndex[index] = 0;
    });
  }

  nextImage(projectIndex: number): void {
    const project = this.projects[projectIndex];
    this.currentImageIndex[projectIndex] = 
      (this.currentImageIndex[projectIndex] + 1) % project.images.length;
  }

  prevImage(projectIndex: number): void {
    const project = this.projects[projectIndex];
    this.currentImageIndex[projectIndex] = 
      this.currentImageIndex[projectIndex] === 0 
        ? project.images.length - 1 
        : this.currentImageIndex[projectIndex] - 1;
  }

  // Touch/Swipe handling
  onTouchStart(event: TouchEvent, projectIndex: number): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  onTouchEnd(event: TouchEvent, projectIndex: number): void {
    if (!this.touchStartX || !this.touchStartY) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - previous image
        this.prevImage(projectIndex);
      } else {
        // Swipe left - next image
        this.nextImage(projectIndex);
      }
    }

    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  private touchStartX: number = 0;
  private touchStartY: number = 0;
}