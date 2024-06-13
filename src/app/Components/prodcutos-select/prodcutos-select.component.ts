import { Component, Input, OnInit } from '@angular/core';
import { PlatilloService } from 'src/app/services/Platillos/platillo.service'
import { BebidaService } from 'src/app/services/Bebidas/bebida.service'
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-prodcutos-select',
  templateUrl: './prodcutos-select.component.html',
  styleUrls: ['./prodcutos-select.component.scss'],
})
export class ProdcutosSelectComponent implements OnInit {
  platos: any = [];
  bebidas: any = [];

  constructor(protected md : ModalController,protected PlatilloService : PlatilloService, protected BebidaService : BebidaService) { }

  ngOnInit() {
    if(this.platillos){
      this.ObtenerPlatillos()
    }else{
      this.ObtenerBebidas()
    }
  }

  @Input() platillos : boolean = true;

  async ObtenerPlatillos(load: boolean = false): Promise<void> {
    (await this.PlatilloService.Platillos(load)).subscribe(
      async (response: any) => {
        if (response && response.platillos) {
          this.platos = response.platillos;
          console.log(this.platos)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async ObtenerBebidas(load : boolean = false): Promise<void> {
    (await this.BebidaService.Bebidas(load)).subscribe(
      async (response: any) => {
        if (response && response.bebidas) {
          this.bebidas = response.bebidas;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }
  seleccionar(id : number){
    this.md.dismiss(id);
  }
}
