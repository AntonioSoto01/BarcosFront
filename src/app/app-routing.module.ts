import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenComponent } from './token/token.component';
import { GeneralComponent } from './general/general.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'token', component: TokenComponent },
  { path: '', component: GeneralComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'confirmar', component: ConfirmarComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
