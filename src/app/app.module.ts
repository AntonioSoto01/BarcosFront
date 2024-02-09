import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JuegoService } from './juego-service.service';
import { TokenComponent } from './token/token.component';
import { GeneralComponent } from './general/general.component';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { RegistroComponent } from './registro/registro.component';
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { GlobalErrorHandler } from './global-error-handler';
import { ConfirmarComponent } from './confirmar/confirmar.component';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    GeneralComponent,
    RegistroComponent,
    LoginComponent,
    ConfirmarComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  providers: [JuegoService, { provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
