// token.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JuegoService } from '../juego-service.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private juegoService: JuegoService,
  ) {}

  ngOnInit(): void {
    // Recupera el valor del parámetro 'token' de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];
      if (token) {
        localStorage.setItem('token', token);
        this.juegoService.cambiarToken().subscribe((nuevoToken) => {
          localStorage.setItem('token', nuevoToken);
          console.log(localStorage.getItem('token'));
          this.router.navigate(['/']);
        });
      }
      if (error) {
        localStorage.setItem('error', error);
        this.router.navigate(['/']);
      }
    });
  }
}
