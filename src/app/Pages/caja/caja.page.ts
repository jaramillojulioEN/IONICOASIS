import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {
  segmento: string = "pago"
  fechaActual: string = "";
  private intervalId: any;
  ordenes: any = [];
  constructor(
    private os: OrdenesService,
    private mc: ModalController
  ) { }

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.getordenes(4, true);
    this.intervalId = setInterval(() => {
      this.getordenes(4);
    }, 5000);
    window.addEventListener('success', () => {
      this.getordenes(4, true);
    })
  }




  async cobrarOrden(orden : any) {
    const modal = await this.mc.create({
      component: TicketComponent,
      componentProps : {
        orden : orden
      },
      backdropDismiss: false
    });
    return await modal.present();
  }


  async getordenes(estado: number, load: boolean = false): Promise<void> {
    (await this.os.OrdenesPendientes(load, estado)).subscribe(
      async (response: any) => {
        if (response.ordenes != null) {
          this.ordenes = response.ordenes
        }
      },
      (error: any) => {
        console.log(error)
      }
    );

  }

}
