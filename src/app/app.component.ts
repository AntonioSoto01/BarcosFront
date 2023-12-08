import { Component, OnInit } from '@angular/core';
import { Jugador } from './jugador';
import { Jugador1 } from './jugador1';
import { ResultadoTurno } from './resultado-turno';
import { JuegoService } from './juego-service.service';
import { Casilla } from './casilla';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jugadores: Jugador[] = [];
  resultadoTurno: ResultadoTurno | null = null;
  turno: String = "";
  mostrarBoton: boolean = false;
  juegoTerminado: boolean = false;
  parpadeo: boolean=false;
  constructor(private juegoService: JuegoService) { }
  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
    this.juegoService.cargarJugadores().subscribe((jugadores) => {
      this.mostrarJuego(jugadores);
      if (this.jugadores.length === 0) {
        this.mostrarBoton = true;
      }
    }
    );
  }

  iniciarJuego(): void {
    this.juegoService.iniciarJuego().subscribe(jugadores => { this.mostrarJuego(jugadores); })
  }
  mostrarJuego(jugadores: Jugador[]) {
    this.jugadores = jugadores;
    if (this.jugadores.length === 0) {
      this.mostrarBoton = true;
      return;
    } else {
      ;
      for (const jugador of this.jugadores) {
        this.organizarCasillasEnFilasYColumnas(jugador);
      }
      console.log(this.jugadores.length)
      this.turno = this.jugadores[0].nombre;
    }
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
                this.procesarResultado(resultado, casilla, jugador);
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
      this.procesarResultado(resultado, casilla, jugador);
    });
  }
  procesarResultado(resultado: ResultadoTurno, casilla: Casilla, jugador: Jugador) {
    console.log(casilla.id);
    this.turno = resultado.nombreJugador;
    this.actualizarCasillaDisparada(resultado, casilla,jugador);


  }
  private actualizarCasillaDisparada(resultado: ResultadoTurno, casilla: Casilla,jugador:Jugador) {
    casilla.disparado = true;
    if (resultado.resultadoDisparo === 'hundido'||resultado.terminar) {

        const barcoId = casilla.barco?.id;
        if (typeof barcoId === 'number') {
          this.hundirBarco(barcoId);
        }
    }
    casilla.cadena = "●";
    casilla.parpadeo=true;
    this.parpadeo=true;
    setTimeout(() => {
    casilla.parpadeo = false;
    this.parpadeo=false;
    if (resultado.terminar) {
      this.terminar(resultado, jugador);
    } else {
      if (this.turno === this.jugadores[1].nombre) {
        console.log("entra")
        this.realizarTurnoMaquina();
      }
    }
    }, 2000);
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
  terminar(resultado: ResultadoTurno, jugador: Jugador) {
    this.juegoTerminado = true;
    if (this.esJugador1(jugador) && this.turno === jugador.nombre) {
      Swal.fire("¡Juego Terminado!", "¡Has perdido el juego!", "error");
    } else {
      Swal.fire("¡Juego Terminado!", "¡Has ganado el juego!", "success");
    }
  }
}
