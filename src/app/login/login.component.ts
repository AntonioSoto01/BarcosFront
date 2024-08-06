import { Component, OnInit } from '@angular/core';
import { JuegoService } from '../juego-service.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../usuario';
import { ToastrService } from 'ngx-toastr';
import { error } from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private juegoService: JuegoService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  apiUrlSimple = environment.apiUrlSimple;
  usuario: Usuario = new Usuario();
  validationErrors: any = {};

  login() {
    this.juegoService.login(this.usuario).subscribe(
      (token: string) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      (error) => {
        if (!(error.error instanceof Object)) {
          this.toastr.error(error.error);
        }
        this.validationErrors = error.error;
      },
    );
  }

  redirectToGoogle() {
    // const googleAuthUrl = this.apiUrlSimple + '/oauth2/authorization/google';
    // window.location.href = googleAuthUrl; // Redirect the user to Google OAuth URL
    this.juegoService.loginGoogle().subscribe(
      (next) => {
        debugger;
        this.toastr.success('Login correcto');
      },
      (error) => {
        debugger;
        this.toastr.error(error.error);
      },
    );
  }

  redirectToGitHub() {
    // const githubAuthUrl = this.apiUrlSimple + '/oauth2/authorization/github';
    // window.location.href = githubAuthUrl; // Redirect the user to GitHub OAuth URL
    this.juegoService.loginGithub().subscribe(
      (next) => {
        this.toastr.success('Login correcto');
      },
      (error) => {
        this.toastr.error(error.error);
      },
    );
  }
}
