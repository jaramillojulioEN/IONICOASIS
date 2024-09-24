import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from '../Users/user-service.service'
@Injectable({
  providedIn: 'root'
})
export class LavadoService {
  server: string = ""
  constructor(
    private UserServiceService: UserServiceService,
    private loaderFunctions: LoaderFunctions,
    private http: HttpClient
  ) {
    this.server = this.UserServiceService.getServer()
  }
  async Vehiculos(loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Servicios/TodosServicios`);
    } finally {

    }
  }


  async EliminarServicio(data: any): Promise<Observable<any>> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };

    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Servicios/EliminarServicioCarro`, options).subscribe(
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
  async Eliminar(data: any): Promise<Observable<any>> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };

    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Servicios/EliminarLavado`, options).subscribe(
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

  async Servicios(loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Servicios/Servicios`);
    } finally {
    }
  }

  async lavados(estado: number, loader: boolean = true, ids = 0): Promise<Observable<any>> {
    try {
      var user = this.UserServiceService.getUser();
      let idsuc = ids == 0  ? user.sucursales.id : ids
      return this.http.get<any>(`${this.server}api/Servicios/Lavados/${estado}/${idsuc}`);
    } finally {
    }
  }

 

  async CrearLavado(data: object, load: boolean = true): Promise<Observable<any>> {
    return new Observable(observer => {
      const loaderPromise = load ? this.loaderFunctions.StartLoader() : Promise.resolve();
      console.log(data)
      loaderPromise.then(() => {
        this.http.post<any>(`${this.server}api/Servicios/AccionesServicio`, data).subscribe(
          async response => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }


  async CobrarLIsta(data: any, load: boolean = true): Promise<Observable<any>> {
    return new Observable(observer => {
      const loaderPromise = load ? this.loaderFunctions.StartLoader() : Promise.resolve();
      console.log(data)
      loaderPromise.then(() => {
        this.http.post<any>(`${this.server}api/Servicios/Multiple`, data).subscribe(
          async response => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }
  
  async ImprimirRecibo(data: object, load: boolean = true): Promise<Observable<any>> {
    return new Observable(observer => {
      const loaderPromise = load ? this.loaderFunctions.StartLoader("Imprimiendo Ticket") : Promise.resolve();
  
      loaderPromise.then(() => {
        this.http.post<any>(`${this.server}api/Ordenes/Imprimir`, data).subscribe(
          async response => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.loaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }
  
}
