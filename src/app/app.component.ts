import { Component, OnInit } from '@angular/core';
import { Jugador } from './jugador';
import { Jugador1 } from './jugador1';
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

  turno: String = "";
  constructor(private juegoService: JuegoService) {}
  ngOnInit(): void {
  }

  iniciarJuego(): void {
    this.juegoService.iniciarJuego().subscribe(jugadores => {
      this.jugadores = jugadores;
      for (const jugador of this.jugadores) {
        this.organizarCasillasEnFilasYColumnas(jugador);
      }
      this.turno = this.jugadores[0].nombre;
    });

  }
  organizarCasillasEnFilasYColumnas(jugador: Jugador): void {
    jugador.filas = [];
    for (const casilla of jugador.tablero) {
      const fila = casilla.y;
      const columna = casilla.x;

      if (!jugador.filas[fila]) {
        jugador.filas[fila] = [];
      }

      jugador.filas[fila][columna] = casilla;
    }
  }



  realizarTurnoMaquina(): void {
    this.juegoService.realizarTurnoMaquina().subscribe(resultado => {
      const casillaDisparada: Casilla = resultado.casillaDisparada;
      for (const jugador of this.jugadores) {
        if ('estado' in jugador) {
          for (const fila of jugador.filas) {
            for (const casilla of fila) {
              if (casilla.id === casillaDisparada.id) {
                this.procesarResultado(resultado, casilla);
                return;
              }
            }
          }
        }
      }
    });
  }


  realizarTurnoJugador(casilla: Casilla, jugador: Jugador): void {
    this.juegoService.realizarTurnoJugador(casilla).subscribe(resultado => {
      this.procesarResultado(resultado, casilla);
    });
  }
  procesarResultado(resultado: ResultadoTurno, casilla: Casilla) {
    console.log(casilla.id);
    this.turno = resultado.nombreJugador;
    this.actualizarCasillaDisparada(resultado, casilla);
    if (this.turno === 'maquina') {
      this.realizarTurnoMaquina();
    }



  }
  private actualizarCasillaDisparada(resultado: ResultadoTurno, casilla: Casilla) {
    casilla.disparado = true;
    if (resultado.resultadoDisparo === 'hundido') {
      if (resultado.resultadoDisparo === 'hundido') {
        const barcoId = casilla.barco?.id;
        if (typeof barcoId === 'number') {
          this.hundirBarco(barcoId);
        }

      }
    }
    casilla.cadena = "●";
  }
  private hundirBarco(barcoId: number) {
    for (const jugador of this.jugadores) {
      for (const fila of jugador.filas) {
        for (const casilla of fila) {
          if (casilla.barco && casilla.barco.id === barcoId) {
            casilla.hundido = true;
          }
        }
      }
    }
  }

  getLetra(indice: number): String {
    return String.fromCharCode(indice + 65);
  }


  obtenerMensajeTurno(jugador: Jugador | Jugador1): string {
    if (this.esTurnoDelJugador(jugador)) {
      if (!this.esJugador1(jugador)) {
        return 'Tu turno';
      } else {
        return 'Turno de la máquina';
      }
    } else {
      return '<br>';
    }
  }

  esJugador1(jugador: Jugador | Jugador1): jugador is Jugador1 {
    return 'estado' in jugador;
  }

  esTurnoDelJugador(jugador: Jugador | Jugador1): boolean {
    return this.turno === jugador.nombre;
  }
}
