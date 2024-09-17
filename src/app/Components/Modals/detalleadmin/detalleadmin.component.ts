import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';

@Component({
  selector: 'app-detalleadmin',
  templateUrl: './detalleadmin.component.html',
  styleUrls: ['./detalleadmin.component.scss'],
})
export class DetalleadminComponent  implements OnInit {
  intervalId: any;

  constructor(
    private ac : AlertServiceService,
    private ordenservice : OrdenesService
  ) { }
  @Input() ordenes : any = []
  ngOnInit() {
    this.buscarOrden();

  }

  Opciones(data : any, bebida : boolean){
    let buttons : any[] = []
    if(this.ordenes.estado !== 3 && this.ordenes.estado !== 5){
      buttons.push({ button: this.ac.btnEliminar, handler: () => this.Eliminar(data, bebida) })
    }
    buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(buttons);
  }

  Eliminar(data : any, bebida : boolean){
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de querer eliminar este platillo de la orden?", ()=>this.confirm(data, bebida))
  }

  

  async confirm(data : any, bebida : boolean) : Promise<void>{
    if(!bebida){
      (await this.ordenservice.EliminarPDetalle(data)).subscribe(
        async (response: any) => {
          if (response) {
            this.buscarOrden();
            this.ac.presentCustomAlert("Exito", response.message)
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        })
    }else{
      (await this.ordenservice.EliminarBDetalle(data)).subscribe(
        async (response: any) => {
          if (response) {
            this.buscarOrden();
            this.ac.presentCustomAlert("Exito", response.message)
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        })
    }

  }

  async buscarOrden(): Promise<void> {
    console.log("Se buscó");
    (await this.ordenservice.BuscarOrden(false, this.ordenes.id)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.ordenes = response.orden
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
