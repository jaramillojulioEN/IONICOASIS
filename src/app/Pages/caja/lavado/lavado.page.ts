import { Component, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { TicketComponent } from 'src/app/Components/ticket/ticket.component';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { DatepickerComponent } from 'src/app/Components/Secciones/datepicker/datepicker.component'
import { LoaderFunctions } from 'src/functions/utils'
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.page.html',
  styleUrls: ['./lavado.page.scss'],
})
export class LavadoPage implements OnInit {
  //paginacion
  registrosPorPagina: number = 5;
  currentPage: number = 1;
  totalRegistros: number = 0;
  totalPages: number = 0;
  filterdate: string = "";
  //----------

  segmento: string = "pago"
  fechaActual: string = this.funcs.obtenerFechaHoraActual();
  vehiculo: any = []
  vehiculos: any = []
  servicios: any = [];

  lavado = {
    tipoEntidad: "lavado",
    entidad: {
      id: 0,
      fecha: this.funcs.obtenerFechaHoraActual(),
      estado: 1,
      idsucursal: 0,
      total: 0,
      lavadodet: []
    }
  }
  lavados: any = [];

  lavadoshistorial: any = [];
  lavadoshistorialnf: any = [];
  lavadoshistorialf: any = [];
  filtered: boolean = false;
  fecha: string = "";
  message: string = "Error desconocido, conecta con soporte";
  rol: any;

  constructor(
    private fns: LoaderFunctions,
    private PopoverController: PopoverController,
    private mc: ModalController,
    private ac: AlertServiceService,
    private LavadoService: LavadoService,
    protected UserServiceService: UserServiceService,
    private funcs: LoaderFunctions
  ) {
    const today = new Date();
    this.fecha = formatDate(today, 'yyyy-MM-dd', 'en-US');
  }

  ngOnInit() {
    this.rol = this.UserServiceService.getRol()
    this.segmento = this.rol.id === 1 ? "hoy" : "pago"
    window.addEventListener('success', () => {
      this.obtenerLavados(1, false);
    })
    if (this.rol.id === 1) {
      this.historial()
    } else {
      this.obtenerLavados(1)
    }
    this.fechaActual = this.funcs.obtenerFechaHoraActual()
  }

  async Guardar(): Promise<void> {
    this.lavado.entidad.idsucursal = this.UserServiceService.getUser().idsucursal
    this.lavado.entidad.lavadodet = this.servicios
    if (this.ValidarLavado()) {
      (await this.LavadoService.CrearLavado(this.lavado)).subscribe(
        (response: any) => {
          if (response.message) {
            this.ac.presentCustomAlert("Exito", response.message)
            this.obtenerLavados(1)
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.ac.presentCustomAlert("Error", this.message)
    }

  }

  Opciones(data: any) {
    let buttons = []
    let rol: any = this.UserServiceService.getRol()
    buttons.push({ button: this.ac.btncobrar, handler: () => { this.Cobrar(data); } })
    if (rol.rol == 1) {
      buttons.push({ button: this.ac.btnEliminar, handler: () => this.Eliminar(data) })
    }
    buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(buttons);
  }



  ValidarLavado(): boolean {
    let stt = true;
    if (this.lavado.entidad.lavadodet.length == 0) {
      stt = false
      this.message = "Debes seleccionar un tipo de vehiculo y sus servicios"
    }
    return stt
  }

  async obtenerLavados(estado: number, load: boolean = true): Promise<void> {
    (await this.LavadoService.lavados(estado, load)).subscribe(
      async (response: any) => {
        if (response && response.Lavados) {
          if (estado == 1) {
            this.lavados = response.Lavados;
          } else {
            this.lavadoshistorial = response.Lavados;
            this.lavadoshistorialnf = response.Lavados;
            if (this.rol.id !== 1) {
              this.lavadoshistorial = this.fns.filterbydate(this.lavadoshistorialnf, this.fechaActual)
            } 
            this.cargarLavadosHistorialPagina();
          }
          this.obtenerServicios()
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

  async Cobrar(lavado: any): Promise<void> {
    const modal = await this.mc.create({
      component: TicketComponent,
      componentProps: {
        lavado: lavado,
        cssClass: 'fullscreen-modal',
      },
      backdropDismiss: true
    });
    return await modal.present();

  }

  async openFilter(event: Event): Promise<void> {
    const popover = await this.PopoverController.create({
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
          this.lavadoshistorial = this.fns.filterbydate(this.lavadoshistorialnf, this.fecha)
          this.cargarLavadosHistorialPagina();
          this.filtered = true
        }
      }
    });
    await popover.present();

  }

  async Eliminar(lavado: any): Promise<void> {

  }

  async obtenerServicios(): Promise<void> {
    (await this.LavadoService.Vehiculos(false)).subscribe(
      async (response: any) => {
        if (response && response.Servicios) {
          this.vehiculos = response.Servicios;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

  deletefilter() {
    this.filtered = false
    this.obtenerLavados(2)
  }

  historial(): void {
    this.obtenerLavados(2)
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarLavadosHistorialPagina();
    }
  }

  paginaSiguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarLavadosHistorialPagina();
    }
  }

  cargarLavadosHistorialPagina() {
    this.totalRegistros = this.lavadoshistorial.length
    this.totalPages = Math.ceil(this.totalRegistros / this.registrosPorPagina)
    const startIndex = (this.currentPage - 1) * this.registrosPorPagina;
    const endIndex = startIndex + this.registrosPorPagina;
    this.lavadoshistorialf = this.lavadoshistorial.slice(startIndex, endIndex);
  }

}
