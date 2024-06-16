import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BebidaComponent } from '../../Components/Modals/BebidasModal/bebida/bebida.component'
import { MenuController } from '@ionic/angular';
import { BebidaService } from '../../services/Bebidas/bebida.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
@Component({
  selector: 'app-bebidas',
  templateUrl: './bebidas.page.html',
  styleUrls: ['./bebidas.page.scss'],
})
export class BebidasPage implements OnInit {
  BebidaArry: any = [];

  constructor(
    private BebidaService: BebidaService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.ObtenerBebidas()
    window.addEventListener('success', () => {
      this.ObtenerBebidas();
    })
  }

  async AbrirModalbebida(id:number, titulo:string, data : any = null) {
    const modal = await this.ModalController.create({
      component: BebidaComponent,
      componentProps: {
        id: id,
        titulo : titulo,
        data : data
      },
    });
    return await modal.present();
  }

  async ObtenerBebidas(load : boolean = true): Promise<void> {
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
    this.ModalController.dismiss()
  }

  async Eliminarbebida(bebida: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la bebida: " + bebida.nombre, () => this.ConfirmarELiminar(bebida.id));
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.Eliminarbebida(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModalbebida(data.id, "Actualizar", data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async ConfirmarELiminar (id : number) :Promise<void> {
    (await this.BebidaService.EliminarBebida(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerBebidas(false);
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
