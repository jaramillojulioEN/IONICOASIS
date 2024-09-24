import { Component, Input, OnInit, QueryList, ViewChildren, input } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  servicios: any = [];
  nuevoservicio: boolean = false;
  @Input() servicio: any = []
  @Input() isService: boolean = false;
  constructor(private LavadoService: LavadoService, private ac: AlertServiceService) { }

  serviciorquest: any = {
    tipoEntidad: "Servicios",
    entidad: {
      id: 0,
      nombre_servicio: "",
      descripcion: "",
      precio: 0,
    }
  }
  ngOnInit() {
    console.log(this.servicio)
    this.obtenerServicios()
    if (this.servicio != null && this.servicio.length != 0) {
      this.serviciorquest.entidad = this.servicio
    }
    if (!this.isService) {
      this.marcarServiciosDisponibles()
    }

  }

  async obtenerServicios(load: boolean = false): Promise<void> {
    (await this.LavadoService.Servicios(load)).subscribe(
      async (response: any) => {
        if (response && response.Servicios) {
          this.servicios = response.Servicios;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async AgregarServicio(): Promise<void> {
    if (!this.nuevoservicio) {
      this.nuevoservicio = true
    } else {
      this.GotoBackEnd(this.serviciorquest)
      this.nuevoservicio = false
    }
  }


  async GotoBackEnd(data: any) {
    (await this.LavadoService.CrearLavado(data)).subscribe(
      (response: any) => {
        if (response.message) {
          this.ac.presentCustomAlert("Notificacion", response.message)
          this.obtenerServicios()
          window.dispatchEvent(new Event('success'));
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async EliminarServicio(data: any) {
    (await this.LavadoService.EliminarServicio(data)).subscribe(
      (response: any) => {
        if (response.message) {
          this.ac.presentCustomAlert("Notificacion", response.message)
          this.obtenerServicios()
          window.dispatchEvent(new Event('success'));
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  @Input() vehiculo: any = {
    id_tipo_vehiculo: 0,
    tipo_vehiculo: "",
    Servicio_Tipo_Vehiculo: []
  }



  serviciosSeleccionados: Set<number> = new Set();
  marcarServiciosDisponibles() {
    this.vehiculo.Servicio_Tipo_Vehiculo.forEach((st: any) => {
      this.serviciosSeleccionados.add(st.id_servicio);
    });
  }

  toggleServicio(id_servicio: number) {
    if (this.serviciosSeleccionados.has(id_servicio)) {
      this.serviciosSeleccionados.delete(id_servicio);
      const index = this.vehiculo.Servicio_Tipo_Vehiculo.findIndex((st: any) => st.id_servicio === id_servicio);
      if (index !== -1) {
        this.vehiculo.Servicio_Tipo_Vehiculo[index].Servicios = null
        console.log(this.vehiculo.Servicio_Tipo_Vehiculo[index])

        this.EliminarServicio(this.vehiculo.Servicio_Tipo_Vehiculo[index])

        this.vehiculo.Servicio_Tipo_Vehiculo.splice(index, 1);
        
      }
    } else {
      this.serviciosSeleccionados.add(id_servicio);
      this.vehiculo.Servicio_Tipo_Vehiculo.push({ id_servicio, id_tipo_vehiculo: this.vehiculo.id_tipo_vehiculo });
    }
  }

  async AgregarTipo(): Promise<void> {
    if (this.vehiculo.tipo_vehiculo != "") {
      if (this.vehiculo.Servicio_Tipo_Vehiculo.length != 0) {
        let Tipos_Vehiculos: any = {
          tipoEntidad: "Tipos_Vehiculos",
          entidad: this.vehiculo
        }
        this.GotoBackEnd(Tipos_Vehiculos)
      } else {
        this.ac.presentCustomAlert("Error", "Debes seleccionar al menos 1 servicio para este vehiculo")
      }
    } else {
      this.ac.presentCustomAlert("Error", "Debes especificar el tipo de vehiculo")
    }

  }
}
