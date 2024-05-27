import { Component, OnInit } from '@angular/core';
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.page.html',
  styleUrls: ['./cocina.page.scss'],
})
export class CocinaPage implements OnInit {
  ordenes: any = [];

  constructor(private OrdenesService: OrdenesService, private ModalController: ModalController) { }

  ngOnInit() {
    this.ObtenerOrdenes(true)
  }

  async VerOrden(data: any) {
    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleordenComponent,
      componentProps: {
        mesa: data.mesas,
        ordenC: data
      },
    });
    return await modal.present();
  }

  async ObtenerOrdenes(load: boolean = true): Promise<void> {
    (await this.OrdenesService.OrdenesPendientes(load)).subscribe(
      async (response: any) => {
        if (response && response.ordenes) {
          this.ordenes = response.ordenes;
          console.log(this.ordenes)
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
