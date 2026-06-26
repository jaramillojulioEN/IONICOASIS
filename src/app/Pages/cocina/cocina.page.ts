import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleordenComponent } from 'src/app/Components/Modals/Mesas/detalleorden/detalleorden.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { Subscription } from 'rxjs';
import { Howl, Howler } from 'howler';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';
import { SignalrService } from 'src/app/services/signalr.service';

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
export class CocinaPage implements OnInit, OnDestroy {
  ionViewWillEnter() {
    this.ObtenerOrdenes(false);
    this.signalRService.ensureConnected();
  }
  private onOrdenModificada = () => this.ObtenerOrdenes(false);
  ordenes: any[] = [];
  intervalId: any | undefined;


  ordeninicial: any = []
  notificaciones: { [idorden: number]: number } = {};
  private sound: Howl;
  caja: boolean = false;
  loaded: boolean = false;
  cargaactiva: boolean = true;
  intervalId2: any;
  mensaje: any;
  error: any = "Caja cerrada"
  constructor(
    private OrdenesService: OrdenesService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private cortesService: CortesService,
    private fn: LoaderFunctions,
    private signalRService: SignalrService
  ) {
    this.sound = new Howl({
      src: ['assets/audio/file.mp3']
    });
  }

  // private startCleaningInterval(): void {
  //   this.intervalId = setInterval(() => {
  //     this.clearNotifications();
  //   }, 20000);
  // }

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
    }

    this.signalRService.startConnection();

    // Añade un listener para escuchar el evento 'Modificaciones' desde el servidor
    this.signalRService.addListener('OrdenModificada', this.onOrdenModificada);

    window.addEventListener('success', () => {
      this.ObtenerOrdenes();
    })
    window.addEventListener('mesas', () => {
      this.ObtenerOrdenes();
    })
    this.intervalId = setInterval(() => {
      
    }, 8000);

    this.intervalId2 = setInterval(() => {
      if (this.cargaactiva) {
        this.updateTimers();
      }
    }, 1000);

    window.addEventListener('desactivar', () => {
      this.cargaactiva = false;
      console.log("se desctivo la carga")
    })

    window.addEventListener('activar', () => {
      this.cargaactiva = true;
      console.log("se activo la carga")
    })

  }


  async handleRefresh(event: any) {
    this.ngOnInit();
    event.target.complete();
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



  async VerOrden(data: any) {

    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleordenComponent,
      canDismiss: true,
      componentProps: {
        mesa: data.mesas,
        ordenC: data,
        tiempoSeg: this.tiemposTranscurridos[data.id] || 0,
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
      this.mensaje = response.message;
      if (response && response.ordenes) {
        this.ordenes = response.ordenes;
        console.log('[COCINA] ordenes:', this.ordenes.map((o: any) => ({ id: o.id, fecha: o.fecha, estado: o.estado })));
        if (this.ordeninicial.length !== this.ordenes.length) {
          this.ordeninicial = response.ordenes;
          console.log("Orden inicial respaldada");
        } else {
          for (let i = 0; i < this.ordenes.length; i++) {
            if (this.ordeninicial[i]?.ordenesplatillos && this.ordenes[i].ordenesplatillos.length !== this.ordeninicial[i].ordenesplatillos.length) {
              this.notificaciones[this.ordenes[i].id] = this.ordenes[i].ordenesplatillos.length - this.ordeninicial[i].ordenesplatillos.length;
              this.sound.play();
              localStorage.setItem("notificaciones", JSON.stringify(this.notificaciones));
              console.log(this.notificaciones);
            }
          }
          this.ordeninicial = this.ordenes;
        }
      } else {
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (load) this.ac.presentCustomAlert("Error", "No se pudieron cargar las órdenes. Verifica tu conexión.");
    } finally {
      this.loaded = true;
      this.updateTimers();
    }
  }


  tiemposTranscurridos: { [id: string]: number } = {};
  tiemposFormateados: { [id: string]: string } = {};

  transcurrido(orden: any): void {
    if (orden.isPausado) {
      this.tiemposFormateados[orden.id] = 'Pausado';
      return;
    }

    const inicio = new Date(orden.fecha).getTime();
    const pausadoMs = this.convertirHorasAMilisegundos(orden.tiempoPausado || 0);
    if (!(orden.id in this.tiemposTranscurridos)) {
      console.log('[TRANSCURRIDO] primera vez orden', orden.id, '| fecha DB:', orden.fecha, '| inicio ms:', inicio);
    }
    // El backend guarda hora México sin offset y la devuelve con Z (la trata como UTC).
    // Para que el diff sea correcto, "ahora" debe estar en el mismo marco de referencia:
    // tomamos la hora México actual y la forzamos a Z de la misma forma.
    const ahoraMexicoFakeUtc = new Date(this.fn.obtenerHoraMexicoCentro() + 'Z').getTime();
    const diffInSeconds = (ahoraMexicoFakeUtc - inicio - pausadoMs) / 1000;
    this.tiemposTranscurridos[orden.id] = diffInSeconds;

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    this.tiemposFormateados[orden.id] = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  updateTimers() {
    if (this.ordenes != null) {
      for (const orden of this.ordenes) {
        this.transcurrido(orden);
      }
    }
  }

  convertirHorasAMilisegundos(horas: number): number {
    return horas * 60 * 60 * 1000;
  }

  // Getestimandos(orden: any): any {
  //   let tiempototal = 0;
  //   const fechaorden = new Date(orden.fecha);
  //   orden.ordenesplatillos.forEach((element: any) => {
  //     tiempototal += element.platillos.recetas.tiempopreparacion;
  //   });
  //   fechaorden.setMinutes(fechaorden.getMinutes() + tiempototal);
  //   const horaEntrega =
  //     fechaorden.getHours() + ':' +
  //     (fechaorden.getMinutes() <= 9 ? '0' + fechaorden.getMinutes() : fechaorden.getMinutes());
  //   return [tiempototal, horaEntrega];
  // }

  ngOnDestroy() {
    this.signalRService.removeListener('OrdenModificada', this.onOrdenModificada);
  }

}
