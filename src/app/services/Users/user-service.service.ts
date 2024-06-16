import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderFunctions } from 'src/functions/utils'
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user: any = [];

  constructor(private http: HttpClient, private router: Router, private loader: LoaderFunctions) { }

  login(user: string, password: string, load: boolean = false): Observable<any> {
    try {
      if (load)
        this.loader.StartLoader()
      return this.http.get<any>(`${this.getServer()}/api/Users/login/${user}/${password}`);
    }
    finally {
      if (load)
        this.loader.StopLoader()
    }
  }

  getServer(): string {
    let server = "http://www.pruebas.somee.com"
    let port = "44397"
    if (this.isAuth())
      return `${server}/`
    else{
      return "forbiden"
    }
  }

  getRol(usuario: string = "", contra: string = ""): string {
    if (usuario != "" && contra != "") {
      this.login(usuario, contra).subscribe((response: any) => {
        if (response && response.usuario) {
          this.user = response.usuario;
          localStorage.setItem('usuario', JSON.stringify(this.user));
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        })
    } else {
      this.user = this.getUser()
      return this.user.roles
    }
    return this.isAuth() ? this.user.roles : ""
  }

  getUser(): any {
    return this.isAuth() ? this.user : null
  }

  isAuth(): boolean {
    let auth = false
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado != null) {
      this.user = JSON.parse(usuarioGuardado)
      auth = true
    } else {
      this.router.navigate(['/login']);
    }
    return auth
  }

  RedirigirRol(idrol: number): void {
    console.log(this.user.idrol)
    switch (idrol) {
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

}
