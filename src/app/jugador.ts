import { Barco } from "./barco";
import { Casilla } from "./casilla";

export class Jugador {
    constructor(
      public id: number,
      public nombre: string,
      public ver: boolean,
      public tablero: Casilla[],
      public barcos: Barco[],
      public barcoshundidos: number
    ) {}
  }
  