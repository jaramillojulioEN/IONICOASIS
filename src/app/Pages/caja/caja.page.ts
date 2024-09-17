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
import { Calls } from 'src/functions/call';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {
  segmento: string = 'pago';
  rol: any;
  fechaActual: string = '';
  ordenes: any = [];
  filtered: boolean = false;
  fecha: any = this.fns.obtenerFechaHoraActual();
  cobradas: any = [];
  caja: boolean = false;
  loaded: boolean = false;
  mensaje: any;
  error: any = 'Caja cerrada';
  inicio: number = 0;
  fin: number = 5;
  totalOrdenes: number = 0;
  fechaf: any;

  constructor(
    private os: OrdenesService,
    protected pop: PopoverController,
    private mc: ModalController,
    private fns: LoaderFunctions,
    private userservice: UserServiceService,
    private call: Calls,
    private ac: AlertServiceService,
    private ModalController: ModalController
  ) { }
  sucursales : any = []
  ids : number = 0
  async ngOnInit() {
    this.start()
    this.sucursales = await this.call.getsucus()
    var usuario = this.userservice.getUser();
    this.ids = usuario.idsucursal
    window.addEventListener('success', () => {
      this.getordenes(4, true, 0, 0);
    })
  }

  change(){

    this.getordenes(5, true, this.inicio, this.fin, this.ids);

  }

  async handleRefresh(event: any) {
    await this.start();
    event.target.complete();
  }

  async start() {
    this.rol = this.userservice.getRol();
    this.segmento = this.rol.id !== 1 ? 'pago' : 'hoy';
    this.fechaActual = this.fns.obtenerFechaHoraActual();
    this.inicio = 0;
    this.fin = 5
    if (this.rol.id !== 1) {
      this.getordenes(4, true, 0, 0);
    } else {
      this.getordenes(5, true, this.inicio, this.fin);
    }
  }
  historial(): void {
    this.inicio = 0;
    this.fin = 5
    this.getordenes(5, true, this.inicio, this.fin);
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
        this.fechaf = dataReturned.data
        if (this.fechaf != undefined && this.fechaf != null) {
          console.log(this.fechaf)
          this.historial()
          this.filtered = true
        }
      }
    });
    await popover.present();

  }



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




  puedeRetroceder(): boolean {
    return this.inicio > 0;
  }

  async retrocederOrdenes(estado: number) {
    if (this.puedeRetroceder()) {
      this.inicio -= this.fin;
      await this.getordenes(estado, false, this.inicio, this.inicio + this.fin);
    }
  }
  async getordenes(estado: number, load: boolean = false, inicio: number, fin: number, ids = 0): Promise<void> {

    if (load) {
      this.loaded = false;
    }
    try {
      console.log(this.fechaf)
      const response: any = await (await this.os.OrdenesPendientes(load, estado, this.rol.id, inicio, fin, ids, this.fechaf ? this.fechaf.toString().split("T")[0] : "1900-01-01T00:00:00.0000")).toPromise();
      this.mensaje = response.message;
      this.totalOrdenes = response.total
      console.log(this.totalOrdenes)
      if (response && response.ordenes != null) {
        if (estado === 4) {
          this.ordenes = response.ordenes;
        } else {
          this.cobradas = response.ordenes;
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

  delfil(){
    this.filtered=false;
    this.fechaf = ""
    this.historial();

  }

  async cargarMasOrdenes(estado: number) {
    this.inicio += this.fin;
    console.log(this.inicio)
    await this.getordenes(estado, false, this.inicio, this.inicio + this.fin);
  }

  puedeCargarMas(): boolean {
    return this.inicio + this.fin < this.totalOrdenes;
  }

}
