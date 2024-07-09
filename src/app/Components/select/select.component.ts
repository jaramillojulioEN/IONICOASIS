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
    (await this.PlatilloService.Platillos(load, 2)).subscribe(
      async (response: any) => {
        if (response && response.platillos) {
          this.PlatilloArry = response.platillos;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async ObtenerBebidasPrp(load: boolean = false): Promise<void> {
    (await this.PlatilloService.Platillos(load, 1)).subscribe(
      async (response: any) => {
        if (response && response.platillos) {
          this.bebsPrp = response.platillos;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  Dissmiss(data: any, isprp: boolean = false) {
    if (isprp) {
      data.isprep = isprp
    }
    this.pop.dismiss(data)
  }

  async ObtenerBebidas(load: boolean = false): Promise<void> {
    (await this.BebidaService.Bebidas(load)).subscribe(
      async (response: any) => {
        if (response && response.bebidas) {
          this.BebidaArry = response.bebidas;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

}
