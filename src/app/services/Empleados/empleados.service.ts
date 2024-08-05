import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  server: string;

  constructor(
    private user : UserServiceService,
    private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }


  async CrearEmpleado(data: object): Promise<Observable<any>> {
    console.log(data)
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Empleados/CrearEmpleado`, data).subscribe(
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

  async CrearConsumo(consumo: any): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Empleados/CrearConsumo`, consumo).subscribe(
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
  
  async EliminarEmpleado(data: any): Promise<Observable<any>> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
  
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Empleados/EliminarEmpleado`, options).subscribe(
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
  
  async RefactorizarConsumo(consumo: any, isdelete: boolean): Promise<Observable<any>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: consumo
    };
  
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        const request = isdelete 
          ? this.http.delete<any>(`${this.server}api/Empleados/EliminarConsumo`, options)
          : this.http.put<any>(`${this.server}api/Empleados/EditarConsumo`, options);
  
        request.subscribe(
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
  
  async ActulizarEmpleado(data: any): Promise<Observable<any>> {
    console.log(data);
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.server}api/Empleados/AlctualizarEmpleado`, data).subscribe(
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
  
  
  async Empleados(loader : boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Empleados/TodosEmpleados`);
    } finally {
    }
  }

}
