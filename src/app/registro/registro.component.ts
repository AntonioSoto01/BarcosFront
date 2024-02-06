import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../usuario';
import { JuegoService } from '../juego-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  ngOnInit() {}

  constructor(
    private juegoService: JuegoService,
    private router: Router,
  ) {}

  apiUrlSimple = environment.apiUrlSimple;
  usuario: Usuario = new Usuario();
  contrasena: string;

  registrarUsuario() {
    console.log('Registrando usuario');
    this.juegoService
      .registro(this.usuario, this.contrasena)
      .subscribe((token: string) => {
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
