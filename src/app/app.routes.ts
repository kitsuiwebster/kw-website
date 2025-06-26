import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HackapromptComponent } from './pages/articles/hackaprompt/hackaprompt.component';
import { MidjourneyComponent } from './pages/articles/midjourney/midjourney.component';
import { ShisuiComponent } from './pages/shisui/shisui.component';
import { DecoderComponent } from './pages/decode/decoder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'hackaprompt', component: HackapromptComponent },
  { path: 'midjourney', component: MidjourneyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shisui', component: ShisuiComponent },
  { path: 'decoder', component: DecoderComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'notfound' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
