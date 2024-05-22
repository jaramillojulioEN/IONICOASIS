import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user: any = [];

  constructor(private http: HttpClient) { }

  login(user:string, password:string): Observable<any> {
    return this.http.get<any>(`https://localhost:44397/api/Users/Login/${user}/${password}`);
  }

  getRol () : string{
    return this.isAuth() ? this.user.roles.rol : ""
  }

  getUser () : any{
    return this.isAuth() ? this.user : null
  }

  isAuth() : boolean {
    let auth = false 
    const usuarioGuardado = localStorage.getItem('usuario');
    if(usuarioGuardado != null){
      this.user = JSON.parse(usuarioGuardado)
      auth = true
    }
    return auth
  }

}
