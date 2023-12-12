import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from './jugador';
import { ResultadoTurno } from './resultado-turno';
import { Casilla } from './casilla';
import { environment } from 'src/environments/environment';
import { Partida } from './partida';


@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  private apiUrl = environment.apiUrl;
  private apiUrlSimple = environment.apiUrlSimple;

  constructor(private http: HttpClient) { }

  iniciarJuego(): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrl}/iniciar`);
  }
  cargarPartida(): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrl}/cargar`);
  }
  realizarTurnoMaquina(partidaId: number): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('partidaId', partidaId.toString());

    return this.http.post<ResultadoTurno>(`${this.apiUrl}/realizar-turno-maquina`, body);
  }

  realizarTurnoJugador(casilla: Casilla, partidaId: number): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('casilla', casilla.cadena);
    body.append('partidaId', partidaId.toString());

    return this.http.post<ResultadoTurno>(`${this.apiUrl}/realizar-turno-jugador`, body);
  }
obtenerUsuario():Observable<any>{
 return  this.http.get<any>(`${this.apiUrlSimple}/user`);
}
loginGoogle(): Observable<any> {
  return this.http.get<any>(`${this.apiUrlSimple}/oauth2/authorization/google`);
}
}
