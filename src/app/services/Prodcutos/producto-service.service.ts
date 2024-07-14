import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {
  server: string;

  constructor(
    private user : UserServiceService,
    private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }

  async CrearProducto(cantidad: number, nombre: string, idcategoria: number, fecha: string): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        const data = {
          nombre: nombre,
          cantidad: cantidad,
          fecha: fecha,
          idcategoria: idcategoria
        };
  
        this.http.post<any>(`${this.server}api/Productos/CrearProducto`, data).subscribe(
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
  
  async EliminarProductos(id: number): Promise<Observable<any>> {
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
        this.http.delete<any>(`${this.server}api/Productos/EliminarProducto`, options).subscribe(
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
  
  async ActulizarProducto(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.server}api/Productos/AlctualizarProducto`, data).subscribe(
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
  

  async Productos(load : boolean): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Productos/TodosProductos`);
    } finally {
    
    }
  }


  async buscarProducto(id: number): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Productos/BuscarProducto/${id}`);
    } finally {
    }
  }
}
