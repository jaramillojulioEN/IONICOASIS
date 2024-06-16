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
    private user : UserServiceService
  ) {
    this.server = this.user.getServer()
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

  agregarImagenALista(listaid: number, b64: string) {
    const url = this.server + 'api/Recetas/CrearImagenes';
    const body = {
      idlistaimagen: listaid,
      cadenab64: b64
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error al agregar la imagen:', error);
        return throwError('Error al agregar la imagen');
      })
    );
  }

  agregarIngredienteALista(listaIngredientesId: number, idp: number, cantidad: number) {
    const url = this.server + 'api/Recetas/CrearIngredientes';
    const body = {
      idproducto: idp,
      idlistaingredientes: listaIngredientesId,
      cantidad: cantidad
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error al agregar el ingrediente:', error);
        return throwError('Error al agregar el ingrediente');
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


  async EliminarIngrediente(idi: number, idl: number): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Recetas/EliminarIngrediente/${idi}/${idl}`);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async CrearReceta(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Recetas/CrearReceta`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async Recetas(load: Boolean = true): Promise<Observable<any>> {
    try {
      if (load) {
        await this.loaderFunctions.StartLoader();
      }
      return this.http.get<any>(`${this.server}api/Recetas/TodasRecetas`);
    } finally {
      if (load) {
        this.loaderFunctions.StopLoader();
      }
    }
  }


  async EliminarImagen(idi: number, idl: number): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Recetas/EliminarImagen/${idi}/${idl}`);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

}
