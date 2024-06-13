import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component';
import { LoaderFunctions } from 'src/functions/utils'
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
  filtered: boolean = false;
  cobradas: any = [];
  cobradasfilter: any = [];
  fecha: any = "";
  cobradasnofilter: any = [];
  constructor(
    private os: OrdenesService,
    protected pop: PopoverController,
    private mc: ModalController,
    private fns: LoaderFunctions
  ) {
    const today = new Date();
    this.fecha = formatDate(today, 'yyyy-MM-dd', 'en-US');
  }

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

  historial(): void {
    this.getordenes(5, true)
  }

  async openFilter(event: Event): Promise<void> {
    console.log(this.fecha)
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
          this.cobradas = this.fns.filterbydate(this.cobradasnofilter, this.fecha)
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


  cargarCobradasPagina() {
    this.totalRegistros = this.cobradas.length
    this.totalPages = Math.ceil(this.totalRegistros / this.registrosPorPagina)
    const startIndex = (this.currentPage - 1) * this.registrosPorPagina;
    const endIndex = startIndex + this.registrosPorPagina;
    this.cobradasfilter = this.cobradas.slice(startIndex, endIndex);
  }

  deletefilter() {
    this.getordenes(5, true)
    this.filtered = false;
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
            this.cobradas = response.ordenes
            this.cobradasnofilter = response.ordenes
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
