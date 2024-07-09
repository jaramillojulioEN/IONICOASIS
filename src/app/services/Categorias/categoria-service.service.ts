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

  CrearCategoria(categoria: string, idsubcategoria: number): Observable<any> {
    const data = {
      categoria: categoria,
      idsubcategoria: idsubcategoria
    };

    return this.http.post<any>(`${this.server}api/Categorias/CrearCategoria`, data);
  }

  async EliminarCatego(id: number): Promise<Observable<any>> {
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

      await this.LoaderFunctions.StartLoader();
      return this.http.delete<any>(`${this.server}api/Categorias/EliminarCategoria`, options);
    } finally {
      this.LoaderFunctions.StopLoader();
    }
  }



  buscarCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/BusacarCategoria/${id}`);
  }

  ActulizarCategoria(id: number, categoria:string): Observable<any> {
    return new Observable(observer => {

        const data = {
          categoria: categoria,
          id: id
        };

        this.http.put<any>(`${this.server}api/Cetegorias/AlctualizarCategoria`, data).subscribe(
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
