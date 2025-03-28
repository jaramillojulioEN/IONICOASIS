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
import { EditLavComponent } from 'src/app/Components/Modals/edit-lav/edit-lav.component'
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { Calls } from 'src/functions/call';
import { CrearLavadoComponent } from 'src/app/Components/Modals/crear-lavado/crear-lavado.component';
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
  caja: boolean = false;
  intervalId: any;

  constructor(
    private fns: LoaderFunctions,
    private PopoverController: PopoverController,
    private mc: ModalController,
    private ac: AlertServiceService,
    private LavadoService: LavadoService,
    protected UserServiceService: UserServiceService,
    private funcs: LoaderFunctions,
    private cortesService: CortesService,
    private md: ModalController,
    private calls: Calls
  ) {
    this.fecha = this.fns.obtenerFechaHoraActual();
  }

  sucursales: any = []
  idu: any = 0
  async ngOnInit() {
    this.rol = this.UserServiceService.getRol()
    this.start();
    this.sucursales = await this.calls.getsucus();
    var user = this.UserServiceService.getUser()
    this.idu = user.idsucursal
  }

  Opciones2(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.ticket, handler: () => { this.verticket(data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async verticket(data : any){
    const modal = await this.mc.create({
      component: TicketComponent,
      componentProps: {
        lavado: [data],
        isrev: true
      },
      backdropDismiss: true
    });
    return await modal.present();
  }

  change() {
    this.obtenerLavados(2, true, this.idu);

  }

  async handleRefresh(event: any) {
    await this.start();
    event.target.complete();
  }

  start() {
    this.obtenerCajaActiva()
    this.segmento = this.rol.id === 1 ? "hoy" : "pago"
    console.log(this.rol.id)
    window.addEventListener('success', () => {
      this.obtenerLavados(1, false);
    })
    if (this.rol.id === 1) {
      this.segmento == "hoy"
      this.historial()
    } else {
      this.obtenerLavados(1)
    }
    this.intervalId = setInterval(() => {
      this.obtenerCajaActiva()
    }, 5000);
    this.fechaActual = this.funcs.obtenerFechaHoraActual()
  }

  async Guardar(): Promise<void> {
    this.lavado.entidad.idsucursal = this.UserServiceService.getUser().idsucursal
    this.lavado.entidad.lavadodet = this.servicios
    this.lavado.entidad.fecha = this.fns.obtenerFechaHoraActual()
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
    if (rol.rol == 1) {
    }
    else {
      buttons.push({ button: this.ac.btnEliminar, handler: () => this.Eliminar(data) })

      var lavarray: any[] = []
      lavarray.push(data)
      buttons.push({ button: this.ac.btncobrar, handler: () => { this.Cobrar(lavarray); } })
      buttons.push({ button: this.ac.btnActualizar, handler: () => { this.AbrirModalLavado(data); } })

    }
    buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(buttons);
  }

  async AbrirModalLavado(data: any = null) {
    const modal = await this.md.create({
      component: EditLavComponent,
      componentProps: {
        data: data
      },
    });
    return await modal.present();
  }


  ValidarLavado(): boolean {
    let stt = true;
    if (this.lavado.entidad.lavadodet.length == 0) {
      stt = false
      this.message = "Debes seleccionar un tipo de vehiculo y sus servicios"
    }
    return stt
  }

  async obtenerCajaActiva(load: boolean = false): Promise<void> {
    try {
      (await this.cortesService.CortesActivos(1, load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            if (response.Cortes.length > 0) {
              this.caja = true;
              if (this.rol.id === 1)
                this.segmento = "hoy"
            }
            else {
              this.caja = false;
              this.segmento = "hoy"
            }
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  loaded: boolean = false;
  async obtenerLavados(estado: number, load: boolean = true, ids = 0): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.LavadoService.lavados(estado, load, ids)).toPromise();
      if (response && response.Lavados) {
        if (estado === 1) {
          this.lavados = response.Lavados;
          console.log(this.lavados = response.Lavados)
        } else {
          this.lavadoshistorial = response.Lavados;
          this.lavadoshistorialnf = response.Lavados;

          if (this.rol.id !== 1) {
            this.lavadoshistorial = this.fns.filterbydate(this.lavadoshistorialnf, this.fechaActual);
          }

          this.cargarLavadosHistorialPagina();
        }

        this.obtenerServicios();
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
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
    modal.onDidDismiss().then(() => {
      this.accionAlCerrarModal(); // Llama a la función que quieres ejecutar al cerrar el modal
    });
    return await modal.present();

  }

  accionAlCerrarModal() {
    this.selectedLavados = []
    
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
    this.ac.presentCustomAlert("Estás seguro?", "Este lavado se eliminará", () => this.ConfirmDelete(lavado))
  }

  selectedLavados: any[] = [];

  // Method to handle checkbox selection
  toggleSelection(lavado: any) {



    if (lavado.selected) {
      this.selectedLavados.push(lavado);
    } else {
      this.selectedLavados = this.selectedLavados.filter(l => l.id !== lavado.id);
    }


  

  }

  multuple(){
    console.log(this.selectedLavados)
    this.Cobrar(this.selectedLavados)
  }

  async ConfirmDelete(lavado: any): Promise<void> {
    console.log(lavado);
    (await this.LavadoService.Eliminar(lavado)).subscribe(
      async (response: any) => {
        if (response) {
          this.obtenerLavados(1, false);
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


  
    async AbrirModalLavadoNuevo() {
      const modal = await this.md.create({
        component: CrearLavadoComponent,
      });
      return await modal.present();
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
