import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JuegoService } from './juego-service.service';
import { TokenComponent } from './token/token.component';
import { GeneralComponent } from './general/general.component';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { RegistroComponent } from './registro/registro.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import { ApiUrlInterceptor } from './api-url.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { CsrfTokenInterceptor } from './csrfTokenInterceptor';
import { CookieService } from 'ngx-cookie-service';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    GeneralComponent,
    RegistroComponent,
    LoginComponent,
    ConfirmarComponent,
    ProfileComponent,
    SearchComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientXsrfModule.withOptions({headerName: 'X-Csrf-Token',}),
  ],
  providers: [
    JuegoService,
    CookieService,
    //{ provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true,
    },{provide:HTTP_INTERCEPTORS,
    useClass:CsrfTokenInterceptor,
    multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
