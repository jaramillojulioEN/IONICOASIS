import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import {LoaderFunctions} from "src/functions/utils"
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})


export class CategoriaServiceService {
  server: any;

  constructor(
    private user : UserServiceService,
    private http: HttpClient, private LoaderFunctions : LoaderFunctions) {
    this.server = this.user.getServer()
  }

  SubCategorias(): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/SubCategorias`);
  }

  Categorias(idsubcategoria : number = 0): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/Categorias/${idsubcategoria}`);
  }

  CrearCategoria(categoria: string, idsubcategoria: number, load: boolean = true): Observable<any> {
    const data = {
      categoria: categoria,
      idsubcategoria: idsubcategoria
    };
    return new Observable(observer => {
      const loaderPromise = load ? this.LoaderFunctions.StartLoader() : Promise.resolve();
      loaderPromise.then(() => {
        this.http.post<any>(`${this.server}api/Categorias/CrearCategoria`, data).subscribe(
          async response => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }
  
  async EliminarCatego(id: number, load: boolean = true): Promise<Observable<any>> {
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
      const loaderPromise = load ? this.LoaderFunctions.StartLoader() : Promise.resolve();
      loaderPromise.then(() => {
        this.http.delete<any>(`${this.server}api/Categorias/EliminarCategoria`, options).subscribe(
          async response => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }
  
  ActulizarCategoria(id: number, categoria: string, load: boolean = true): Observable<any> {
    const data = {
      categoria: categoria,
      id: id
    };
  
    return new Observable(observer => {
      const loaderPromise = load ? this.LoaderFunctions.StartLoader() : Promise.resolve();
  
      loaderPromise.then(() => {
        this.http.put<any>(`${this.server}api/Cetegorias/AlctualizarCategoria`, data).subscribe(
          async response => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.next(response);
            observer.complete();
          },
          async error => {
            if (load) await this.LoaderFunctions.StopLoader();
            observer.error(error);
          }
        );
      });
    });
  }
  

  buscarCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/BusacarCategoria/${id}`);
  }


}
