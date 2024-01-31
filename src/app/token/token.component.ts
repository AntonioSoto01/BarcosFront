// token.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Recupera el valor del parámetro 'token' de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];
      if (token) {
        localStorage.setItem('token', token);
      }
      if (error) {
        localStorage.setItem('error', error);
      }
      this.router.navigate(['/']);
    });
  }
}
