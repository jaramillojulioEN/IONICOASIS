import { Component, OnInit } from '@angular/core';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-crear-lavado',
  templateUrl: './crear-lavado.component.html',
  styleUrls: ['./crear-lavado.component.scss'],
})
export class CrearLavadoComponent  implements OnInit {
  nonfilter: any;

  constructor(private LavadoService : LavadoService, private funcs : LoaderFunctions) { }

  fechaActual: string = this.funcs.obtenerFechaHoraActual();
  vehiculo: any = []
  vehiculos: any = []
  servicios: any = [];
  loaded = false;

  criterio : string = ""

  ngOnInit() {
    this.obtenerServicios();
  }

  async Filtrar(){
    console.log(this.vehiculo.Servicio_Tipo_Vehiculo)
  }



  async obtenerServicios(): Promise<void> {
    (await this.LavadoService.Vehiculos(false)).subscribe(
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
    this.loaded = true
  }


}
