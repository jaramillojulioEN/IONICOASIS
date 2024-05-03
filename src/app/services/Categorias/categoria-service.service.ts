import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CategoriaServiceService {
  server: any;

  constructor(private http: HttpClient) {
    this.server = "https://localhost:44397/"
  }

  SubCategorias(): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/SubCategorias`);
  }

  Categorias(): Observable<any> {
    return this.http.get<any>(`${this.server}api/Categorias/Categorias`);
  }

  CrearCategoria(categoria: string, idsubcategoria: number): Observable<any> {
    const data = {
      categoria: categoria,
      idsubcategoria: idsubcategoria
    };

    return this.http.post<any>(`${this.server}api/Categorias/CrearCategoria`, data);
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
