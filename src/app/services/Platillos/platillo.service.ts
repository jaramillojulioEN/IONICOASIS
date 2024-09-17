import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class PlatilloService {
  server: string;

  constructor(
    private user: UserServiceService,
    private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = this.user.getServer()
  }


  async CrearPlatillo(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Platillos/CrearPlatillo`, data).subscribe(
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

  async EliminarPlatillo(id: number): Promise<Observable<any>> {
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
        this.http.delete<any>(`${this.server}api/Platillos/EliminarPlatillo`, options).subscribe(
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

  async ActulizarPlatillo(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.put<any>(`${this.server}api/Platillos/AlctualizarPlatillo`, data).subscribe(
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

  async existencias(data: any): Promise<Observable<any>> {
    try {
      var platillo = data.idreceta ? true : false;
      console.log(platillo);
      var user = this.user.getUser()
      return this.http.get<any>(`${this.server}api/Platillos/Existencia/${platillo ? data.idreceta : data.id}/${user.idsucursal}/${platillo}`);
    } finally {
    }
  }

  async Platillos(loader: boolean = true, idsubcatego: number, idcatego: number = 0, criterio: string = ""): Promise<Observable<any>> {
    try {
      if (criterio === "") {
        criterio = "empty"
      }
      return this.http.get<any>(`${this.server}api/Platillos/TodosPlatillos/${idsubcatego}/${idcatego}/${criterio}`);
    } finally {
    }
  }
}
