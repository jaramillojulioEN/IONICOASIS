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

  constructor(private LavadoService: LavadoService, private ModalController: ModalController) { }
  segmento: string = "servicios"
  ngOnInit() {
    this.obtenerServicios()
  }

  async obtenerServicios(load: boolean = true): Promise<void> {
    (await this.LavadoService.Vehiculos(load)).subscribe(
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

  async Nuevo() {
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      backdropDismiss : true,
    }
    )
    ;(await modal).present()
  }


  async Modificar(vehiculo : any) {
    const modal = this.ModalController.create({
      component: ServiciosComponent,
      backdropDismiss : true,
      componentProps : {
        vehiculo : vehiculo
      }
    }
    )
    ;(await modal).present()
  }


  async EliminarVehiculo(vehiculo: any) {

  }
  async EditarVehiculo(vehiculo: any) {

  }
}
