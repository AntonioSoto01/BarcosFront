import { Casilla } from "./casilla";
import { Jugador } from "./jugador";


export interface Jugador1 extends Jugador {
  ultTocado: Casilla | null;
  estado: number;
}
