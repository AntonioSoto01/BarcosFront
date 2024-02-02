import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Partida } from '../partida';
import { ResultadoTurno } from '../resultado-turno';
import { JuegoService } from '../juego-service.service';
import { Jugador } from '../jugador';
import { Casilla } from '../casilla';
import { Jugador1 } from '../jugador1';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  apiUrlSimple = environment.apiUrlSimple;
  partida!: Partida;
  resultadoTurno: ResultadoTurno | null = null;
  turno: String = '';
  mostrarBoton: boolean = false;
  juegoTerminado: boolean = false;
  parpadeo: boolean = false;
  registrado: boolean = true;
  error: string | null = null;

  constructor(
    private juegoService: JuegoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    //this.iniciarJuego();

    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      // if (params['success']) {
      //   this.obtenerUsuario();
      //   console.log('success');
      // }
      const token = localStorage.getItem('token');
      if (token) {
        this.obtenerUsuario();
      } else {
        this.registrado = false;
        this.cargarPartida();
      }
      this.error = localStorage.getItem('error');
      if (this.error) {
        this.toastr.error(this.error);
        localStorage.removeItem('error');
      }
    });
  }

  obtenerUsuario(): void {
    this.juegoService.obtenerUsuario().subscribe(
      (data: any) => {
        this.registrado = true;
        this.cargarPartida();
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.registrado = false;
      },
    );
  }

  cargarPartida(): void {
    let token = localStorage.getItem('partida');
    this.juegoService.cargarPartida(token).subscribe((partida) => {
      this.mostrarJuego(partida);
    });
  }

  iniciarJuego(): void {
    this.juegoService.iniciarJuego().subscribe((partida) => {
      this.mostrarJuego(partida);
      if (partida.tokenPartida) {
        localStorage.setItem('partida', `${partida.tokenPartida}`);
      }
      this.juegoTerminado = false;
    });
  }

  mostrarJuego(partida: Partida) {
    this.partida = partida;
    if (this.partida) {
      this.mostrarBoton = false;
      this.organizarCasillasEnFilasYColumnas(this.partida.jugador1);
      this.organizarCasillasEnFilasYColumnas(this.partida.jugador2);
      this.turno = this.partida.turno;
    } else {
      this.mostrarBoton = true;
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
    this.juegoService
      .realizarTurnoMaquina(this.partida.id)
      .subscribe((resultado) => {
        const casillaDisparada: Casilla = resultado.casillaDisparada;
        const jugador = this.partida.jugador2;
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
      });
  }

  realizarTurnoJugador(casilla: Casilla, jugador: Jugador): void {
    this.juegoService
      .realizarTurnoJugador(casilla, this.partida.id)
      .subscribe((resultado) => {
        this.procesarResultado(resultado, casilla, jugador);
      });
  }

  procesarResultado(
    resultado: ResultadoTurno,
    casilla: Casilla,
    jugador: Jugador,
  ) {
    console.log(casilla.id);
    this.turno = resultado.nombreJugador;
    this.actualizarCasillaDisparada(resultado, casilla, jugador);
  }

  private actualizarCasillaDisparada(
    resultado: ResultadoTurno,
    casilla: Casilla,
    jugador: Jugador,
  ) {
    casilla.disparado = true;
    if (resultado.resultadoDisparo === 'hundido' || resultado.terminar) {
      const barcoId = casilla.barco?.id;
      if (typeof barcoId === 'number') {
        this.hundirBarco(barcoId, jugador);
      }
    }
    casilla.cadena = '●';
    casilla.parpadeo = true;
    this.parpadeo = true;
    setTimeout(() => {
      casilla.parpadeo = false;
      this.parpadeo = false;
      if (resultado.terminar) {
        this.terminar(resultado, jugador);
      } else {
        if (this.turno === this.partida.jugador2.nombre) {
          this.realizarTurnoMaquina();
        }
      }
    }, 2000);
  }

  private hundirBarco(barcoId: number, jugador: Jugador) {
    this.juegoService.getJugador(jugador.id).subscribe((nuevoJugador) => {
      this.organizarCasillasEnFilasYColumnas(nuevoJugador)
      if (jugador === this.partida.jugador1) {
        this.partida.jugador1 = nuevoJugador
      } else {
        this.partida.jugador2 = nuevoJugador
      }
    });

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
    this.mostrarBoton = true;
    if (this.esJugador1(jugador) && this.turno === jugador.nombre) {
      Swal.fire('¡Juego Terminado!', '¡Has perdido el juego!', 'error');
    } else {
      Swal.fire('¡Juego Terminado!', '¡Has ganado el juego!', 'success');
    }
  }

  loginGoogle() {
    this.juegoService.loginGoogle().subscribe((resultado) => { });
  }

  logOut() {
    this.juegoService.logOut().subscribe(
      (response) => {
        console.log('Logout exitoso');
      },
      (error) => {
        console.error('Error durante el logout', error);
        window.location.href = '/';
      },
    );
  }
}
