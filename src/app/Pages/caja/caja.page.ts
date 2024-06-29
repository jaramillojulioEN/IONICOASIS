import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component';
import { LoaderFunctions } from 'src/functions/utils'
import { UserServiceService } from 'src/app/services/Users/user-service.service';
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
  constructor(
    private os: OrdenesService,
    protected pop: PopoverController,
    private mc: ModalController,
    private fns: LoaderFunctions,
    private userservice: UserServiceService
  ) { }

  ngOnInit() {
    this.rol = this.userservice.getRol()
    this.segmento = this.rol.id !== 1 ? "pago" : "hoy"
    this.fechaActual = this.fns.obtenerFechaHoraActual();
    if (this.rol.id !== 1) {
      this.getordenes(4, true);
      this.intervalId = setInterval(() => {
        this.getordenes(4);
      }, 5000);
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
          this.cargarCobradasPagina();
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

  cargarCobradasPagina() {
    this.totalRegistros = this.cobradasnofilter.length
    this.totalPages = Math.ceil(this.totalRegistros / this.registrosPorPagina)
    const startIndex = (this.currentPage - 1) * this.registrosPorPagina;
    const endIndex = startIndex + this.registrosPorPagina;
    this.cobradasfilter = this.cobradasfilter.slice(startIndex, endIndex);
  }

  deletefilter() {
    this.historial()
    this.filtered=false
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarCobradasPagina();
    }
  }

  paginaSiguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarCobradasPagina();
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


  async getordenes(estado: number, load: boolean = false): Promise<void> {
    (await this.os.OrdenesPendientes(load, estado)).subscribe(
      async (response: any) => {
        if (response.ordenes != null) {
          if (estado == 4) {
            this.ordenes = response.ordenes
          }
          else {
            this.cobradasfilter = response.ordenes
            this.cobradasnofilter = response.ordenes
            if (this.rol.id !== 1 && estado === 5) {
              this.cobradasfilter = this.fns.filterbydate(this.cobradasnofilter, this.fechaActual)
            }
            this.cargarCobradasPagina();
          }
        }
      },
      (error: any) => {
        console.log(error)
      }
    );

  }

}
