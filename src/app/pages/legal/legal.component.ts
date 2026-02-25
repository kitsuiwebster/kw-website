import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  imports: [RouterModule, ButtonComponent],
})
export class LegalComponent {}
