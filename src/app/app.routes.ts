import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HackapromptComponent } from './pages/projets/hackaprompt/hackaprompt.component';
import { CozybotComponent } from './pages/cozybot/cozybot.component';
import { CozypointsComponent } from './pages/cozypoints/cozypoints.component';
import { ShisuiComponent } from './pages/shisui/shisui.component';
import { DecoderComponent } from './pages/decode/decoder.component';
import { HtmlToPdfComponent } from './pages/html-to-pdf/html-to-pdf.component';
import { UnifiedTasksComponent } from './pages/unified-tasks/unified-tasks.component';
import { MenuComponent } from './pages/menu/menu.component';
import { DouzeComponent } from './pages/douze/douze.component';
import { VitrineComponent } from './pages/vitrine/vitrine.component';
import { AffaireComponent } from './pages/affaire/affaire.component';
import { SitesComponent } from './pages/sites/sites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'hackaprompt', component: HackapromptComponent },
  { path: 'cozybot', component: CozybotComponent },
  { path: 'cozypoints', component: CozypointsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'tasks', component: UnifiedTasksComponent },
  // Redirect old routes
  { path: 'articles', redirectTo: 'projets' },
  { path: 'tasks/kitsui', redirectTo: 'tasks' },
  { path: 'tasks/bubble', redirectTo: 'tasks' },
  { path: 'life', component: ShisuiComponent },
  // Redirect old shisui route
  { path: 'shisui', redirectTo: 'life' },
  { path: 'decoder', component: DecoderComponent },
  { path: 'html-to-pdf', component: HtmlToPdfComponent },
  { path: 'douze', component: DouzeComponent },
  { path: 'vitrine', component: VitrineComponent },
  { path: 'affaire', component: AffaireComponent },
  { path: 'sites', component: SitesComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'notfound' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
