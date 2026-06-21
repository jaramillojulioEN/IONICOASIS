import { Component, NgZone, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component'
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component';
import { LoaderFunctions } from 'src/functions/utils'
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { DetalleadminComponent } from 'src/app/Components/Modals/detalleadmin/detalleadmin.component'
import { Calls } from 'src/functions/call';
import { VentaEspecialComponent } from 'src/app/Components/Modals/venta-especial/venta-especial.component';
import { SignalrService } from 'src/app/services/signalr.service';
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
  ordenesagruapdas: any = []

  filtered: boolean = false;
  fecha: any = this.fns.obtenerFechaHoraActual();

  private getInicioDiaLocal(): string {
    const ahora = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}T00:00:00.000`;
  }

  caja: boolean = false;
  loaded: boolean = false;
  mensaje: any;
  error: any = 'Caja cerrada';
  fechaf: any;

  pagina = {
    PaginaActual: 1,
    TotalPorPagina: 5,
    TotalPages: 1,
    TotalItems: 0,
    Fecha: "",
    PaginationEnabled : true
  }
  constructor(
    public os: OrdenesService,
    protected pop: PopoverController,
    private mc: ModalController,
    private fns: LoaderFunctions,
    private userservice: UserServiceService,
    private call: Calls,
    private ac: AlertServiceService,
    private ModalController: ModalController,
    private signalRService: SignalrService,
    private zone: NgZone
  ) {
    this.rol = this.userservice.getRol();
    this.idsucursal = this.userservice.gesucu()

  }
  sucursales: any = []
  idsucursal: number = 0
  async ngOnInit() {
    this.sucursales = await this.call.getsucus()
    this.start()

    this.signalRService.startConnection();
    this.signalRService.addListener('OrdenesModificadasCocina', () => {
      this.zone.run(() => this.getordenes(4, false));
    });

    window.addEventListener('success', () => {
      this.ModalController.dismiss().catch(() => {});
      this.start();
    })
  }



  agruparPorEstado(ordenes: any[]) {
    return ordenes.reduce((acc, orden) => {
      let estado = acc.find((e: { nombre: any; }) => e.nombre === orden.estado);
      if (!estado) {
        estado = { nombre: orden.estado, ordenes: [] };
        acc.push(estado);
      }
      estado.ordenes.push(orden);
      return acc;
    }, []);
  }


  async handleRefresh(event: any) {
    await this.start();
    event.target.complete();
  }

  async Especial() {
    const modal = await this.mc.create({
      component: VentaEspecialComponent,
      componentProps: {

      },
      backdropDismiss: true
    });
    return await modal.present();
  }

  async start() {
    const id = this.userservice.gesucu();
    if (id) this.idsucursal = id;
    this.segmento = this.rol.id !== 1 ? 'pago' : 'hoy';
    this.fechaActual = this.getInicioDiaLocal();

    if (this.rol.id !== 1) {
      this.getordenes(4, true);
    } else {
      this.getordenes(5, true);
    }
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
          this.filtered = true
          this.pagina.Fecha = this.fechaf;
          this.pagina.PaginaActual = 1;
          this.getordenes(5)
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
      { button: this.ac.ticket, handler: () => { this.verticket(data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }


  async verticket(data: any) {
    const modal = await this.mc.create({
      component: TicketComponent,
      componentProps: {
        orden: data,
        isrev: true
      },
      backdropDismiss: true
    });
    return await modal.present();
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




  paginaAnterior() {
    this.pagina.PaginaActual = this.pagina.PaginaActual - 1
    this.getordenes(5, true);
  }

  paginaSiguiente() {
    this.pagina.PaginaActual = this.pagina.PaginaActual + 1
    this.getordenes(5, true);
  }


  async getordenes(estado: number, load: boolean = true) {
    this.loaded = !load
    this.pagina.Fecha = (this.rol.id !== 1 && estado === 5) ? this.fechaActual : "";
    this.pagina.PaginationEnabled = estado === 4 ? false : true;
    try {
      (await this.os.OrdenesPendientesNuevo(estado, this.rol.id, this.idsucursal, this.pagina)).subscribe({
        next: (response: any) => {
          this.ordenes = response.Ordenes;
          console.log(this.ordenes);
          
          this.ordenesagruapdas = this.agruparPorEstado(this.ordenes)
          this.pagina = response.Paginador
        },
        error: (errro: any) => {
          console.log(errro)
        },
        complete: () => {
          this.loaded = true;
        }
      });

    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

  delfil() {
    this.filtered = false;
    this.fechaf = ""
    this.pagina.Fecha = ""
    this.filtered = false
    this.pagina.PaginaActual = 1
    this.getordenes(5);

  }

}
