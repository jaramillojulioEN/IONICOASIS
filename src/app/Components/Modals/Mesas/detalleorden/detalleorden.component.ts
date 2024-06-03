import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NumericValueAccessor } from '@ionic/angular';
import { DetalleComponentReceta } from 'src/app/Components/Modals/RecetasModals/detalle/detalle.component';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { interval, Subscription } from 'rxjs';
import {OrdnComponent } from 'src/app/Components/Modals/Ordenes/ordn/ordn.component'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { MatOptgroup } from '@angular/material/core';
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

  constructor(
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
      this.alterstate(3);
    }
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
      default:
        return "Estado desconocido";
    }
  }

  async alterstate(estado: number): Promise<void> {
    this.orden.estado = estado;
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

  async buscarOrden () : Promise<void> {
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


  async AgregarAOrden(data: any, titulo : string = "") {
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


  EliminarPlatillo(platillo : any) {

  }
  
  EliminarBebida(bebida : any) {
    
  }
  
}
