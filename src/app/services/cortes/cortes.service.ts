import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LoaderFunctions } from '../../../functions/utils';
import {UserServiceService} from '../Users/user-service.service'

@Injectable({
  providedIn: 'root'
})
export class CortesService {
  server : string = ""
  constructor(
    private UserServiceService : UserServiceService,
    private loaderFunctions : LoaderFunctions,
    private http : HttpClient
  ) {
    this.server = this.UserServiceService.getServer()
  }

  async ActulizarCaja(data: object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return new Observable(observer => {
        this.http.put<any>(`${this.server}api/Cortes/ActualizarCorte`, data).subscribe(
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

  async CrearInicio(data : object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Cortes/CrearCorte`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async Retirar(data : object): Promise<Observable<any>> {
    try {
      await this.loaderFunctions.StartLoader();
      return this.http.post<any>(`${this.server}api/Cortes/CrearRetiro`, data);
    } finally {
      this.loaderFunctions.StopLoader();
    }
  }

  async CortesActivos(estado : number, loader : boolean = true): Promise<Observable<any>> {
    try {
      if(loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Cortes/TodosCortes/${estado}`);
    } finally {
      if(loader)
      this.loaderFunctions.StopLoader();
    }
  }

  async RetirosActivos(loader : boolean = true): Promise<Observable<any>> {
    try {
      if(loader)
        await this.loaderFunctions.StartLoader();
      return this.http.get<any>(`${this.server}api/Cortes/TodosRetiros`);
    } finally {
      if(loader)
      this.loaderFunctions.StopLoader();
    }
  }


}
