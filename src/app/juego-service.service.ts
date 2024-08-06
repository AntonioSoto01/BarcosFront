import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ResultadoTurno } from './resultado-turno';
import { Casilla } from './casilla';
import { environment } from 'src/environments/environment';
import { Partida } from './partida';
import { Jugador } from './jugador';
import { Usuario } from './usuario';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class JuegoService {


  private apiUrlSimple = environment.apiUrlSimple;
  //private apiUrlSimple = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
  }

  iniciarJuego(): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrlSimple}/iniciar`);
  }

  cargarPartida(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlSimple}/cargar`, token);
  }

  getJugador(id: number): Observable<Jugador> {
    return this.http.get<Jugador>(`${this.apiUrlSimple}/jugador/${id}`);
  }

  realizarTurnoMaquina(partidaId: number): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('partidaId', partidaId.toString());

    return this.http.post<ResultadoTurno>(
      `${this.apiUrlSimple}/realizar-turno-maquina`,
      body,
    );
  }

  realizarTurnoJugador(
    casilla: Casilla,
    partidaId: number,
    rol: string,
  ): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('casilla', casilla.cadena);
    body.append('partidaId', partidaId.toString());
    body.append('rol', rol);

    return this.http.post<ResultadoTurno>(
      `${this.apiUrlSimple}/realizar-turno-jugador`,
      body,
    );
  }

  obtenerUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSimple}/user`);
  }

  loginGoogle(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSimple}/oauth2/authorization/google`,
    );
  }

  loginGithub(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSimple}/oauth2/authorization/github`,
    );
  }

  logOut() {
    localStorage.removeItem('token');
    // localStorage.removeItem('partida');
    return this.http.post(`${this.apiUrlSimple}/logout`, {});
  }

  registro(usuario: Usuario, contrasena: string): Observable<any> {
    const payload = { usuario, contrasena };

    return this.http.post<any>(`${this.apiUrlSimple}/registro`, payload);
  }

  login(usuario: Usuario) {
    return this.http.post<any>(`${this.apiUrlSimple}/login`, usuario);
  }
  start2PlayersGame(email: string) {
    return this.http.post<any>(`${this.apiUrlSimple}/iniciar-juego-2-jugadores`, email);
  }
  csrf() {
    return this.http.get<any>(`${this.apiUrlSimple}/csrf`);
  }
  getSubscriptionsFromServer(id: number) {
    return this.http.get<string[]>(`${this.apiUrlSimple}/subscriptions/${id}`);
  }

}
