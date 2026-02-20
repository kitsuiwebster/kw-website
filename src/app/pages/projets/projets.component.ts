import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ProjetItem {
  title: string;
  description: string;
  link: string;
  date: string;
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
      external: false
    },
    {
      title: 'CozyBot',
      description: 'AI-powered Discord bot platform with live dashboard and automation workflows.',
      link: 'https://cozybot.online/cozybot',
      date: 'Live',
      external: true
    },
    {
      title: 'Palma Project',
      description: 'Palma Encyclopedia: structured content platform and knowledge base website.',
      link: 'https://palma-encyclopedia.com/',
      date: 'Live',
      external: true
    }
  ];
}
