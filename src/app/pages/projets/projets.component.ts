import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ProjetItem {
  title: string;
  description: string;
  link: string;
  date: string;
  techLogos: string[];
  external?: boolean;
}

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent {
  projets: ProjetItem[] = [
    {
      title: 'HackAPrompt 2023',
      description: 'HackAPrompt 2023: How I tricked the AI models.',
      link: '/hackaprompt',
      date: '2023-08-04',
      techLogos: [
        'assets/images/technos/chat-gpt.webp',
        'assets/images/technos/aicrowds.png',
        'assets/images/technos/huggingface.png'
      ],
      external: false
    },
    {
      title: 'CozyBot',
      description: 'Discord bot for cozy ambiences with rich sound commands and a gamified listening experience.',
      link: '/cozybot',
      date: 'Live',
      techLogos: [
        'assets/images/technos/python.webp',
        'assets/images/technos/docker.webp',
        'assets/images/technos/fastapi.svg',
        'assets/images/technos/uvicorn.png',
        'assets/images/technos/nginx.webp',
        'assets/images/technos/github.svg',
        'assets/images/technos/gh-actions.png',
        'assets/images/technos/bash.webp',
        'assets/images/technos/couchdb.webp',
        'assets/images/technos/kuma.png'
      ],
      external: false
    },
    {
      title: 'Palma Project',
      description: 'Global palm species encyclopedia and dataset platform powered by Palma-1.0 biodiversity data.',
      link: 'https://palma-encyclopedia.com/',
      date: 'Live',
      techLogos: [
        'assets/images/technos/huggingface.png',
        'assets/images/technos/angular.png',
        'assets/images/technos/node.webp',
        'assets/images/technos/ts.webp',
        'assets/images/technos/sass.webp',
        'assets/images/technos/html.webp',
        'assets/images/technos/bash.webp'
      ],
      external: true
    }
  ];
}
