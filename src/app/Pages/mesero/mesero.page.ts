import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasService } from 'src/app/services/Mesas/mesas.service'
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
  ]
  mesas: any = [];

  constructor(private MesasService: MesasService, private ModalController: ModalController) { }



  ngOnInit() {
    this.ObtenerMesas()
  }

  async VerOrden(data: any) {
    const modal = await this.ModalController.create({
      component: DetalleordenComponent,
      componentProps: {
        mesa: data
      },
    });
    return await modal.present();
  }

  async ObtenerMesas(load: boolean = true): Promise<void> {
    (await this.MesasService.Mesas(load)).subscribe(
      async (response: any) => {
        if (response && response.mesas) {
          this.mesas = response.mesas;
          console.log(this.mesas)
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
