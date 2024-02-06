import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    GeneralComponent,
    RegistroComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  providers: [JuegoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
