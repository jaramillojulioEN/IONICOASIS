import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss'],
})
export class EstadoComponent implements OnInit {

  @Input() ordenes: any = []
  constructor(
    private ordenservise: OrdenesService,
    private ac: AlertServiceService
  ) { }

  loaded = false;

  ngOnInit() {
    this.buscarOrden();
    console.log(this.ordenes.id)
  }

  async buscarOrden(): Promise<void> {
    if(this.ordenes.id === undefined){
      this.loaded = true;
      return;
    }
    await (await this.ordenservise.BuscarOrden(false, this.ordenes.id)).subscribe({
      next: (response: any) => {
        if (response && response.orden) {
          this.ordenes = response.orden
        } else {
          this.ac.presentCustomAlert("error", response.message)
        }
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.loaded = true;
      },
    });
  }


  estados: any = this.ordenservise.estados
  estado: any
  getEstado(estado: number): string {
    return this.ordenservise.getEstado(estado)
  }

  async alterstate(): Promise<void> {
    console.log(this.ordenes);

    if (this.ordenes.estado == 3) {
      this.ordenes.ordenesplatillos.forEach((element: any) => {
        element.estado = 2
      });
    }
    (await this.ordenservise.ActualizarOrden(this.ordenes)).subscribe(
      async (response: any) => {
        if (response && response.message) {
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

  onEstadoChange() {
    this.ordenes.estado = this.estado
    this.alterstate();
  }

}
