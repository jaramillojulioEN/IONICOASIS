import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  server: string;

  constructor(private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = "https://localhost:44397/"
  }

  async OrdenesPendientes(loader: boolean = true): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Ordenes/TodasOrdenes/1`);
    } finally {
      if (loader)
        this.loaderFunctions.StopLoader();
    }
  }

  async BuscarOrden(loader: boolean = true, id: number): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Ordenes/BuscarOrden/${id}`);
    } finally {
      if (loader)
        this.loaderFunctions.StopLoader();
    }
  }

  async ActualizarOrden(orden: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.http.put<any>(`${this.server}api/Ordenes/AlctualizarOrden`, orden).subscribe(
        updatedResponse => {
          observer.next(updatedResponse);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }


}
