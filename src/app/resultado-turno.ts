import { Casilla } from "./casilla";

export class ResultadoTurno {
    constructor(
      public terminar: boolean,
      public error: boolean,
      public mensajeError: string,
      public resultadoDisparo: string,
      public nombreJugador: string,
      public casillaDisparada: Casilla
    ) {}
  }
  