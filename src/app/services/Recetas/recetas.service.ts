import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service'
@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  server: string;

  constructor(
    private http: HttpClient,
    private loaderFunctions: LoaderFunctions,
    private user: UserServiceService
  ) {
    this.server = this.user.getServer()
  }

  agregarImagenALista(listaid: number, b64: string) {
    const url = this.server + 'api/Recetas/CrearImagenes';
    const body = {
      idlistaimagen: listaid,
      cadenab64: b64
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post(url, body, { headers }).pipe(
          catchError(error => {
            console.error('Error al agregar la imagen:', error);
            return throwError('Error al agregar la imagen');
          })
        ).subscribe(
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
  
  agregarIngredienteALista(data: any) {
    const url = this.server + 'api/Recetas/CrearIngredientes';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post(url, data, { headers }).pipe(
          catchError(error => {
            console.error('Error al agregar el ingrediente:', error);
            return throwError('Error al agregar el ingrediente');
          })
        ).subscribe(
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
  
  async EliminarIngrediente(idi: number, idl: number): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.get<any>(`${this.server}api/Recetas/EliminarIngrediente/${idi}/${idl}`).subscribe(
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
  
  async CrearReceta(data: object): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.post<any>(`${this.server}api/Recetas/CrearReceta`, data).subscribe(
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
  
  async EliminarImagen(idi: number, idl: number): Promise<Observable<any>> {
    return new Observable(observer => {
      this.loaderFunctions.StartLoader().then(() => {
        this.http.get<any>(`${this.server}api/Recetas/EliminarImagen/${idi}/${idl}`).subscribe(
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
  

  crearListaIngredientes(descripcion: string) {
    const url = this.server + 'api/Recetas/CrearListaIngredientes';
    const body = {
      descripcion: descripcion
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear la lista de ingredientes:', error);
        return throwError('Error al crear la lista de ingredientes');
      })
    );
  }

  crearListaImagenes(descripcion: string) {
    const url = this.server + 'api/Recetas/CrearListaImagenes';
    const body = {
      descripcion: descripcion
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear la lista de imagenes:', error);
        return throwError('Error al crear la lista de imagenes');
      })
    );
  }


  obtenerItemsListaIngredientes(id: number) {
    const url = `${this.server}api/Recetas/ObtenerIngredientes/${id}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error al obtener los valores de la API:', error);
        return throwError('Error al obtener los valores de la API');
      })
    );
  }


  obtenerItemsListaImagenes(id: number) {
    const url = `${this.server}api/Recetas/ObtenerImagenes/${id}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error al obtener los valores de la API:', error);
        return throwError('Error al obtener los valores de la API');
      })
    );
  }


  async Recetas(load: Boolean = true): Promise<Observable<any>> {
    try {
      return this.http.get<any>(`${this.server}api/Recetas/TodasRecetas`);
    } finally {
    }
  }

}
