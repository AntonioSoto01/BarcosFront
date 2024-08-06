// token.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JuegoService } from '../juego-service.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Recupera el valor del parámetro 'token' de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];
      if (token) {
        // Almacenar el token en el almacenamiento local del navegador
        localStorage.setItem('token', token);
        // Cambiar el token
      }
      if (error) {
        this.toastr.error(error);
        this.router.navigate(['/']);
      }
    });
  }
}
