import { Component, OnInit, booleanAttribute } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { ChartsComponent } from 'src/app/Components/Extras/charts/charts.component'
import { InicioComponent } from 'src/app/Components/Modals/inicio/inicio.component';
import { LoaderFunctions } from 'src/functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { TicketcajaComponent } from 'src/app/Components/ticketcaja/ticketcaja.component'
import { Calls } from 'src/functions/call';
@Component({
  selector: 'app-cierre',
  templateUrl: './cierre.page.html',
  styleUrls: ['./cierre.page.scss'],
})
export class CierrePage implements OnInit {
  CorteActivo: any = [];
  segmento: string = "estado";
  colores: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(122, 39, 15, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
  ];
  labels: string[] = ['Total Inicial', 'Total Cocina', 'Total Lavados', 'Total en Caja', 'Retiros', 'Ganancias'];
  data: number[] = [];
  CortePasado: any = [];
  intervalId: any;
  roles: any = [];

  loaded1: boolean = false
  loaded2: boolean = false
  sucursales: any = [];

  constructor(private cortesService: CortesService,
    private ac: AlertServiceService,
    private md: ModalController,
    private us: UserServiceService,
    private call: Calls,
    private functiosn: LoaderFunctions
  ) { }

  async ngOnInit() {
    var user = this.us.getUser();
    this.idu = this.idu == 0 ? user.idsucursal : this.idu
    this.sucursales = await this.call.getsucus()
    this.obtenerCortesActivos(true, this.idu);
    this.obtenerCortesPasados(true, this.idu)

    this.roles = this.us.getRol();

    window.addEventListener('success', () => {
      this.obtenerCortesActivos(true, this.idu);
      this.obtenerCortesPasados(true, this.idu);
    })

  }



  async verticket(data : any){
    const modal = await this.md.create({
      component: TicketcajaComponent,
      componentProps: {
        caja: data,
        isrev: true
      },
      backdropDismiss: true
    });
    return await modal.present();
  }

  idu: any = 0
  change() {
    this.obtenerCortesActivos(true, this.idu);
    this.obtenerCortesPasados(true, this.idu);
  }

  async handleRefresh(event: any) {
    await this.obtenerCortesActivos(true, this.idu);
    await this.obtenerCortesPasados(true, this.idu)
    event.target.complete();
  }

  async obtenerCortesPasados(load: boolean = true, idu: number = 0): Promise<void> {
    if (load) {
      this.loaded1 = false
    }
    try {
      const response: any = await (await this.cortesService.CortesActivos(2, load, idu)).toPromise();

      if (response && response.Cortes) {
        this.CortePasado = response.Cortes;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded1 = true;
    }
  }


  async obtenerCortesActivos(load: boolean = true, ids: number = 0): Promise<void> {
    if (load) {
      this.loaded2 = false
    }
    try {
      const response: any = await (await this.cortesService.CortesActivos(1, load, ids)).toPromise();
      if (response && response.Cortes) {
        this.CorteActivo = response.Cortes;
        if (this.CorteActivo.length > 0) {
          this.actualizarDatosGrafico();
        }
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded2 = true;
    }
  }


  cerracaja(caja: any): void {
    caja.estado = 2
    caja.fechacierre = this.functiosn.obtenerFechaHoraActual()
    this.ac.presentCustomAlert("¿Seguro?", "¿Estas seguro de querer cerrar la caja?", () => this.confirmaratualizar(caja))
  }



  async confirmaratualizar(caja: any): Promise<void> {
    (await this.cortesService.ActulizarCaja(caja)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.obtenerCortesActivos(true, this.idu)
          this.obtenerCortesPasados(true, this.idu)
          this.ac.presentCustomAlert("Alerta", response.message)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  Opciones(data: any, index: number = 0) {
    this.obtenerCortesActivos(false, this.idu)
    let cajaactiva = this.CorteActivo.length > 0 ? true : false
    let button: any[] = []
    if (index == 0 && !cajaactiva) {
      button.push({ button: this.ac.btnActivar, handler: () => this.reactivarOrden(data) })
    }
    button.push({ button: this.ac.ticket, handler: () => this.verticket(data) })
    button.push({ button: this.ac.btnVerGrafico, handler: () => this.vergraficopasado(data) })
    button.push({ button: this.ac.btnCancelar, handler: () => console.log("cancelado") })
    this.ac.configureAndPresentActionSheet(button);
  }

  reactivarOrden(cortepasado: any): void {
    cortepasado.estado = 1
    cortepasado.fechacierre = null
    this.ac.presentCustomAlert("¿Seguro?", "¿Estas seguro de querer reabrir la caja?", () => this.confirmaratualizar(cortepasado))
  }

  async vergraficopasado(cortepasado: any): Promise<void> {
    let olddata = [
      cortepasado.totalcaja,
      cortepasado.totalcocina,
      cortepasado.totalautos,
      cortepasado.sumatotal,
      cortepasado.saliodecaja,
      cortepasado.ganancias,
    ];
    const modal = await this.md.create({
      component: ChartsComponent,
      componentProps: {
        labels: this.labels,
        data: olddata,
        caja: cortepasado,
        colores: this.colores
      },
    });
    return await modal.present();

  }

  actualizarDatosGrafico() {
    this.data = [
      this.CorteActivo[0].totalcaja,
      this.CorteActivo[0].totalcocina,
      this.CorteActivo[0].totalautos,
      this.CorteActivo[0].sumatotal,
      this.CorteActivo[0].saliodecaja,
      this.CorteActivo[0].ganancias,
    ];
    console.log(this.data)
  }

  getpart(fecha: string, indice: number): string {
    if (fecha != undefined) {
      let fechaarray: any = fecha.split('T');
      return fechaarray[indice];
    }
    return '';
  }

  async CerarCaja(caja: any) {
    const modal = await this.md.create({
      component: TicketcajaComponent,
      componentProps: {
        caja: caja
      },
      backdropDismiss: true
    });
    return await modal.present();
  }

  async Iniciar(): Promise<void> {
    const modal = await this.md.create({
      component: InicioComponent,
      componentProps: {
        ids: this.idu
      }
    });
    return await modal.present();
  }

}
