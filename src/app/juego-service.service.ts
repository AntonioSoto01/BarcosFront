import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoTurno } from './resultado-turno';
import { Casilla } from './casilla';
import { environment } from 'src/environments/environment';
import { Partida } from './partida';
import { Jugador } from './jugador';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class JuegoService {
  private apiUrl = environment.apiUrl;
  private apiUrlSimple = environment.apiUrlSimple;

  constructor(private http: HttpClient) {}

  iniciarJuego(): Observable<Partida> {
    const headers = this.getOptionalJtw();
    return this.http.get<Partida>(`${this.apiUrl}/iniciar`, { headers });
  }

  cargarPartida(token: any): Observable<Partida> {
    const headers = this.getOptionalJtw();
    return this.http.post<Partida>(
      `${this.apiUrl}/cargar`,
      { token },
      { headers },
    );
  }

  getJugador(id: number): Observable<Jugador> {
    return this.http.get<Jugador>(`${this.apiUrlSimple}/jugador/${id}`);
  }

  realizarTurnoMaquina(partidaId: number): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('partidaId', partidaId.toString());
    const headers = this.getOptionalJtw();
    return this.http.post<ResultadoTurno>(
      `${this.apiUrl}/realizar-turno-maquina`,
      body,
      { headers },
    );
  }

  realizarTurnoJugador(
    casilla: Casilla,
    partidaId: number,
  ): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('casilla', casilla.cadena);
    body.append('partidaId', partidaId.toString());
    const headers = this.getOptionalJtw();
    return this.http.post<ResultadoTurno>(
      `${this.apiUrl}/realizar-turno-jugador`,
      body,
      { headers },
    );
  }

  obtenerUsuario(): Observable<any> {
    const headers = this.getJwt();
    return this.http.get<any>(`${this.apiUrlSimple}/user`, { headers });
  }

  loginGoogle(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSimple}/oauth2/authorization/google`,
    );
  }

  logOut() {
    localStorage.removeItem('token');
    return this.http.post('/api/logout', {});
  }

  getOptionalJtw(): {} {
    const token = localStorage.getItem('token');

    if (token) {
      return this.getJwt();
    } else {
      return {};
    }
  }

  getJwt() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return headers;
  }

  cambiarToken(): Observable<any> {
    const headers = this.getJwt();
    return this.http.get(`${this.apiUrlSimple}/cambiarToken`, {
      headers,
      responseType: 'text',
    });
  }

  registro(usuario: Usuario, contrasena: string): Observable<string> {
    // Create a payload object containing both usuario and contrasena
    const payload = { usuario, contrasena };

    // Make an HTTP POST request with the payload as the request body
    return this.http.post<any>(`${this.apiUrlSimple}/registro`, payload);
  }
}
