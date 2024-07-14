import { Component, OnInit } from '@angular/core';
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { Subscription } from 'rxjs';
import { Howl, Howler } from 'howler';
import { CortesService } from 'src/app/services/cortes/cortes.service';

interface Timer {
  id: number;
  elapsedTime: Date;
  subscription?: Subscription;
}

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.page.html',
  styleUrls: ['./cocina.page.scss'],
})
export class CocinaPage implements OnInit {
  ordenes: any = [];
  intervalId: any | undefined;
  timers: { [idorden: number]: Timer } = {};

  ordeninicial: any = []
  notificaciones: { [idorden: number]: number } = {};
  private sound: Howl;
  caja: boolean = false;
  loaded: boolean = false;

  constructor(
    private OrdenesService: OrdenesService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private cortesService: CortesService
  ) {

    this.sound = new Howl({
      src: ['assets/audio/file.mp3']
    });
  }

  ngOnInit() {
    this.obtenerCajaActiva()
    const notificacionesString = localStorage.getItem("notificaciones");
    if (notificacionesString) {
      this.notificaciones = JSON.parse(notificacionesString)
    }
    this.ObtenerOrdenes(true)
    this.intervalId = setInterval(() => {
      this.obtenerCajaActiva()
      this.ObtenerOrdenes(false);
    }, 5000);
  }

  getEstado(estado: number): string {
    switch (estado) {
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

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnVerOrden, handler: () => this.VerOrden(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async obtenerCajaActiva(load: boolean = false): Promise<void> {
    try {
      (await this.cortesService.CortesActivos(1, load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            if (response.Cortes.length > 0) {
              this.caja = true;
            }
            else {
              this.caja = false
            }
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  async VerOrden(data: any) {
    if (this.notificaciones[data.id]) {
      delete this.notificaciones[data.id]
    }
    localStorage.setItem("notificaciones", JSON.stringify(this.notificaciones))
    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleordenComponent,
      canDismiss: true,
      componentProps: {
        activetimers: this.timers,
        mesa: data.mesas,
        ordenC: data,
        closeModalCallback: this.handleCloseModal.bind(this),
      },
    });

    return await modal.present();
  }

  handleCloseModal(timers: { [id: number]: Timer }) {
    this.timers = timers
    this.startTimers()
  }

  startTimers() {
    Object.values(this.timers).forEach(timer => {
      if (timer) {
        timer.subscription = setInterval(() => {
          timer.elapsedTime = new Date(timer.elapsedTime.getTime() + 1);
        }, 1000) as any; // Usar 'as any' si TypeScript muestra errores
      }
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad with leading zeros if necessary
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = remainingSeconds.toString().padStart(2, '0');

    return `${minutesString}:${secondsString}`;
  }

  // async ObtenerOrdenes(load: boolean = true): Promise<void> {
  //   (await this.OrdenesService.OrdenesPendientes(load)).subscribe(
  //     async (response: any) => {
  //       if (response && response.ordenes) {
  //         this.ordenes = response.ordenes;
  //         if (this.ordeninicial.length !== this.ordenes.length) {
  //           this.ordeninicial = response.ordenes;
  //           console.log("Orden inicial respaldada")
  //         } else {
  //           for (let i = 0; i < this.ordenes.length; i++) {
  //             if (this.ordenes[i].ordenesplatillos.length !== this.ordeninicial[i].ordenesplatillos.length) {
  //               this.notificaciones[this.ordenes[i].id] = this.ordenes[i].ordenesplatillos.length - this.ordeninicial[i].ordenesplatillos.length
  //               this.sound.play()
  //               localStorage.setItem("notificaciones", JSON.stringify(this.notificaciones))
  //               console.log(this.notificaciones)
  //             }
  //           }
  //           this.ordeninicial = this.ordenes
  //         }
  //       } else {
  //         console.error('Error: Respuesta inválida');
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error en la solicitud:', error);
  //     }
  //   );
  // }

  async ObtenerOrdenes(load: boolean = true): Promise<void> {
    try {
      if (load) {
        this.loaded = false;
      }
      const response: any = await (await this.OrdenesService.OrdenesPendientes(load)).toPromise();
      if (response && response.ordenes) {
        this.ordenes = response.ordenes;

        if (this.ordeninicial.length !== this.ordenes.length) {
          this.ordeninicial = response.ordenes;
          console.log("Orden inicial respaldada");
        } else {
          for (let i = 0; i < this.ordenes.length; i++) {
            if (this.ordenes[i].ordenesplatillos.length !== this.ordeninicial[i].ordenesplatillos.length) {
              this.notificaciones[this.ordenes[i].id] = this.ordenes[i].ordenesplatillos.length - this.ordeninicial[i].ordenesplatillos.length;
              this.sound.play();
              localStorage.setItem("notificaciones", JSON.stringify(this.notificaciones));
              console.log(this.notificaciones);
            }
          }
          this.ordeninicial = this.ordenes;
        }
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  getElapsedTime(orderId: number): Date {
    return this.timers[orderId]?.elapsedTime || new Date(0);
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
    return [tiempototal, horaEntrega];
  }

}
