import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';

@Component({
  selector: 'app-pasado',
  templateUrl: './pasado.page.html',
  styleUrls: ['./pasado.page.scss'],
})
export class PasadoPage implements OnInit {
  loaded: boolean = false;
  ordenes: any = [];
  intervalId: any;

  constructor(
    private OrdenesService : OrdenesService
  ) { }

  ngOnInit() {
    this.ObtenerOrdenes()
    this.intervalId = setInterval(() => {
      this.ObtenerOrdenes(false);
    }, 6000);
  }


  async ObtenerOrdenes(load: boolean = true): Promise<void> {
    try {
      if (load) {
        this.loaded = false;
      }
      const response: any = await (await this.OrdenesService.OrdenesPendientes(load, 99)).toPromise();
      if (response && response.ordenes) {
        this.ordenes = response.ordenes;
        console.log(this.ordenes)
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }





}
