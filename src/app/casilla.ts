import { Barco } from "./barco";

export class  Casilla {
    constructor(
      public id: number,
      public x: number,
      public y: number,
      public disparado: boolean,
      public barco: Barco | null,
      public puedebarco: boolean,
      public puededisparar: boolean,
      public cadena: string
    ) {}
  }