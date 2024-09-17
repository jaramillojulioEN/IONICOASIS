import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { ExistenciasComponent } from 'src/app/Components/Modals/existencias/existencias.component'
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CantidesComponent } from 'src/app/Components/Modals/cantides/cantides.component';
import { Calls } from 'src/functions/call';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  productos: any = [];
  BebidaArry: any = [];
  loaded: boolean = false;
  rol: any = []
  sucursales: any = [];
  constructor(
    private ProductoService: ProductoServiceService,
    private BebidaService: BebidaService,
    private ac: AlertServiceService,
    private ModalController: ModalController,
    private us: UserServiceService,
    private call: Calls
  ) { }
  segmento: string = "productos";
  async ngOnInit() {
    this.sucursales = await this.call.getsucus()
    this.rol = this.us.getRol();
    this.ObtenerProducutos();
    this.ObtenerBebidas();
    window.addEventListener('successb', () => {
      this.ObtenerBebidas(false);
      this.ModalController.dismiss()
    })
    window.addEventListener('successp', () => {
      this.ObtenerProducutos(false);
      this.ModalController.dismiss()
    })
  }


  async handleRefresh(event: any) {
    await this.ObtenerProducutos();
    await this.ObtenerBebidas();
    event.target.complete();
  }


  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnAgregar, handler: () => this.agregarExistecias(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async agregarExistecias(data: any) {

    const modal = await this.ModalController.create({
      component: ExistenciasComponent,
      componentProps: {
        data: data
      },
    });
    return await modal.present();

  }

  async vercantidades(data: any) {

    const modal = await this.ModalController.create({
      component: CantidesComponent,
      componentProps: {
        data: data
      },
    });
    return await modal.present();
  }

  async ObtenerBebidas(load: boolean = false): Promise<void> {
    this.loaded = false;
    try {
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


  async ObtenerProducutos(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.ProductoService.Productos(load)).toPromise();

      if (response && response.productos) {
        this.productos = response.productos;
        console.log(this.productos)
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
