import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  server: string;

  constructor(
    private user: UserServiceService,
    private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }

  async CrearMesa(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Mesas/CrearMesa`, data).subscribe(
          async createdResponse => {
            await this.loaderFunctions.StopLoader();
            observer.next(createdResponse);
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

  async EliminarMesa(id: number): Promise<Observable<any>> {
    const data = {
      id: id
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Mesas/EliminarMesa`, options).subscribe(
          async deletedResponse => {
            await this.loaderFunctions.StopLoader();
            observer.next(deletedResponse);
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



  async ActulizarMesa(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      const response = new Observable<any>(observer => {
        this.http.put<any>(`${this.server}api/Mesas/AlctualizarMesa`, data).subscribe(
          updatedResponse => {
            observer.next(updatedResponse);
            observer.complete();
            this.loaderFunctions.StopLoader(); 
          },
          error => {
            observer.error(error);
            this.loaderFunctions.StopLoader(); 
          }
        );
      });
      return response;
    } catch (error) {
      this.loaderFunctions.StopLoader();
      throw error;
    }
  }

  async Mesas(loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Mesas/TodasMesas/5`);//todas las mesas excepto aquellas con etado 5
    } finally {
    }
  }

}
