import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  title: string;
  path: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  publicItems: MenuItem[] = [
    {
      title: 'Home',
      path: '/',
      description: 'Main homepage',
      category: 'Public'
    },
    {
      title: 'Projets',
      path: '/projets',
      description: 'All projects list',
      category: 'Public'
    },
    {
      title: 'CozyBot',
      path: '/cozybot',
      description: 'Discord bot leaderboard',
      category: 'Public'
    },
    {
      title: 'Contact',
      path: '/contact',
      description: 'Contact page',
      category: 'Public'
    }
  ];

  privateItems: MenuItem[] = [
    {
      title: 'Tasks',
      path: '/tasks',
      description: 'Unified task manager',
      category: 'Tools'
    },
    {
      title: 'Life Statistics',
      path: '/life',
      description: 'Life stats tracking',
      category: 'Tools'
    },
    {
      title: 'Decoder',
      path: '/decoder',
      description: 'Decoding tool',
      category: 'Tools'
    },
    {
      title: 'HTML to PDF',
      path: '/html-to-pdf',
      description: 'HTML to PDF converter',
      category: 'Tools'
    },
    {
      title: 'Sites',
      path: '/sites',
      description: 'Portfolio de mes réalisations',
      category: 'Tools'
    }
  ];

}