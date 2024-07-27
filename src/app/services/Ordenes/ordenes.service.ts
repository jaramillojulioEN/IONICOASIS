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

  constructor(private UserServiceService: UserServiceService, private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.UserServiceService.getServer()
  }

  async ActualizarOrden(orden: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.server}api/Ordenes/AlctualizarOrden`, orden).subscribe(
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

  async CrearOrden(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Ordenes/CrearOrden`, data).subscribe(
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

  async CrearOrdenDetail(data: any): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        let request: Observable<any>;
        if (data.idbebida === undefined && data.idplatillo != 0) {
          request = this.http.post<any>(`${this.server}api/Detalles/CrearDetallePlatillo`, data);
        } else if (data.idplatillo === undefined && data.idbebida != 0) {
          request = this.http.post<any>(`${this.server}api/Detalles/CrearDetalleBebida`, data);
        } else {
          request = new Observable<any>();
        }

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

  async EliminarBDetalle(data: any): Promise<Observable<any>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };

    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Detalles/EliminarBebidaDetalle`, options).subscribe(
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

  async EliminarPDetalle(data: any): Promise<Observable<any>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.delete<any>(`${this.server}api/Detalles/EliminarPlatilloDetalle`, options).subscribe(
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


  total(orden: any): number {
    let total = 0;
    if (Array.isArray(orden.ordenesplatillos)) {
      orden.ordenesplatillos.forEach((ordenplatillo: any) => {
        total += (ordenplatillo.platillos.precio * ordenplatillo.cantidad);
      });
    }

    if (Array.isArray(orden.ordenesbebidas)) {
      orden.ordenesbebidas.forEach((ordenbebida: any) => {
        total += (ordenbebida.bebidas.precioventa * ordenbebida.cantidad);
      });
    }

    return total;
  }



  public estados: any = [
    { value: -1, label: 'Tomando orden' },
    { value: 1, label: 'Orden pendiente' },
    { value: 2, label: 'Cocinando' },
    { value: 3, label: 'Listo para recoger (terminada)' },
    { value: 4, label: 'Orden cerrada' },
    { value: 5, label: 'Orden Cobrada' },
    { value: 6, label: 'Orden Cancelada' }
  ];


  getEstado(estado: number): string {
    switch (estado) {
      case -1:
        return "Tomando orden";
      case 1:
        return "Orden pendiente";
      case 2:
        return "Cocinando";
      case 3:
        return "Listo para recoger (terminada)";
      case 4:
        return "Orden cerrada";
      case 5:
        return "Orden Cobrada";
      case 6:
        return "Orden Cancelada";
      default:
        return "Estado desconocido";
    }
  }

  async OrdenesPendientes(loader: boolean = true, estado: number = 0, rol: number = 0): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Ordenes/TodasOrdenes/${estado}/${rol}`);
    } finally {
    }
  }

  async BuscarOrden(loader: boolean = false, id: number): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Ordenes/BuscarOrden/${id}`);
    } finally {
    }
  }




}
