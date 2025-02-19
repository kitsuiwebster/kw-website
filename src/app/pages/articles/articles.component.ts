import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  articles = [
    { title: 'HackAPrompt 2023', description: 'HackAPrompt 2023: How I tricked the AI models.', link: '/hackaprompt', date: '2023-08-04' },
    { title: 'Midjourney Parameters', description: 'Most useful Midjourney Parameters explained.', link: '/midjourney', date: '2024-12-28' }
  ];
}