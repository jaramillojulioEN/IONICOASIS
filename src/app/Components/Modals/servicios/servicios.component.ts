import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service'

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit {
  servicios: any = [];
  nuevoservicio: boolean = false;
  constructor(private LavadoService: LavadoService) { }

  servicio: any = {
    tipoEntidad: "Servicios",
    entidad: {
      id: 0,
      nombre_servicio: "",
      descripcion: "",
      precio: 0,
    }
  }
  ngOnInit() {
    this.obtenerServicios()
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
      console.log(this.vehiculo);
      (await this.LavadoService.CrearLavado(this.servicio)).subscribe(
        (response: any) => {
          if (response.message) {
            this.obtenerServicios()
            console.log(this.vehiculo);
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
      this.nuevoservicio = false
    }
  }

  @Input() vehiculo: any = {
    id_tipo_vehiculo: 0,
    tipo_vehiculo: "",
    Servicio_Tipo_Vehiculo: []
  }


  ischeck(idServicio: number): boolean {
    console.log(idServicio)
    return this.vehiculo.Servicio_Tipo_Vehiculo.some((servicio: any) => servicio.id_servicio === idServicio);
  }



  AddOrDelete(id: number) {
    const index = this.vehiculo.Servicio_Tipo_Vehiculo.findIndex((element: any) => element.id_servicio === id);
    if (index > -1) {
      this.vehiculo.Servicio_Tipo_Vehiculo.splice(index, 1);
    } else {
      this.vehiculo.Servicio_Tipo_Vehiculo.push({ id: 0, id_tipo_vehiculo: this.vehiculo.id_tipo_vehiculo, id_servicio: id });
    }
    console.log(this.vehiculo.Servicio_Tipo_Vehiculo);
  }


  async AgregarTipo(): Promise<void> {

    console.log(this.vehiculo)

  }
}
