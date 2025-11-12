import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent {
  projets = [
    { title: 'HackAPrompt 2023', description: 'HackAPrompt 2023: How I tricked the AI models.', link: '/hackaprompt', date: '2023-08-04' }
  ];
}