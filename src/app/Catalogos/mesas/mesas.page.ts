import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { MenuController } from '@ionic/angular';
import { MesasService } from 'src/app//services/Mesas/mesas.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {

  mesas: any = []

  constructor(
    private MesasService: MesasService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
  ) { }

  ngOnInit() {
    this.ObtenerMesas()
    window.addEventListener('success', () => {
      this.ModalController.dismiss()
      this.ObtenerMesas()
    })
  }

  async AbrirModalMesas(id:number, titulo:string, data : any = null) {
    const modal = await this.ModalController.create({
      component: MesasComponent,
      componentProps: {
        id: id,
        titulo : titulo,
        data : data
      },
    });
    return await modal.present();
  }

  async ObtenerMesas(load : boolean = true): Promise<void> {
    (await this.MesasService.Mesas(load)).subscribe(
      async (response: any) => {
        if (response && response.mesas) {
          this.mesas = response.mesas;
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

  async EliminarMesa(mesa: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la mesa: " + mesa.descripcion, () => this.ConfirmarELiminar(mesa.id));
  }
  

  async ConfirmarELiminar (id : number) :Promise<void> {
    (await this.MesasService.EliminarMesa(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerMesas(false);
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
