import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';

@Component({
  selector: 'app-hackaprompt',
  standalone: true,
  templateUrl: './hackaprompt.component.html',
  styleUrls: ['./hackaprompt.component.scss'],
})
export class HackapromptComponent implements OnInit {
  gistContent: string = '';

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    const rawGistUrl =
      'https://gist.githubusercontent.com/kitsuiwebster/8102d128c174d3f93ed1904b9a2953ec/raw';

    this.http.get(rawGistUrl, { responseType: 'text' }).subscribe(
      async (content) => {
        this.gistContent = await marked(content);
      },
      (error) => {
        console.error('Erreur lors du chargement du Gist:', error);
      }
    );
  }
}
