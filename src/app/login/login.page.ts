import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/Users/user-service.service'
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  message: string[] = [];

  constructor(private UserService: UserServiceService,
    protected dn : LoaderFunctions
  ) { }
  user: any = []
  ngOnInit() {
    if (this.UserService.isAuth()) {
      this.user = this.UserService.getUser()
      this.UserService.RedirigirRol(this.user.idrol)
    }
  }

  usuario: string = ""
  password: string = "";


  login(): void {
    if (this.validar()) {
      this.UserService.login(this.usuario, this.password, true).subscribe(
        (response: any) => {
          if (response && response.success != null) {
            if (response.success) {
              console.log('Inicio de sesión exitoso:', response.usuario);
              localStorage.setItem('usuario', JSON.stringify(response.usuario));
              this.user = response.usuario;
              this.dn.Welcome(this.user)
              this.UserService.RedirigirRol(this.user.idrol);
            } else {
              this.message[2] = response.message;
              console.log(this.message)
            }
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
  

  validar(): boolean {
    let valido = true
    if (this.usuario === "") {
      this.message[0] = "Se requiere un usuario para iniciar sesión"
      valido = false
    }
    else{
      this.message[0] = ""
    }
    if (this.password === "") {
      this.message[1] = "Se requiere una contraseña para iniciar sesión"
      valido = false
    }else{
      this.message[1] = ""
    }
    console.log(valido)
    return valido
  }

}
