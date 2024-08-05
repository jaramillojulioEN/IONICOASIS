import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';
import { LoaderFunctions } from 'src/functions/utils';

interface LavadoDet {
  id_servicio: number;
  id_tipo_vehiculo: number;
}

@Component({
  selector: 'app-edit-lav',
  templateUrl: './edit-lav.component.html',
  styleUrls: ['./edit-lav.component.scss'],
})
export class EditLavComponent implements OnInit {
  message: string = "";

  constructor(
    private LavadoService: LavadoService,
    private corteservice: CortesService,
    private ac: AlertServiceService,
    private md : ModalController
  ) { }

  vehiculos: any[] = [];
  vehiculo: any = {};
  @Input() data: any = [];
  
  serviciosSeleccionados: LavadoDet[] = [];
  detalle : any
  ngOnInit() {
    console.log(this.data)
    this.obtenerServicios().then(() => {
      this.preparedata();
      this.syncSeleccionados();
    });
    this.detalle = {
      id_servicio : 0,
      id_tipo_vehiculo : 0,
      id_lavado: this.data.id,
      subtotal : 0
    }
  }

  preparedata() {
    for (let index = 0; index < this.data.lavadodet.length; index++) {
      const element = this.data.lavadodet[index];
      this.serviciosSeleccionados.push({
        id_servicio: element.id_servicio,
        id_tipo_vehiculo: element.id_tipo_vehiculo
      });
    }
  }


  toggleSeleccion(servicio: any) {
    servicio.seleccionado = !servicio.seleccionado;
    if (servicio.seleccionado) {
      this.serviciosSeleccionados.push({
        id_servicio: servicio.id_servicio,
        id_tipo_vehiculo: servicio.id_tipo_vehiculo
      });
      this.detalle.id_servicio = servicio.id_servicio
      this.detalle.id_tipo_vehiculo = servicio.id_tipo_vehiculo
      this.detalle.subtotal = servicio.Servicios.precio
      this.crear()
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(item =>
        item.id_servicio !== servicio.id_servicio || item.id_tipo_vehiculo !== servicio.id_tipo_vehiculo
      );
      this.detalle.id_servicio = servicio.id_servicio
      this.detalle.id_tipo_vehiculo = servicio.id_tipo_vehiculo
      this.detalle.subtotal = servicio.Servicios.precio
      this.ConfirmarELiminar();
    }
  }

  async ConfirmarELiminar () :Promise<void> {
    (await this.corteservice.EliminarDetalle(this.detalle)).subscribe(
      async (response: any) => {
        if (response) {
          window.dispatchEvent(new Event('success'));
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

  async crear(){
    (await this.corteservice.CrearDetalle(this.detalle)).subscribe(
      (response: any) => {
        window.dispatchEvent(new Event('success'));
        this.ac.presentCustomAlert("Exito", response.message)
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
          for (let index = 0; index < this.vehiculos.length; index++) {
            if(this.vehiculos[index].id_tipo_vehiculo === this.data.lavadodet[0].Tipos_Vehiculos.id_tipo_vehiculo){
              this.vehiculo = this.vehiculos[index];
              // Marcar los servicios como seleccionados
              this.syncSeleccionados();
            }
          }
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  syncSeleccionados() {
    if (this.vehiculo && this.vehiculo.Servicio_Tipo_Vehiculo) {
      for (let servicio of this.vehiculo.Servicio_Tipo_Vehiculo) {
        servicio.seleccionado = this.serviciosSeleccionados.some(
          seleccionado => seleccionado.id_servicio === servicio.id_servicio && seleccionado.id_tipo_vehiculo === servicio.id_tipo_vehiculo
        );
      }
    }
  }
}
