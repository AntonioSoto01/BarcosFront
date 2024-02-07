import { Component, OnInit } from '@angular/core';
import { JuegoService } from '../juego-service.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private juegoService: JuegoService,
    private router: Router,
  ) {}

  apiUrlSimple = environment.apiUrlSimple;
  usuario: Usuario = new Usuario();

  login() {
    console.log('Login usuario');
    this.juegoService.login(this.usuario).subscribe((token: string) => {
      localStorage.setItem('token', token);
      this.router.navigate(['/']);
    });
  }

  redirectToGoogle() {
    const googleAuthUrl = this.apiUrlSimple + '/oauth2/authorization/google';
    window.location.href = googleAuthUrl; // Redirect the user to Google OAuth URL
  }

  redirectToGitHub() {
    const githubAuthUrl = this.apiUrlSimple + '/oauth2/authorization/github';
    window.location.href = githubAuthUrl; // Redirect the user to GitHub OAuth URL
  }
}
