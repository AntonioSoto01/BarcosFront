import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jugador } from './jugador';
import { ResultadoTurno } from './resultado-turno';
import { Casilla } from './casilla';


@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  private apiUrl = 'http://localhost:8080/api/juego'; 

  constructor(private http: HttpClient) { }

  iniciarJuego(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${this.apiUrl}/iniciar`);
  }

  realizarTurnoMaquina(): Observable<ResultadoTurno> {
    return this.http.post<ResultadoTurno>(`${this.apiUrl}/realizar-turno-maquina`, {});
  }

  realizarTurnoJugador(casilla: Casilla): Observable<ResultadoTurno> {
    const body = new FormData();
    body.append('casilla', casilla.cadena);
  
    return this.http.post<ResultadoTurno>(`${this.apiUrl}/realizar-turno-jugador`, body);
  }
  
}
