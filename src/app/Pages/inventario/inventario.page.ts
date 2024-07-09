import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import {ExistenciasComponent} from 'src/app/Components/Modals/existencias/existencias.component'
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  productos: any = [];
  BebidaArry: any = [];

  constructor(
    private ProductoService : ProductoServiceService,
    private BebidaService : BebidaService,
    private ac : AlertServiceService,
    private ModalController : ModalController
  ) { }
  segmento : string = "productos";
  ngOnInit() {
    this.ObtenerProducutos();
    this.ObtenerBebidas();
    window.addEventListener('successb', () => {
      this.ObtenerBebidas(false);
    })
    window.addEventListener('successp', () => {
      this.ObtenerProducutos(false);
    })
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnAgregar, handler: () => this.agregarExistecias(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async agregarExistecias(data : any){
    
    const modal = await this.ModalController.create({
      component: ExistenciasComponent,
      componentProps: {
        data : data
      },
    });
    return await modal.present();

  }
  
  async ObtenerBebidas(load : boolean = false): Promise<void> {
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

  async ObtenerProducutos(load: boolean = true): Promise<void> {
    (await this.ProductoService.Productos(load)).subscribe(
      async (response: any) => {
        if (response && response.productos) {
          this.productos = response.productos;
          console.log(this.productos)
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
