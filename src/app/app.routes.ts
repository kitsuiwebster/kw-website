import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HackapromptComponent } from './pages/projets/hackaprompt/hackaprompt.component';
import { ShisuiComponent } from './pages/shisui/shisui.component';
import { DecoderComponent } from './pages/decode/decoder.component';
import { HtmlToPdfComponent } from './pages/html-to-pdf/html-to-pdf.component';
import { UnifiedTasksComponent } from './pages/unified-tasks/unified-tasks.component';
import { MenuComponent } from './pages/menu/menu.component';
import { DouzeComponent } from './pages/douze/douze.component';
import { CozybotProjectComponent } from './pages/projets/cozybot/cozybot-project.component';
import { PalmaProjectComponent } from './pages/projets/palma/palma-project.component';
import { LegalComponent } from './pages/legal/legal.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'hackaprompt', component: HackapromptComponent },
  { path: 'cozybot', component: CozybotProjectComponent },
  { path: 'palma-project', component: PalmaProjectComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
  { path: 'tasks', component: UnifiedTasksComponent, canActivate: [authGuard] },
  // Redirect old routes
  { path: 'articles', redirectTo: 'projets' },
  { path: 'tasks/kitsui', redirectTo: 'tasks' },
  { path: 'tasks/bubble', redirectTo: 'tasks' },
  { path: 'life', component: ShisuiComponent, canActivate: [authGuard] },
  // Redirect old shisui route
  { path: 'shisui', redirectTo: 'life' },
  { path: 'decoder', component: DecoderComponent },
  { path: 'html-to-pdf', component: HtmlToPdfComponent },
  { path: 'douze', component: DouzeComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
