import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from '../Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class CortesService {
  server: string = ""
  constructor(
    private UserServiceService: UserServiceService,
    private loaderFunctions: LoaderFunctions,
    private http: HttpClient
  ) {
    this.server = this.UserServiceService.getServer()
  }

  async ActulizarCaja(data: object): Promise<Observable<any>> {
    this.loaderFunctions.StartLoader()
    return new Observable(observer => {
      this.http.put<any>(`${this.server}api/Cortes/ActualizarCorte`, data).subscribe(
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
  }

  async CrearInicio(data: object): Promise<Observable<any>> {
    this.loaderFunctions.StartLoader()
    return new Observable(observer => {
      this.http.post<any>(`${this.server}api/Cortes/CrearCorte`, data).subscribe(
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
  }

  async Retirar(data: object): Promise<Observable<any>> {
    this.loaderFunctions.StartLoader()
    return new Observable(observer => {
      this.http.post<any>(`${this.server}api/Cortes/CrearRetiro`, data).subscribe(
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
  }

  async CrearDetalle(data: any): Promise<Observable<any>> {
    let observer= new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Servicios/AddDetalle`, data).subscribe(
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
    console.log(`${this.server}api/Servicios/AddDetalle`)
    return observer
  }
  
  async EliminarDetalle(data: any): Promise<Observable<any>> {
    console.log(data)
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };

    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Servicios/EliminarDetalle`, options).subscribe(
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

  async CortesActivos(estado: number, loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Cortes/TodosCortes/${estado}`);
    } finally {

    }
  }

  async RetirosActivos(loader: boolean = true, activos: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Cortes/TodosRetiros/${activos}`);
    } finally {
    }
  }


}
