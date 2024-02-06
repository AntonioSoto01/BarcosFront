import { Partida } from './partida';

export class Usuario {
  id: string;
  nombre: string;
  email: string;
  contrasena: string;
  valido: boolean;
  partidas: Partida[];
}
