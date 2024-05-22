import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/Users/user-service.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private UserService: UserServiceService) { }
  user: any = []
  ngOnInit() {
    if (this.UserService.isAuth()) {
      this.user = this.UserService.getUser()
      this.RedirigirRol()
    } else {
      this.login();
    }
  }

  RedirigirRol(): void {
    switch (this.user.idrol) {
      case 1:
        this.router.navigate(['/admin']);
        break;
      case 2:
        this.router.navigate(['/mesero']);
        break;
      case 4:
        this.router.navigate(['/cocina']);
        break;
      case 5:
        this.router.navigate(['/caja']);
        break;
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
          this.RedirigirRol()
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
