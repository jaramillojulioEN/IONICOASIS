import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasService } from 'src/app/services/Mesas/mesas.service'
import { OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
@Component({
  selector: 'app-mesero',
  templateUrl: './mesero.page.html',
  styleUrls: ['./mesero.page.scss'],
})
export class MeseroPage implements OnInit {

  images: string[] = [
    "https://i.imgur.com/3lXXAwW.png",
    "https://i.imgur.com/lKYGtBL.png",
    "https://i.imgur.com/lKYGtBL.png",
    "https://i.imgur.com/lKYGtBL.png",
  ]
  mesas: any = [];

  constructor(private MesasService: MesasService, private ModalController: ModalController) { }


  private intervalId: any;

  ngOnInit() {
    this.ObtenerMesas()
    this.intervalId = setInterval(() => {
      this.ObtenerMesas(false);
    }, 5000);
    window.addEventListener('success', () => {
      this.ObtenerMesas()
    })
  }

  async VerOrden(data: any, titulo: string = "") {
    var modal: any = null;
    if (data.ordenes.length != 0) {
      modal = await this.ModalController.create({
        component: DetalleordenComponent,
        componentProps: {
          mesa: data
        },
      });
    } else {
      modal = await this.ModalController.create({
        component: OrdnComponent,
        componentProps: {
          titulo: titulo,
          idmesa: data.id,
          orden: data
        },
      });
    }

    return await modal.present();
  }

  async ObtenerMesas(load: boolean = true): Promise<void> {
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
  }

}
