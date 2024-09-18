import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'app-detalleadmin',
  templateUrl: './detalleadmin.component.html',
  styleUrls: ['./detalleadmin.component.scss'],
})
export class DetalleadminComponent implements OnInit {
  intervalId: any;

  constructor(
    private ac: AlertServiceService,
    private ordenservice: OrdenesService,
    private pop: PopoverController,
    private ordenservise: OrdenesService
  ) { }


  detalle: any = {
    cantidad: 0
  }

  @Input() ordenes: any = []
  ngOnInit() {
    this.detalle.cantidad = 0
    this.buscarOrden();

  }

  Opciones(data: any, bebida: boolean) {
    let buttons: any[] = []
    if (this.ordenes.estado !== 3 && this.ordenes.estado !== 5) {
      buttons.push({ button: this.ac.btnEliminar, handler: () => this.Eliminar(data, bebida) })
      buttons.push({ button: this.ac.btnActualizar, handler: () => this.editar(data, bebida) })
    }
    buttons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(buttons);
  }

  leyenda = ""
  editar(item: any, isbebida: boolean) {
    console.log(item)
    this.edit = true;
    this.detalle = item

    if (isbebida) {
      this.isplatillo = false
      this.leyenda = item.bebidas.nombre
    } else {
      this.isplatillo = true

      this.leyenda = item.platillos.nombre
    }


  }

  cancel() {

    this.edit = false;
    this.detalle = undefined
    this.leyenda = "Selecciona"
  }

  Eliminar(data: any, bebida: boolean) {
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de querer eliminar este platillo de la orden?", () => this.confirm(data, bebida))
  }


  async confedit() {
    console.log(this.detalle)


    if (this.isplatillo) {
      (await this.ordenservise.ActualizarPlato(this.detalle)).subscribe(
        async (response: any) => {
          if (response && response.message) {
            this.ac.presentCustomAlert("Exito", response.message)
            this.cancel()
            this.buscarOrden()
            window.dispatchEvent(new Event('success'));
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {

      (await this.ordenservise.ActualizarPlato(this.detalle, false)).subscribe(
        async (response: any) => {
          if (response && response.message) {
            this.ac.presentCustomAlert("Exito", response.message)
            this.cancel()
            this.buscarOrden()
            window.dispatchEvent(new Event('success'));
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

  edit = false;

  isplatillo = true;
  async Select(isPlatillo: boolean, event: Event) {
    const modal = await this.pop.create({
      component: SelectComponent,
      backdropDismiss: true,
      componentProps: {
        isPlatillo: this.isplatillo,
      },
      translucent: true,
      event: event,
      arrow: true,
      side: 'top',
      size: "cover",
      mode: 'ios'
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        var item = dataReturned.data
        this.leyenda = item.nombre
        if (this.isplatillo) {
          this.detalle.idplatillo = item.id
          this.detalle.platillos = undefined
        } else {
          this.detalle.idbebida = item.id
          this.detalle.bebidas = undefined

        }
      }
    });
    return await modal.present();
  }



  async confirm(data: any, bebida: boolean): Promise<void> {
    if (!bebida) {
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
    } else {
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
