import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from '../Users/user-service.service';
@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  server: string;

  constructor(private UserServiceService : UserServiceService,private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.UserServiceService.getServer()
  }

  async OrdenesPendientes(loader: boolean = true, estado : number = 0): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Ordenes/TodasOrdenes/${estado}`);
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


  async CrearOrden(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Ordenes/CrearOrden`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async CrearOrdenDetail(data: any): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      if (data.idbebida == undefined && data.idplatillo != 0) {
        console.log(data)
        return this.http.post<any>(`${this.server}api/Detalles/CrearDetallePlatillo`, data);
      }
      if (data.idplatillo == undefined && data.idbebida != 0) {
        console.log(data)

        return this.http.post<any>(`${this.server}api/Detalles/CrearDetalleBebida`, data);
      }
      return new Observable<any>
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  total (orden : any) : number{
    let total = 0
    orden.ordenesplatillos.forEach((ordenplatillo: any) => {
      total += (ordenplatillo.platillos.precio * ordenplatillo.cantidad)
    });
    orden.ordenesbebidas.forEach((ordenbebida: any) => {
      total += (ordenbebida.bebidas.precioventa * ordenbebida.cantidad)
    });
    return total
  }

  async EliminarBDetalle(data: any): Promise<Observable<any>> {
    try {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      };

      await this.loaderFunctions.StartLoader();
      return this.http.delete<any>(`${this.server}api/Detalles/EliminarBebidaDetalle`, options);

    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async EliminarPDetalle(data: any): Promise<Observable<any>> {
    try {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      };

      await this.loaderFunctions.StartLoader();
      return this.http.delete<any>(`${this.server}api/Detalles/EliminarPlatilloDetalle`, options);

    } finally {
      this.loaderFunctions.StopLoader();
    }
  }
}
