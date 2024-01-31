import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JuegoService } from './juego-service.service';
import { TokenComponent } from './token/token.component';
import { GeneralComponent } from './general/general.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, TokenComponent, GeneralComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [JuegoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
