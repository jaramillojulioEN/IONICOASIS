import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/Users/user-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private UserService: UserServiceService) { }
  user: any = []
  ngOnInit() {
    if (this.UserService.isAuth()) {
      this.user = this.UserService.getUser()
      this.UserService.RedirigirRol(this.user.idrol)
    } else {
      this.login();
    }
  }



  login(): void {
    let usuario = "JJ"
    console.log(usuario)

    let password = "1234"
    this.UserService.login(usuario, password).subscribe(
      (response: any) => {
        if (response && response.repuesta) {
          const usuario = response.repuesta;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.user = this.UserService.getUser()
          this.UserService.RedirigirRol(this.user.idrol)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

}
