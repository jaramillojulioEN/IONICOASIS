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

  async CrearProducto(cantidad: number, nombre: string, idcategoria: number): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      const data = {
        nombre: nombre,
        cantidad: cantidad,
        idcategoria: idcategoria
      };
      return this.http.post<any>(`${this.server}api/Productos/CrearProducto`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async Productos(load : boolean): Promise<Observable<any>> {
    try {
      if(load)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Productos/TodosProductos`);
    } finally {
      if(load)
        this.loaderFunctions.StopLoader();
    }
  }

  async EliminarProductos(id: number): Promise<Observable<any>> {
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
      return this.http.delete<any>(`${this.server}api/Productos/EliminarProducto`, options);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }
  async buscarProducto(id: number): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Productos/BuscarProducto/${id}`);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async ActulizarProducto(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return new Observable(observer => {
        this.http.put<any>(`${this.server}api/Productos/AlctualizarProducto`, data).subscribe(
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
}
