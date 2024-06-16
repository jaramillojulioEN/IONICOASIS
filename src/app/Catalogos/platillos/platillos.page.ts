import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlatilloNuevoComponent } from '../../Components/Modals/Platillos/platillo-nuevo/platillo-nuevo.component'
import { MenuController } from '@ionic/angular';
import {PlatilloService} from '../../services/Platillos/platillo.service'
import {AlertServiceService} from '../../services/Alerts/alert-service.service'

@Component({
  selector: 'app-platillos',
  templateUrl: './platillos.page.html',
  styleUrls: ['./platillos.page.scss'],
})
export class PlatillosPage implements OnInit {
  PlatilloArry: any = [];

  constructor(
    private PlatilloService : PlatilloService,
    private ModalController: ModalController, 
    private ac : AlertServiceService,
    private menu: MenuController) { }

  ngOnInit() {
    this.ObtenerPlatillos();
    window.addEventListener('success', () => {
      this.ObtenerPlatillos();
    })
  }

  async AbrirModalPlatillo(id:number, titulo:string, data : any = null) {
    const modal = await this.ModalController.create({
      component: PlatilloNuevoComponent,
      componentProps: {
        id: id,
        titulo : titulo,
        data : data
      },
    });
    return await modal.present();
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.EliminarPlatillo(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModalPlatillo(data.id, "Actualizar", data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async ObtenerPlatillos(load : boolean = true): Promise<void> {
    (await this.PlatilloService.Platillos(load)).subscribe(
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
    this.ModalController.dismiss()
  }

  async EliminarPlatillo(platillo: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar el platillo: " + platillo.nombre, () => this.ConfirmarELiminar(platillo.id));
  }
  

  async ConfirmarELiminar (id : number) :Promise<void> {
    (await this.PlatilloService.EliminarPlatillo(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerPlatillos(false);
          this.ac.presentCustomAlert("Exito", response.message)
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
