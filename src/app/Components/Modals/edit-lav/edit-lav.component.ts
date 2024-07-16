import { Component, Input, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';

@Component({
  selector: 'app-edit-lav',
  templateUrl: './edit-lav.component.html',
  styleUrls: ['./edit-lav.component.scss'],
})
export class EditLavComponent implements OnInit {

  constructor(
    private LavadoService: LavadoService
  ) { }
  vehiculos: any = []
  vehiculo: any = []
  @Input() data: any = []
  ngOnInit() {
    this.obtenerServicios()
  }

  Anadir(daata : any){

  }

  serviciosSeleccionados: any[] = [];
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
            console.log()
            if(this.vehiculos[index].id_tipo_vehiculo === this.data.lavadodet[0].Tipos_Vehiculos.id_tipo_vehiculo){
              this.vehiculo = this.vehiculos[index]
            }
          }
          console.log(this.vehiculo)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }
}
