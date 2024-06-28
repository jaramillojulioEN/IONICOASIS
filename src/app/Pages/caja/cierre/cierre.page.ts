import { Component, OnInit, booleanAttribute } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { ChartsComponent } from 'src/app/Components/Extras/charts/charts.component'
import { InicioComponent } from 'src/app/Components/Modals/inicio/inicio.component';
import { LoaderFunctions } from 'src/functions/utils';

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
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
  ];
  labels: string[] = ['Total Inicial', 'Total Cocina', 'Total en Caja', 'Retiros', 'Ganancias'];
  data: number[] = [];
  CortePasado: any = [];
  intervalId: any;

  constructor(private cortesService: CortesService,
    private ac: AlertServiceService,
    private md: ModalController,
    private functiosn : LoaderFunctions
  ) { }

  ngOnInit() {
    this.obtenerCortesActivos();
    this.obtenerCortesPasados()

    // this.intervalId = setInterval(() => {
    //   this.obtenerCortesPasados(false)
    //   this.obtenerCortesActivos(false);
    // }, 10000);

    window.addEventListener('success', () => {
      this.obtenerCortesActivos(true);
      this.obtenerCortesPasados(false);
    })

  }

  async obtenerCortesPasados(load: boolean = false): Promise<void> {
    try {
      (await this.cortesService.CortesActivos(2, load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            this.CortePasado = response.Cortes;
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

  async obtenerCortesActivos(load: boolean = true): Promise<void> {
    try {
      (await this.cortesService.CortesActivos(1, load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            this.CorteActivo = response.Cortes;
            if (this.CorteActivo.length > 0)
              this.actualizarDatosGrafico()
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

  cerracaja(caja: any): void {
    caja.estado = 2
    caja.fechacierre = this.functiosn.obtenerFechaHoraActual()
    this.ac.presentCustomAlert("¿Seguro?", "¿Estas seguro de querer cerrar la caja?", () => this.confirmaratualizar(caja))
  }



  async confirmaratualizar(caja: any): Promise<void> {
    (await this.cortesService.ActulizarCaja(caja)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.obtenerCortesActivos(false)
          this.obtenerCortesPasados(false)
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

  Opciones(data: any, index: number) {
    this.obtenerCortesActivos(false)
    let cajaactiva = this.CorteActivo.length > 0 ? true : false
    let button: any[] = []
    if (index == 0 && !cajaactiva) {
      button.push({ button: this.ac.btnActivar, handler: () => this.reactivarOrden(data) })
    }
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
      cortepasado.sumatotal,
      cortepasado.saliodecaja,
      cortepasado.ganancias,
    ];
    const modal = await this.md.create({
      component: ChartsComponent,
      componentProps: {
        labels: this.labels,
        data: olddata,
        colores: this.colores
      },
    });
    return await modal.present();

  }

  actualizarDatosGrafico() {
    this.data = [
      this.CorteActivo[0].totalcaja,
      this.CorteActivo[0].totalcocina,
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

  async Iniciar(): Promise<void> {
    const modal = await this.md.create({
      component: InicioComponent,
    });
    return await modal.present();
  }

}
