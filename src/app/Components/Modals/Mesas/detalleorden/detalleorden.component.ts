import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ModalController, NumericValueAccessor } from '@ionic/angular';
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { interval, Subscription } from 'rxjs';
import { OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { LoaderFunctions } from 'src/functions/utils';
import { Calls } from 'src/functions/call';
interface Timer {
  id: number;
  elapsedTime: Date;
  subscription: Subscription | undefined;
}

@Component({
  selector: 'app-detalleorden',
  templateUrl: './detalleorden.component.html',
  styleUrls: ['./detalleorden.component.scss'],
})
export class DetalleordenComponent implements OnInit {
  @Input() mesa: any = [];
  @Input() ordenC: any = [];
  @Input() orden: any = [];
  estimados: any;
  rol: any = [];
  @Input() tiempo: number = 0;

  constructor(
    private ac: AlertServiceService,
    private userService: UserServiceService,
    private modalController: ModalController,
    private OrdenesService: OrdenesService,
    private fn: LoaderFunctions,
    private clls: Calls
  ) { }


  async incrementarCantidad(dbeb: any) {

    dbeb.cantidad += 1;
    try {
      const response = await (await this.OrdenesService.CrearOrdenDetail(dbeb)).toPromise();
      this.buscarOrden()
      this.Getestimandos();
      this.ac.presentCustomAlert("Éxito", response.message);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  intervalId: any;

  // @Input() activetimers: { [id: number]: Timer } = {};
  // timers: { [id: number]: Timer } = {};

  // @Output() timersUpdated = new EventEmitter<{ [id: number]: Timer }>();
  // private closeModalCallback: ((timers: { [id: number]: Timer }) => void) | undefined;

  // setCloseModalCallback(callback: (timers: { [id: number]: Timer }) => void) {
  //   this.closeModalCallback = callback;
  // }
  // private emitTimersUpdate() {
  //   this.timersUpdated.emit({ ...this.activetimers });
  //   if (this.closeModalCallback) {
  //     this.closeModalCallback(this.activetimers);
  //   }
  // }


  notificaciones: { [idorden: number]: number } = {};
  cargaactiva: boolean = true;
  ngOnInit() {
    this.rol = this.userService.getRol();
    if (this.mesa.length !== 0) {
      this.orden = this.mesa.ordenes[0]
    } else {
      this.orden = this.ordenC;
    }
    this.buscarOrden();
    this.Getestimandos();


    // const notificacionesString = localStorage.getItem("notificaciones");
    // if (notificacionesString) {
    //   this.notificaciones = JSON.parse(notificacionesString)
    // }

    window.addEventListener('success', () => {
      this.buscarOrden();
      window.dispatchEvent(new Event('mesas'));
    })

    window.addEventListener('carga', () => {
      if (this.cargaactiva) {
        this.cargaactiva = false
      } else {
        this.cargaactiva = true
      }
    })



  }

  async handleRefresh() {
    await this.buscarOrden();
  }


  notifs(id: number) {
    if (this.notificaciones[id]) {
      delete this.notificaciones[id]
    }
    localStorage.setItem("notificaciones", JSON.stringify(this.notificaciones))
  }

  async VerReceta(receta: any): Promise<void> {
    const modal = await this.modalController.create({
      component: DetalleComponentReceta,
      componentProps: {
        receta: receta,
      },
    });
    await modal.present();
  }

  async Getestimandos(): Promise<void> {
    let tiempototal = 0;
    const fechaorden = new Date(this.orden.fecha);

    const tiempos = await Promise.all(
      this.orden.ordenesplatillos.map(async (element: any) => {
        const receta = await this.clls.ObtenerRecetasSimple(element.platillos.idreceta);
        return receta.tiempopreparacion;
      })
    );

    tiempototal = tiempos.reduce((acc, curr) => acc + curr, 0);

    fechaorden.setMinutes(fechaorden.getMinutes() + tiempototal);
    const horaEntrega =
      fechaorden.getHours() +
      ':' +
      (fechaorden.getMinutes() <= 9 ? '0' + fechaorden.getMinutes() : fechaorden.getMinutes());

    this.estimados = [tiempototal, horaEntrega];
  }




  Opciones(data: any, platillo: boolean) {
    let butons: any[] = []
    if (this.rol.id === 2 && this.orden.estado === -1) {
      if (platillo) {
        butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarPlatillo(data) })
      } else {
        butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarBebida(data) })
      }
    }
    if (this.rol.id !== 2) {
      butons.push({ button: this.ac.btnVer, handler: () => { this.VerReceta(data.platillos); } })
    }
    butons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(butons);
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
      case 6:
        return "Orden Cancelada";
      case -1:
        return "Tomando orden";
      default:
        return "Estado desconocido";
    }
  }

  CerrarOrden(estado: number = 4): any {
    this.ac.presentCustomAlert("Cerrar Orden", `Estás seguro de ${estado == 4 ? 'cerrar' : 'cancelar'} esta Orden`, () => this.alterstate(estado));
  }

  enviarcocina(estado: number) {
    this.ac.presentCustomAlert("Enviar a cocina", "Estas seguro de querer enviar a cocina", () => this.alterstate(estado))
  }


  async alterstate(estado: number): Promise<void> {
    this.orden.estado = estado;
    if (estado == 2) {
      this.orden.fecha = this.fn.obtenerFechaHoraActual()
    }
    if (this.orden.estado == 3) {
      this.orden.pausado = this.fn.obtenerFechaHoraActual()
      this.notifs(this.orden.id)
      this.orden.tiempo = this.tiempo;
      this.orden.ordenesplatillos.forEach((element: any) => {
        element.estado = 2
      });
      console.log(this.orden)
    }
    (await this.OrdenesService.ActualizarOrden(this.orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          await this.buscarOrden();
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  // Método para formatear el tiempo transcurrido
  private getElapsedSeconds(elapsedTime: Date): number {
    return Math.floor(elapsedTime.getTime() / 1000);
  }

  // Método para añadir un cero a la izquierda si es necesario
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  async buscarOrden(): Promise<void> {
    (await this.OrdenesService.BuscarOrden(false, this.orden.id)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.orden = response.orden
        } else {
          console.error('Error: Respuesta inválida');
        }
        console.log(this.orden)
        this.Getestimandos()
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }




  async AgregarAOrden(data: any, titulo: string = "") {
    let modal: any
    modal = await this.modalController.create({
      component: OrdnComponent,
      componentProps: {
        titulo: titulo,
        idmesa: data.idmesa,
        ordenold: data,
        cargaactiva: this.cargaactiva
      },
    });
    modal.present()
  }


  EliminarPlatillo(platillo: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar el platillo " + platillo.platillos.nombre, () => this.ConfirmarELiminar(platillo));
  }

  async ConfirmarELiminar(platillo: any): Promise<void> {
    (await this.OrdenesService.EliminarPDetalle(platillo)).subscribe(
      async (response: any) => {
        if (response) {
          this.buscarOrden();
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

  async ConfirmarELiminarBebida(bebida: any): Promise<void> {
    (await this.OrdenesService.EliminarBDetalle(bebida)).subscribe(
      async (response: any) => {
        if (response) {
          this.buscarOrden();
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

  EliminarBebida(bebida: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la bebida " + bebida.bebidas.nombre, () => this.ConfirmarELiminarBebida(bebida));
  }

  dissmiss() {
    this.modalController.dismiss()
  }

}
