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

  async Servicios(loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Servicios/Servicios`);
    } finally {
    }
  }

  async lavados(estado: number, loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Servicios/Lavados/${estado}`);
    } finally {
    }
  }

  async CrearLavado(data: object, load: boolean = true): Promise<Observable<any>> {
    return new Observable(observer => {
      const loaderPromise = load ? this.loaderFunctions.StartLoader() : Promise.resolve();
  
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
