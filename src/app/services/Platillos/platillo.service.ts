import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class PlatilloService {
  server: string;

  constructor(
    private user : UserServiceService,
    private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }

  async CrearPlatillo(data : object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();

      return this.http.post<any>(`${this.server}api/Platillos/CrearPlatillo`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async EliminarPlatillo(id: number): Promise<Observable<any>> {
    try {
      const data = {
        id: id
      };
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      };

      await this.loaderFunctions.StartLoader();
      return this.http.delete<any>(`${this.server}api/Platillos/EliminarPlatillo`, options);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async ActulizarPlatillo(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return new Observable(observer => {
        this.http.put<any>(`${this.server}api/Platillos/AlctualizarPlatillo`, data).subscribe(
          updatedResponse => {
            observer.next(updatedResponse);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      });
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }
  
  async Platillos(loader : boolean = true): Promise<Observable<any>> {
    try {
      if(loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Platillos/TodosPlatillos`);
    } finally {
      if(loader)
      this.loaderFunctions.StopLoader();
    }
  }
}
