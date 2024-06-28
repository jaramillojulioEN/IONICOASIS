import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NumericValueAccessor } from '@ionic/angular';
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { interval, Subscription } from 'rxjs';
import { OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
@Component({
  selector: 'app-detalleorden',
  templateUrl: './detalleorden.component.html',
  styleUrls: ['./detalleorden.component.scss'],
})
export class DetalleordenComponent implements OnInit, OnDestroy {
  @Input() mesa: any = [];
  @Input() ordenC: any = [];
  orden: any = [];
  estimados: any;
  rol: any = [];
  elapsedTime: Date = new Date(0);
  timerSubscription: Subscription | undefined;
  timerRunning = false;
  intervalId: any;

  constructor(
    private ac: AlertServiceService,
    private userService: UserServiceService,
    private modalController: ModalController,
    private OrdenesService: OrdenesService
  ) { }

  ngOnInit() {
    window.addEventListener('success', () => {
      this.buscarOrden();
    })
    this.rol = this.userService.getRol();
    if (this.rol.id === 4) {
      this.orden = this.ordenC;
    } else {
      this.orden = this.mesa.ordenes[0];
    }
    this.Getestimandos();
    this.intervalId = setInterval(() => {
      this.Getestimandos();
      this.buscarOrden();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerRunning = false;
    }
    this.alterstate(3);
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

  Getestimandos(): void {
    let tiempototal = 0;
    const fechaorden = new Date(this.orden.fecha);
    this.orden.ordenesplatillos.forEach((element: any) => {
      tiempototal += element.platillos.recetas.tiempopreparacion;
    });
    fechaorden.setMinutes(fechaorden.getMinutes() + tiempototal);
    const horaEntrega =
      fechaorden.getHours() +
      ':' +
      (fechaorden.getMinutes() <= 9
        ? '0' + fechaorden.getMinutes()
        : fechaorden.getMinutes());
    this.estimados = [tiempototal, horaEntrega];
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerRunning = true;
    this.elapsedTime = new Date(0);
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime = new Date(this.elapsedTime.getTime() + 1000);
    });

    this.alterstate(2);

  }

  Opciones(data: any, platillo : boolean) {
    let butons: any[] = []
    if (this.rol.id === 2 && this.orden.estado === 1) {
      if(platillo){
        butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarPlatillo(data) })
      }else{
        butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarBebida(data) })
      }
    }
    if (this.rol.id !== 2) {
      butons.push({ button: this.ac.btnVer, handler: () => { this.VerReceta(data.platillos.recetas); } })
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
      default:
        return "Estado desconocido";
    }
  }

  CerrarOrden(): any {
    this.ac.presentCustomAlert("Cerrar Orden", "Estás seguro de Cerrar esta Orden", () => this.alterstate(4));
  }

  async alterstate(estado: number): Promise<void> {
    this.orden.estado = estado;
    if (this.orden.estado == 3) {
      this.orden.ordenesplatillos.forEach((element: any) => {
        element.estado = 2
      });
      console.log(this.orden)
    }
    (await this.OrdenesService.ActualizarOrden(this.orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
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

  async buscarOrden(): Promise<void> {
    (await this.OrdenesService.BuscarOrden(false, this.orden.id)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.orden = response.orden
        } else {
          console.error('Error: Respuesta inválida');
        }
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
        ordenold: data
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

  dissmiss(){
    this.modalController.dismiss()
  }

}
