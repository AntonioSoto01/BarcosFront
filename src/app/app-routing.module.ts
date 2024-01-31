import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenComponent } from './token/token.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: 'token', component: TokenComponent },
  { path: '', component: GeneralComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
