import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/Users/user-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router,private UserService: UserServiceService) { }

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      let JSONUser = JSON.parse(usuarioGuardado)
      this.RedirigirRol(JSONUser.idrol)
    } else {
      this.login();
    }
  }

  RedirigirRol(rol:any):void{
    if(rol == 1){
      this.router.navigate(['/admin-dash-board']);
    }else{
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    let usuario = "JJ"
    let password = "1234"
    this.UserService.login(usuario, password).subscribe(
      (response:any) => {
        if (response && response.repuesta) {
          const usuario = response.repuesta;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.RedirigirRol(usuario.idrol)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error:any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

}
