import { Component, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'
import { ServiciosComponent } from 'src/app/Components/Modals/servicios/servicios.component'
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  vehiculos: any = [];
  servicios: any = [];
  loaded: boolean = false;
  constructor(
    private LavadoService: LavadoService,
    private ModalController: ModalController,
    private ac: AlertServiceService
  ) { }
  segmento: string = "autos"
  ngOnInit() {
    this.obtenerVehiculos()
    this.obtenerServicios(false)
    window.addEventListener('success', () => {
      this.obtenerVehiculos(false);
      this.obtenerServicios(false)
    })
  }

  async obtenerVehiculos(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.LavadoService.Vehiculos(load)).toPromise();
      if (response && response.Servicios) {
        this.vehiculos = response.Servicios;
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  async obtenerServicios(load: boolean = false): Promise<void> {
    try {
      this.loaded = false;
      const response: any = await (await this.LavadoService.Servicios(load)).toPromise();
      if (response && response.Servicios) {
        this.servicios = response.Servicios;
        console.log(this.servicios);
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }


  Opciones(data: any) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.Eliminar(data) },
      { button: this.ac.btnActualizar, handler: () => { this.Modificar(data); } },
      { button: this.ac.btnCancelar, handler: () => { } }
    ]);
  }

  async Nuevo(isService: boolean = false) {
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      componentProps: {
        isService: isService
      },
      backdropDismiss: true,
    }
    )
      ; (await modal).present()
  }


  async Modificar(data: any) {
    let isService = data.id_servicio != undefined ? true : false
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      backdropDismiss: true,
      componentProps: {
        vehiculo: data.id_servicio == undefined ? data : null,
        servicio: data.id_servicio == undefined ? null : data,
        isService: isService
      }
    }
    )
      ; (await modal).present()
  }


  async Eliminar(data: any) {

  }

}
