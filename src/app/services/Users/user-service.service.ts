import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderFunctions } from 'src/functions/utils'
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user: any = [];

  constructor(private loaderFunctions : LoaderFunctions,private http: HttpClient, private router: Router, private loader: LoaderFunctions) { }

  login(user: string, password: string, load: boolean = false): Observable<any> {
    return new Observable(observer => {
      const loaderPromise = load ? this.loader.CargandoLogin("Iniciando sesión...") : Promise.resolve();
      loaderPromise.then(() => {
        this.http.get<any>(`${this.getServer()}/api/Users/login/${user}/${password}`).subscribe(
          async response => {
            if (load) await this.loader.cerrarCargandoLogin();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.loader.cerrarCargandoLogin();
            observer.error(error);
          }
        );
      });
    });
  }
  
  Sucursales(): Observable<any> {
    return this.http.get<any>(`${this.getServer()}api/Sucursales/Sucursales`);
  }

  getServer(): string {
    let server = ""
    // server = "https://muddywatter26-001-site1.ftempurl.com/"
    server = "https://localhost:44397/"
    let port = "44397"  
    return `${server}/`
  }

  getRol(usuario: string = "", contra: string = ""): any {
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

  async ActulizarInasistencia(data: any): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.getServer()}api/Inasisencias/Editar`, data).subscribe(
          async updatedResponse => {
            await this.loaderFunctions.StopLoader();
            observer.next(updatedResponse);
            observer.complete();
          },
          async error => {
            await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }


  async lr(): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.getServer()}api/Live/Reload`);
    } finally {
    }
  }

  async EliminarInasitencias(data: any): Promise<Observable<any>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.getServer()}api/Inasisencias/Eliminar`, options).subscribe(
          async response => {
            await this.loaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }

  async EliminarConsumos(data: any): Promise<Observable<any>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.getServer()}api/Consumo/Eliminar`, options).subscribe(
          async response => {
            await this.loaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
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

  LogOut(): boolean {
    try {
      // Eliminar el elemento del localStorage
      localStorage.removeItem("usuario");

      // Navegar a la página de login
      this.router.navigate(['/']).then(() => {
        // Recargar la aplicación para destruir todos los componentes
        window.location.reload();
      });

      return true;
    } catch {
      return false;
    }
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
      default:
        this.router.navigate(['/login']);
        break;
    }
  }

}
