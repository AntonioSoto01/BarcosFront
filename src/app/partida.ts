import { Barco } from './barco';
import { Casilla } from './casilla';
import { Jugador } from './jugador';

export class Partida {
      public terminar:boolean
  constructor(
    public id: number,
    public jugador1: Jugador,
    public jugador2: Jugador,
    public turno: String,
    public tokenPartida: String,
    public terminar: boolean,
}
