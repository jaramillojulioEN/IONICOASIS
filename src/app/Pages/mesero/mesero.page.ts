import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasService } from 'src/app/services/Mesas/mesas.service'
import { OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { CortesService } from 'src/app/services/cortes/cortes.service';
@Component({
  selector: 'app-mesero',
  templateUrl: './mesero.page.html',
  styleUrls: ['./mesero.page.scss'],
})
export class MeseroPage implements OnInit {

  images: string[] = [
    "https://i.imgur.com/rzaD9MO.png",
    "https://i.imgur.com/lKYGtBL.png",
    "https://i.imgur.com/aIHBrsB.png",
    "https://i.imgur.com/3lXXAwW.png",
    "https://i.imgur.com/qveoNYY.png"
  ]
  mesas: any = [];
  error: any = "Caja cerrada"
  mensaje: any;

  constructor(
    private MesasService: MesasService,
    private cortesService: CortesService,
    private ModalController: ModalController) { }



  private intervalId: any;



  getEstado(estado: number): string {
    switch (estado) {
      case -1:
        return "Tomando orden";
      case 1:
        return "Orden pendiente";
      case 2:
        return "Cocinando";
      case 3:
        return "Listo para recoger (terminada)";
      case 4:
        return "Orden cerrada";
      case 5:
        return "Orden Cobrada";
      case 6:
        return "Orden Cancelada";
      default:
        return "Estado desconocido";
    }
  }

  colorin(orden: any): string {
    if (orden.length == 0) {
      return this.images[1]
    }
    else {
      switch (orden[0].estado) {
        case 1:
          return this.images[0]
        case 2:
          return this.images[2]
        case 3:
          return this.images[4]
        case 4:
          return this.images[3]
        default:
          return this.images[1]
          break;
      }
    }

  }

  ngOnInit() {
    this.ObtenerMesas()
    window.addEventListener('success', () => {
      this.ObtenerMesas(false)
    })

    window.addEventListener('mesas', () => {
      this.ObtenerMesas(true)
    })
  }

  async handleRefresh(event: any) {
    this.ObtenerMesas(true);
    event.target.complete();
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
        id: "tomaordenmodal",
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
        this.mensaje = response.message;
        if (response && response.mesas) {
          this.mesas = response.mesas;
        } 
      },
      (error: any) => {
        console.error('Error en la solicitud error:', error);
      }
    );
  }

}
