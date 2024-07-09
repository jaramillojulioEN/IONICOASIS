import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import { UserServiceService } from '../Users/user-service.service'
@Injectable({
  providedIn: 'root'
})
export class LavadoService {
  server: string = ""
  constructor(
    private UserServiceService: UserServiceService,
    private loaderFunctions: LoaderFunctions,
    private http: HttpClient
  ) {
    this.server = this.UserServiceService.getServer()
  }
  async Vehiculos(loader: boolean = true): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Servicios/TodosServicios`);
    } finally {
      if (loader)
        this.loaderFunctions.StopLoader();
    }
  }

  async Servicios(loader: boolean = true): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Servicios/Servicios`);
    } finally {
      if (loader)
        this.loaderFunctions.StopLoader();
    }
  }

  async lavados(estado: number, loader: boolean = true): Promise<Observable<any>> {
    try {
      if (loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Servicios/Lavados/${estado}`);
    } finally {
      if (loader)
        this.loaderFunctions.StopLoader();
    }
  }

  async CrearLavado(data: object, load: boolean = true): Promise<Observable<any>> {
    console.log(data)
    try {
      if (load)
        await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Servicios/AccionesServicio`, data);
    } finally {
      if (load)
        this.loaderFunctions.StopLoader();
    }
  }

  async ImprimirRecibo(data: object, load: boolean = false): Promise<Observable<any>> {
    console.log(data)
    try {
      if (load)
        await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Ordenes/Imprimir`, data);
    } finally {
      if (load)
        this.loaderFunctions.StopLoader();
    }
  }
}
