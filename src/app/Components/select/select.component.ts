import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { PlatilloService } from 'src/app/services/Platillos/platillo.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  PlatilloArry: any = [];
  BebidaArry: any = [];
  criterio: string = ""
  @Input() isPlatillo: boolean = true
  bebsPrp: any = [];
  loaded: boolean = false;;

  constructor(
    private PlatilloService: PlatilloService,
    private BebidaService: BebidaService,
    private pop: PopoverController
  ) { }
  ngOnInit() {
    this.ObtenerPlatillos()
    this.ObtenerBebidas()
    this.ObtenerBebidasPrp();
  }

  async ObtenerPlatillos(load: boolean = false): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.PlatilloService.Platillos(load, 2)).toPromise();

      if (response && response.platillos) {
        this.PlatilloArry = response.platillos;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  async ObtenerBebidasPrp(load: boolean = false): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.PlatilloService.Platillos(load, 1)).toPromise();

      if (response && response.platillos) {
        this.bebsPrp = response.platillos;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  Dissmiss(data: any, isprp: boolean = false) {
    if (isprp) {
      data.isprep = isprp
    }
    this.pop.dismiss(data)
  }

  async ObtenerBebidas(load: boolean = false): Promise<void> {
    try {
      this.loaded = false; 
      const response: any = await (await this.BebidaService.Bebidas(load)).toPromise();
  
      if (response && response.bebidas) {
        this.BebidaArry = response.bebidas;
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
