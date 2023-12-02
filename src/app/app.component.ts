import { Component, OnInit } from '@angular/core';
import { Jugador } from './jugador';
import { ResultadoTurno } from './resultado-turno';
import { JuegoService } from './juego-service.service';
import { Casilla } from './casilla';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jugadores: Jugador[] = [];
  resultadoTurno: ResultadoTurno | null = null;
  filas: Casilla[][] = [];
  turno:String="jugador";
  constructor(private juegoService: JuegoService) {}
  ngOnInit(): void {
  }

  iniciarJuego(): void {
    this.juegoService.iniciarJuego().subscribe(jugadores => {
      this.jugadores = jugadores;
      for (const jugador of this.jugadores) {
        this.organizarCasillasEnFilasYColumnas(jugador);
      }
    });

  }
  organizarCasillasEnFilasYColumnas(jugador: Jugador): void {
    this.filas = [];
  
    for (const casilla of jugador.tablero) {
      const fila = casilla.y;
      const columna = casilla.x;
  
      if (!this.filas[fila]) {
        this.filas[fila] = [];
      }
      
      this.filas[fila][columna] = casilla;
    }
  }
  
    
  realizarTurnoMaquina(): void {
    this.juegoService.realizarTurnoMaquina().subscribe(resultado => {
      this.resultadoTurno = resultado;
      // Lógica adicional para manejar el resultado del turno
    });
  }

  realizarTurnoJugador(casilla: Casilla,jugador:Jugador): void {
    this.juegoService.realizarTurnoJugador(casilla).subscribe(resultado => {
      this.turno = resultado.nombreJugador;
      this.actualizarCasillaDisparada(resultado.casillaDisparada, casilla.id);

    });
  }
  
  private actualizarCasillaDisparada(valor: Casilla, casillaId: number): void {

    for (const fila of this.filas) {
      let casilla = fila.find(c => c.id === casillaId);
      if (casilla) {
        casilla = valor;
        break;
      }
    }
  }
  
  getLetra(indice:number): String {
    return String.fromCharCode(indice+65);
  }
}
