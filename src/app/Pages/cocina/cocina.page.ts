import { Component, OnInit } from '@angular/core';
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.page.html',
  styleUrls: ['./cocina.page.scss'],
})
export class CocinaPage implements OnInit {
  ordenes: any = [];
  intervalId: any | undefined;

  constructor(
    private OrdenesService: OrdenesService, 
    private ModalController: ModalController,
    private ac : AlertServiceService
  ) { }

  ngOnInit() {

    this.ObtenerOrdenes(true)
    this.intervalId = setInterval(() => {
      this.ObtenerOrdenes(false);
    }, 5000);
  }

  getEstado(estado: number): string {
    switch (estado) {
      case 1:
        return "Orden pendiente";
      case 2:
        return "Cocinado";
      case 3:
        return "Listo para recoger (terminada)";
      case 4:
        return "Orden cerrada";
      case 5:
        return "Orden Cobrada";
      default:
        return "Estado desconocido";
    }
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnVerOrden, handler: () => this.VerOrden(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
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
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  Getestimandos(orden: any): any {
    let tiempototal = 0;
    const fechaorden = new Date(orden.fecha);
    orden.ordenesplatillos.forEach((element: any) => {
      tiempototal += element.platillos.recetas.tiempopreparacion;
    });
    fechaorden.setMinutes(fechaorden.getMinutes() + tiempototal);
    const horaEntrega =
      fechaorden.getHours() + ':' +
      (fechaorden.getMinutes() <= 9 ? '0' + fechaorden.getMinutes() : fechaorden.getMinutes());
    return  [tiempototal, horaEntrega];
  }

}
