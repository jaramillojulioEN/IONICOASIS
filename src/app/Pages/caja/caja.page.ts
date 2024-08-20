import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component';
import { LoaderFunctions } from 'src/functions/utils'
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { DetalleadminComponent } from 'src/app/Components/Modals/detalleadmin/detalleadmin.component'
@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {
  segmento: string = "pago"
  rol: any
  fechaActual: string = "";
  private intervalId: any;
  ordenes: any = [];
  filtered: boolean = false;
  cobradasfilter: any = [];
  fecha: any = this.fns.obtenerFechaHoraActual();
  cobradasnofilter: any = [];
  caja: boolean = false;
  loaded: boolean = false;
  mensaje: any;
  error: any = "Caja cerrada"

  constructor(
    private os: OrdenesService,
    protected pop: PopoverController,
    private mc: ModalController,
    private fns: LoaderFunctions,
    private userservice: UserServiceService,
    private cortesService: CortesService,
    private ac: AlertServiceService,
    private ModalController: ModalController
  ) { }

  ngOnInit() {
    this.start()
  }

  async handleRefresh(event: any) {
    await this.start();
    event.target.complete();
  }

  async start() {
    this.rol = this.userservice.getRol()
    this.segmento = this.rol.id !== 1 ? "pago" : "hoy"
    this.fechaActual = this.fns.obtenerFechaHoraActual();
    if (this.rol.id !== 1) {
      this.getordenes(4, true);
    } else {
      this.getordenes(5, true);
    }
    window.addEventListener('success', () => {
      this.getordenes(4, true);
    })
  }

  historial(): void {
    this.getordenes(5)
  }

  async openFilter(event: Event): Promise<void> {
    const popover = await this.pop.create({
      component: DatepickerComponent,
      componentProps: {
        filterdate: this.fecha,
      },
      event: event,
      size: 'auto',
      translucent: true,
      animated: true,
      showBackdrop: true,
      backdropDismiss: true
    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== undefined) {
        this.fecha = dataReturned.data
        if (this.fecha != undefined && this.fecha != null) {
          this.cobradasfilter = this.fns.filterbydate(this.cobradasnofilter, this.fecha)
          console.log(this.cobradasfilter)
          // this.cargarCobradasPagina();
          this.filtered = true
        }
      }
    });
    await popover.present();

  }

  registrosPorPagina: number = 5;
  currentPage: number = 1;
  totalRegistros: number = 0;
  totalPages: number = 0;
  filterdate: string = "";

  // cargarCobradasPagina() {
  //   this.totalRegistros = this.cobradasnofilter.length
  //   this.totalPages = Math.ceil(this.totalRegistros / this.registrosPorPagina)
  //   const startIndex = (this.currentPage - 1) * this.registrosPorPagina;
  //   const endIndex = startIndex + this.registrosPorPagina;
  //   this.cobradasfilter = this.cobradasfilter.slice(startIndex, endIndex);
  //   console.log(this.cobradasfilter)
  // }

  transformarTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    return (
      this.agregarCero(horas) + ':' + this.agregarCero(minutos) + ':' + this.agregarCero(segs)
    );
  }

  agregarCero(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }


  deletefilter() {
    this.historial()
    this.filtered = false
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.cargarCobradasPagina();
    }
  }

  paginaSiguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // this.cargarCobradasPagina();
    }
  }

  async cobrarOrden(orden: any) {
    const modal = await this.mc.create({
      component: TicketComponent,
      componentProps: {
        orden: orden
      },
      backdropDismiss: true
    });
    return await modal.present();
  }

  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnVerOrden, handler: () => { this.VerOrden(data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }


  async VerOrden(data: any) {
    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleadminComponent,
      canDismiss: true,
      componentProps: {
        ordenes: data,
      },
    });
    return await modal.present();
  }
  async getordenes(estado: number, load: boolean = false): Promise<void> {
    if (load) {
      this.loaded = false;
    }

    try {
      const response: any = await (await this.os.OrdenesPendientes(load, estado)).toPromise();
      this.mensaje = response.message;
      if (response && response.ordenes != null) {
        if (estado === 4) {
          this.ordenes = response.ordenes;
        } else {
          this.cobradasfilter = response.ordenes;
          this.cobradasnofilter = response.ordenes;
          if (this.rol.id !== 1 && estado === 5) {
            this.cobradasfilter = this.fns.filterbydate(this.cobradasnofilter, this.fechaActual);
          }
          // this.cargarCobradasPagina();
        }
      } else {
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

}
