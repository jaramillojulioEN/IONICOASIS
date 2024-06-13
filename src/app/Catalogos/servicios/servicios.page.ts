import { Component, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'
import { ServiciosComponent } from 'src/app/Components/Modals/servicios/servicios.component'
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  vehiculos: any = [];
  servicios: any = [];

  constructor(private LavadoService: LavadoService, private ModalController: ModalController) { }
  segmento: string = "autos"
  ngOnInit() {
    this.obtenerVehiculos()
    window.addEventListener('success', () => {
      this.obtenerVehiculos(false);
    })
  }

  async obtenerVehiculos(load: boolean = true): Promise<void> {
    (await this.LavadoService.Vehiculos(load)).subscribe(
      async (response: any) => {
        if (response && response.Servicios) {
          this.vehiculos = response.Servicios;
          this.obtenerServicios(false)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async obtenerServicios(load: boolean = false): Promise<void> {
    (await this.LavadoService.Servicios(load)).subscribe(
      async (response: any) => {
        if (response && response.Servicios) {
          this.servicios = response.Servicios;
          console.log(this.servicios)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async Nuevo(isService : boolean = false) {
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      componentProps: {
        isService : isService
      },
      backdropDismiss : true,
    }
    )
    ;(await modal).present()
  }


  async Modificar(data : any) {
    let isService = data.id_servicio != undefined ? true : false
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      backdropDismiss : true,
      componentProps : {
        vehiculo : data.id_servicio == undefined ? data : null,
        servicio : data.id_servicio == undefined ? null : data,
        isService : isService
      }
    }
    )
    ;(await modal).present()
  }


  async Eliminar(data: any) {

  }

}
