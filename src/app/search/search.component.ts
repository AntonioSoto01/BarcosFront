import { Component } from '@angular/core';
import { JuegoService } from '../juego-service.service';

import { Router } from '@angular/router';
import { WebSocketService } from '../general/WebsocketService';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent {
  email: string;
  constructor(private juegoService: JuegoService, private webSocketService: WebSocketService, private router: Router) { }
  searchPlayer() {
    this.juegoService.start2PlayersGame(this.email).subscribe(
      (partida) => {
        // this.webSocketService.connect((message:any) => {
        //   this.router.navigate(['/']);
        //   console.log(message);
        // });

      },
      (partida) => {
        console.log(partida);
      },
    );

  }
}