import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class BebidaService {
  server: string;

  constructor(
    private user: UserServiceService,
    private http: HttpClient,
    private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }

  async CrearBebida(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Bebidas/CrearBebidas`, data).subscribe(
          async createdResponse => {
            await this.loaderFunctions.StopLoader();
            observer.next(createdResponse);
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

  async EliminarBebida(id: number): Promise<Observable<any>> {
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
        this.http.delete<any>(`${this.server}api/Bebidas/EliminarBebida`, options).subscribe(
          async deletedResponse => {
            await this.loaderFunctions.StopLoader();
            observer.next(deletedResponse);
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

  async ActulizarBebida(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.server}api/Bebidas/AlctualizarBebida`, data).subscribe(
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


  async Bebidas(loader: boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Bebidas/TodosBebidas`);
    } finally {
    }
  }
}
