import { Component, OnInit } from '@angular/core';
import { JuegoService } from '../juego-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  usuario: any;

  constructor(private juegoService: JuegoService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.juegoService.obtenerUsuario().subscribe((data) => {
      this.usuario = data;
    });
  }

  getRival(partida: any) {
    return partida.jugador1.nombre === this.usuario.nombre
      ? partida.jugador2.nombre
      : partida.jugador1.nombre;
  }

  getGanador(partida: any) {
    return partida.terminar
      ? partida.turno === this.usuario.nombre
        ? 'Victoria'
        : 'Derrota'
      : 'En curso';
  }
}
