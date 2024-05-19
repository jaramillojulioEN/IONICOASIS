import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';

@Injectable({
  providedIn: 'root'
})
export class BebidaService {
  server: string;

  constructor(
    private http: HttpClient,
    private loaderFunctions: LoaderFunctions) {
    this.server = "https://localhost:44397/"
  }

  async CrearBebida(data : object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Bebidas/CrearBebidas`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async EliminarBebida(id: number): Promise<Observable<any>> {
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
      return this.http.delete<any>(`${this.server}api/Bebidas/EliminarBebida`, options);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async ActulizarBebida(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return new Observable(observer => {
        this.http.put<any>(`${this.server}api/Bebidas/AlctualizarBebida`, data).subscribe(
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
  
  async Bebidas(loader : boolean = true): Promise<Observable<any>> {
    try {
      if(loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Bebidas/TodosBebidas`);
    } finally {
      if(loader)
      this.loaderFunctions.StopLoader();
    }
  }
}
