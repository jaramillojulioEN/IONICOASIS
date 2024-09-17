import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { MesasService } from 'src/app//services/Mesas/mesas.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
import { Calls } from 'src/functions/call';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {

  mesas: any = []

  loaded : boolean = false
  constructor(
    private MesasService: MesasService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private call : Calls
  ) { }

  sucursales: any = [];

  async ngOnInit() {
    this.sucursales = await this.call.getsucus()
    console.log(this.sucursales)
    this.ObtenerMesas()
    window.addEventListener('success', () => {
      this.ModalController.dismiss()
      this.ObtenerMesas()
    })
  }

  idu : any = 0
  change(){
    this.ObtenerMesas(true, this.idu)
  }
  async AbrirModalMesas(id: number, titulo: string, data: any = null) {
    const modal = await this.ModalController.create({
      component: MesasComponent,
      componentProps: {
        id: id,
        titulo: titulo,
        data: data
      },
    });
    return await modal.present();
  }

  async ObtenerMesas(load: boolean = true, idsu : number = 0): Promise<void> {
    this.loaded = false; 
    try {
      const response: any = await (await this.MesasService.Mesas(load, idsu)).toPromise();
  
      if (response && response.mesas) {
        this.mesas = response.mesas;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }
  
  EliminarMesa(mesa: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la mesa: " + mesa.descripcion, () => this.ConfirmarELiminar(mesa.id));
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.EliminarMesa(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModalMesas(data.id, "Actualizar", data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async ConfirmarELiminar(id: number): Promise<void> {
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
