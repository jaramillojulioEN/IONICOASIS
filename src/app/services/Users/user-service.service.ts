import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  login(user:string, password:string): Observable<any> {
    return this.http.get<any>(`https://localhost:44397/api/Users/Login/${user}/${password}`);
  }

}
