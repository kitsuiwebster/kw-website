import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cozybot-project',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cozybot-project.component.html',
  styleUrls: ['./cozybot-project.component.scss']
})
export class CozybotProjectComponent {}
