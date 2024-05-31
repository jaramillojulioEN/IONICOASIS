import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  server: string;

  constructor(private http: HttpClient, private loaderFunctions: LoaderFunctions) {
    this.server = "https://localhost:44397/"
  }

  async CrearEmpleado(data : object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();

      return this.http.post<any>(`${this.server}api/Empleados/CrearEmpleado`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async EliminarEmpleado(id: number): Promise<Observable<any>> {
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
      return this.http.delete<any>(`${this.server}api/Empleados/EliminarEmpleado`, options);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async RefactorizarConsumo(consumo: any, isdelete : boolean): Promise<Observable<any>> {
    try {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: consumo
      };
      await this.loaderFunctions.StartLoader();
      return isdelete ? this.http.delete<any>(`${this.server}api/Empleados/EliminarConsumo`, options)
      : this.http.put<any>(`${this.server}api/Empleados/EditarConsumo`, options);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async ActulizarEmpleado(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return new Observable(observer => {
        this.http.put<any>(`${this.server}api/Empleados/AlctualizarEmpleado`, data).subscribe(
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
  
  async Empleados(loader : boolean = true): Promise<Observable<any>> {
    try {
      if(loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Empleados/TodosEmpleados`);
    } finally {
      if(loader)
      this.loaderFunctions.StopLoader();
    }
  }

}
