import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../usuario';
import { JuegoService } from '../juego-service.service';
import { Router } from '@angular/router';
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
    private toastr: ToastrService,
  ) {}

  apiUrlSimple = environment.apiUrlSimple;
  usuario: Usuario = new Usuario();
  contrasena: string;

  validationErrors: any = {};

  registrarUsuario() {
    this.juegoService.registro(this.usuario, this.contrasena).subscribe(
      () => {
        this.router.navigate(['/confirmar']);
      },
      (error) => {
        this.validationErrors = error;
      },
    );
  }

  redirectToGoogle() {
    window.location.href = this.apiUrlSimple + '/oauth2/authorization/google';
  }

  redirectToGitHub() {
    window.location.href = this.apiUrlSimple + '/oauth2/authorization/github';
  }
}
