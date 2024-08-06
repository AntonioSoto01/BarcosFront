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
import { WebSocketService } from './WebsocketService';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { IMessage } from '@stomp/rx-stomp';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {

  partida!: Partida;
  resultadoTurno: ResultadoTurno | null = null;
  turno: String = '';
  mostrarBoton: boolean = true;
  juegoTerminado: boolean = false;
  parpadeo: boolean = false;
  registrado: boolean = true;
  error: string | null = null;
  rol: string = 'jugador1';
  jugadores: Jugador[] = [];
  constructor(
    private juegoService: JuegoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
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
      this.obtenerUsuario();

      this.error = localStorage.getItem('error');
      if (this.error) {
        this.toastr.error(this.error);
        localStorage.removeItem('error');
      }
    });

  }

  obtenerUsuario(): void {
    this.juegoService.obtenerUsuario().subscribe({
      next: (data: any) => {
        this.registrado = !!data;
        this.cargarPartida();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.registrado = false;
      },
    });
  }

  cargarPartida(): void {
    let token = localStorage.getItem('partida');
    // @ts-ignore
    this.juegoService.cargarPartida(token).subscribe((partida) => {
      this.rol = partida.rol;
      this.mostrarJuego(partida.partida);
      console.log("rol" + this.rol + "turno" + this.turno)
      if (this.turno !== this.rol) {
        this.turnoEnemigo();
      }
    });
  }

  iniciarJuego(): void {
    this.juegoService.iniciarJuego().subscribe((partida) => {
      this.mostrarJuego(partida);
      console.log("iniciar rol" + partida.jugador1.rol);
      this.rol = partida.jugador1.rol;
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
      this.ordenarJugadores();
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
                this.actualizarCasillaDisparada(resultado, casilla, jugador);
                return;
              }
            }
          }
        }
      });
  }

  realizarTurnoJugador(casilla: Casilla, jugador: Jugador): void {
    this.juegoService
      .realizarTurnoJugador(casilla, this.partida.id, jugador.rol)
      .subscribe((resultado) => {
        this.actualizarCasillaDisparada(resultado, casilla, jugador);
      });
  }

  private actualizarCasillaDisparada(
    resultado: ResultadoTurno,
    casilla: Casilla,
    jugador: Jugador,
  ) {
    casilla.disparado = true;

    casilla.cadena = '●';
    casilla.parpadeo = true;
    this.parpadeo = true;

    setTimeout(() => {

      if (resultado.resultadoDisparo === 'hundido' || resultado.terminar) {
        this.hundirBarco(jugador);
      }
      this.turno = resultado.nombreJugador;
      casilla.parpadeo = false;
      this.parpadeo = false;
      if (resultado.terminar) {
        this.terminar(resultado, jugador);
      } else {
        if (this.turno !== this.rol) {
          this.turnoEnemigo();
        }
      }

    }, 2000);
  }

  private hundirBarco(jugador: Jugador) {
    this.juegoService.getJugador(jugador.id).subscribe((nuevoJugador) => {
      this.organizarCasillasEnFilasYColumnas(nuevoJugador);
      if (jugador.rol === this.partida.jugador1.rol) {
        this.partida.jugador1 = nuevoJugador;
        console.log(this.partida.jugador1);
      } else {
        this.partida.jugador2 = nuevoJugador;
      }
      this.ordenarJugadores();
    });
  }

  getLetra(indice: number): String {
    return String.fromCharCode(indice + 65);
  }

  obtenerMensajeTurno(jugador: Jugador | Jugador1): string {
    if (this.esTurnoDelJugador(jugador)) {
      if (this.esJugador1(jugador)) {
        return 'Tu turno';
      } else {
        return 'Turno de la máquina';
      }
    } else {
      return '<br>';
    }
  }

  esJugador1(jugador: Jugador | Jugador1) {
    return jugador.rol === this.rol;
  }

  esTurnoDelJugador(jugador: Jugador | Jugador1): boolean {
    return this.turno === jugador.rol;

  }

  terminar(resultado: ResultadoTurno, jugador: Jugador) {
    this.juegoTerminado = true;
    this.mostrarBoton = true;
    if (!this.esJugador1(jugador) && this.turno === jugador.rol) {
      Swal.fire('¡Juego Terminado!', '¡Has perdido el juego!', 'error');
    } else {
      Swal.fire('¡Juego Terminado!', '¡Has ganado el juego!', 'success');
    }
  }

  loginGoogle() {
    this.juegoService.loginGoogle().subscribe((resultado) => { });
  }

  logOut() {
    this.juegoService.logOut().subscribe({
      next: (response) => {
        console.log('Logout exitoso');
      },
      error: (error) => {
        console.error('Error durante el logout', error);
        window.location.href = '/';
      },
    });
  }
  obtenerRol() {
    return this.partida.jugador1.rol === this.rol ? this.partida.jugador2.rol : this.partida.jugador1.rol;
  }
  obtenerRolContrario() {
    return this.partida.jugador1.rol === this.rol ? this.partida.jugador1.rol : this.partida.jugador2.rol;
  }
  ordenarJugadores() {
    console.log("ordenar rol" + this.rol);
    this.jugadores = this.obtenerRol() === this.partida.jugador1.rol ?
      [this.partida.jugador1, this.partida.jugador2] :
      [this.partida.jugador2, this.partida.jugador1];
  }

  turnoEnemigo() {
    console.log('turno enemigo');
    if (this.partida.usuarios.length < 2) {
      this.realizarTurnoMaquina();
    } else {
      const topic = `/user/topic/game.${this.partida.id}`;
      this.websocketSub(topic);
    }
  }

  public websocketSub(topic: string) {

    const existingSubscription = this.webSocketService.subscriptions.find(sub => sub.topic === topic);
    if (!existingSubscription) {
      const sub: Subscription = this.webSocketService.connectToSocket(topic).subscribe((message: IMessage) => {
        this.handleWebsocketSub(message);
      });

      this.webSocketService.subscriptions.push({ topic: topic, subscription: sub });
    }
  }

  public handleWebsocketSub(message: IMessage) {
    this.webSocketService.wsSessionId = parseInt(message.headers['simpSessionId']);
    this.cargarPartida();
  }
}
