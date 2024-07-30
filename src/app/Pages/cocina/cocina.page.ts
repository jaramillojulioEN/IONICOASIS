import { Component, OnInit } from '@angular/core';
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { Subscription } from 'rxjs';
import { Howl, Howler } from 'howler';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';

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


  ordeninicial: any = []
  notificaciones: { [idorden: number]: number } = {};
  private sound: Howl;
  caja: boolean = false;
  loaded: boolean = false;

  constructor(
    private OrdenesService: OrdenesService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private cortesService: CortesService,
    private fn: LoaderFunctions
  ) {
    this.startCleaningInterval();
    this.sound = new Howl({
      src: ['assets/audio/file.mp3']
    });
  }

  private startCleaningInterval(): void {
    this.intervalId = setInterval(() => {
      this.clearNotifications();
    }, 20000);
  }

  // Limpia el elemento 'notificaciones' del localStorage
  private clearNotifications(): void {
    localStorage.removeItem('notificaciones');

  }

  ngOnInit() {
    const notificacionesString = localStorage.getItem("notificaciones");
    if (notificacionesString) {
      this.notificaciones = JSON.parse(notificacionesString)
    }
    if (!this.loaded) {
      this.ObtenerOrdenes(true)
      this.obtenerCajaActiva()
    }

    this.intervalId = setInterval(() => {
      this.obtenerCajaActiva()
      this.ObtenerOrdenes(false);
    }, 1000);

  }

  getEstado(estado: number): string {
    return this.OrdenesService.getEstado(estado)
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

    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleordenComponent,
      canDismiss: true,
      componentProps: {
        mesa: data.mesas,
        ordenC: data,
      },
    });

    return await modal.present();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = remainingSeconds.toString().padStart(2, '0');

    return `${minutesString}:${secondsString}`;
  }

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

  tiemposTranscurridos: { [id: string]: number } = {}; // Objeto para guardar tiempos transcurridos en segundos por id
  tiemposPausados: { [id: string]: number } = {}; // Objeto para guardar tiempos pausados en segundos por id

  updateTimer(orden: any, running: boolean = true): string {
    return this.transcurrido(orden);
  }

  transcurrido(orden: any): string {
    let hoy = new Date().getTime();
    let fechaorden: Date = new Date(orden.fecha);
    let inicio = fechaorden.getTime();
    let diffInSeconds = Math.floor((hoy - inicio) / 1000) + (orden.tiempo || 0);

    // Si la orden está pausada, actualizamos el tiempo pausado
    if (orden.estado === 3 && orden.pausado) {
      let pausa: Date = new Date(orden.pausado);
      let tiempoPausa = Math.floor((hoy - pausa.getTime()) / 1000);

      if (!this.tiemposPausados[orden.id]) {
        this.tiemposPausados[orden.id] = 0;
      }

      this.tiemposPausados[orden.id] += tiempoPausa;
      return "Pausado";
    }

    // Restar el tiempo pausado del tiempo total transcurrido
    if (this.tiemposPausados[orden.id]) {
      diffInSeconds -= this.tiemposPausados[orden.id];
    }

    // Guardar el tiempo transcurrido en segundos en el objeto tiemposTranscurridos
    this.tiemposTranscurridos[orden.id] = diffInSeconds;

    var hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds %= 3600;
    var minutes = Math.floor(diffInSeconds / 60);
    var seconds = Math.floor(diffInSeconds % 60);

    var hoursStr = String(hours).padStart(2, '0');
    var minutesStr = String(minutes).padStart(2, '0');
    var secondsStr = String(seconds).padStart(2, '0');

    var tiempoFormateado = `${hoursStr}:${minutesStr}:${secondsStr}`;

    return tiempoFormateado;
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
