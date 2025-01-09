import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent},
  { path: 'articles', component: ArticlesComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'notfound' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
