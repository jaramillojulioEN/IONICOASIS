import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
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
    private funcs: LoaderFunctions,
    private ac: AlertServiceService,
    private md : ModalController
  ) { }

  vehiculos: any[] = [];
  vehiculo: any = {};
  @Input() data: any = [];
  lavado = {
    tipoEntidad: "lavado",
    entidad: {
      id: 0,
      fecha: this.funcs.obtenerFechaHoraActual(),
      estado: 1,
      idsucursal:  0,
      total: 0,
      lavadodet: [] as LavadoDet[]
    }
  };
  serviciosSeleccionados: LavadoDet[] = [];

  ngOnInit() {
    console.log(this.data)
    this.obtenerServicios().then(() => {
      this.preparedata();
      this.syncSeleccionados();
    });
  }

  preparedata() {
    this.lavado.entidad.id = this.data.id
    this.lavado.entidad.idsucursal = this.data.idsucursal
    for (let index = 0; index < this.data.lavadodet.length; index++) {
      const element = this.data.lavadodet[index];
      this.serviciosSeleccionados.push({
        id_servicio: element.id_servicio,
        id_tipo_vehiculo: element.id_tipo_vehiculo
      });
    }
  }

  async Guardar(): Promise<void> {
    this.lavado.entidad.lavadodet = [...this.serviciosSeleccionados];
    this.lavado.entidad.fecha = this.funcs.obtenerFechaHoraActual();
    if (this.ValidarLavado()) {
      console.log(this.lavado);
      (await this.LavadoService.CrearLavado(this.lavado)).subscribe(
        (response: any) => {
          if (response.message) {
            window.dispatchEvent(new Event('success'));

            this.ac.presentCustomAlert("Exito", response.message);
            this.md.dismiss()
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.ac.presentCustomAlert("Error", this.message);
    }
  }

  ValidarLavado(): boolean {
    let stt = true;
    if (this.lavado.entidad.lavadodet.length == 0) {
      stt = false;
      this.message = "Debes seleccionar un tipo de vehiculo y sus servicios";
    }
    return stt;
  }

  toggleSeleccion(servicio: any) {
    servicio.seleccionado = !servicio.seleccionado;
    if (servicio.seleccionado) {
      this.serviciosSeleccionados.push({
        id_servicio: servicio.id_servicio,
        id_tipo_vehiculo: servicio.id_tipo_vehiculo
      });
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(item =>
        item.id_servicio !== servicio.id_servicio || item.id_tipo_vehiculo !== servicio.id_tipo_vehiculo
      );
    }

    console.log('Servicios seleccionados:', this.serviciosSeleccionados);
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
