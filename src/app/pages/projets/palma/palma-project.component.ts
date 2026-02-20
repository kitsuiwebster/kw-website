import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-palma-project',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './palma-project.component.html',
  styleUrls: ['./palma-project.component.scss']
})
export class PalmaProjectComponent {}
