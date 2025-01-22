import { Component, OnInit } from '@angular/core';
import { SelectComponent } from '../../select/select.component';
import { PopoverController } from '@ionic/angular';
import { LoaderFunctions } from 'src/functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';
@Component({
  selector: 'app-venta-especial',
  templateUrl: './venta-especial.component.html',
  styleUrls: ['./venta-especial.component.scss'],
})
export class VentaEspecialComponent implements OnInit {
  isprep: any;

  id: number = 0
  detalle: any;

  constructor(private pop: PopoverController, protected OrdenesService: OrdenesService, private fn: LoaderFunctions, private usr: UserServiceService, private ac: AlertServiceService) { }
  cantidad: number = 1
  Segmento: string = "Especial"
  selectedCategory: string = 'Platillo';
  TipoVenta: number = 1;
  text: string = "Selecciona Platillo"
  orden: any = {
    fecha: this.fn.obtenerFechaHoraActual(),
    idsucursal: this.usr.getUser().idsucursal,
    total: 0,
    estado: 7,
    tiempo: 0,
    pausado: 0,
    id: 0,
    isPausado: false,
    tiempoPausado: 0
  }


  selectCategory(category: string) {
    this.text = "Selecciona " + category
    this.selectedCategory = category;
    this.id = 0
    this.mensaje = ""
  }

  cobrarespecial() 
  {
    var estado = this.TipoVenta === 1 ? 7 : 8
    this.ac.presentCustomAlert("Orden especial", "Estás seguro de querer cobrar esta orden?", () => this.alterstate(estado))
  }

  async alterstate(estado: number): Promise<void> {
    this.orden.estado = estado;
    (await this.OrdenesService.ActualizarOrden(this.orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          await this.buscarOrden(this.orden.id);
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  async cantidadplatillo(suma: boolean, detalleplato: any) {
    // Actualizar la cantidad
    detalleplato.cantidad = suma ? detalleplato.cantidad + 1 : detalleplato.cantidad - 1;
  
    try {
      const response = await (await this.OrdenesService.ActualizarPlato(detalleplato, true)).toPromise();
  
      if (response && response.message) {
        // Lógica adicional si es necesario
      } else {
        this.ac.presentCustomAlert("Error", response?.message || "Error desconocido");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      // Buscar la orden siempre al final
      this.buscarOrden(detalleplato.idorden);
    }
  }
  
  async cantidadbebida(suma: boolean, detallebebida: any) {
    // Actualizar la cantidad
    detallebebida.cantidad = suma ? detallebebida.cantidad + 1 : detallebebida.cantidad - 1;
  
    try {
      const response = await (await this.OrdenesService.ActualizarPlato(detallebebida, false)).toPromise();
  
      if (response && response.message) {
        // Lógica adicional si es necesario
      } else {
        this.ac.presentCustomAlert("Error", response?.message || "Error desconocido");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      // Buscar la orden siempre al final
      this.buscarOrden(detallebebida.idorden);
    }
  }
  

  ngOnInit() {
    console.log(this.orden)
    if (this.orden.id !== 0) {
      this.buscarOrden(this.orden.id)
    }
  }

  mensaje: string = ""
  validar(): boolean {
    if (this.id === 0) {
      this.mensaje = "Debes seleccionar una bebida o producto.";
      return false;
    }
    if (this.cantidad <= 0) {
      this.mensaje = "La cantidad debe ser mayor a 0.";
      return false;
    }
    this.mensaje = "";
    return true;
  }

  async confirmar() {
    try {
      if (this.validar()) {
        if (this.selectedCategory === "Bebida") {
          this.detalle = {
            id: 0,
            idbebida: this.id,
            cantidad: this.cantidad,
            idorden: this.orden.id,
            estado: 1,
            fecha: this.fn.obtenerFechaHoraActual()
          }
        } else {
          this.detalle = {
            id: 0,
            idplatillo: this.id,
            idorden: this.orden.id,
            observaciones: "Venta especial",
            cantidad: this.cantidad,
            estado: 1,
            fecha: this.fn.obtenerFechaHoraActual()
          }
        }

        if (this.orden.id === 0) {
          this.orden.estado = this.TipoVenta === 1 ? 7 : 8
          this.CrearOrden()
        } else {
          this.procesarDetalle()
        }
      } else {
        this.ac.presentCustomAlert("Error", this.mensaje)
      }

    }
    catch {

    }
    finally {



    }

  }



  total(): number {
    return this.OrdenesService.total(this.orden)
  }

  private async procesarDetalle(): Promise<void> {
    try {
      // Llamada al servicio para crear el detalle de la orden
      const response = await (await this.OrdenesService.CrearOrdenDetail(this.detalle, this.TipoVenta)).toPromise();

      // Ejecuta acciones relacionadas al éxito
      this.selectCategory(this.isprep ? "Bebida" : "Platillo");
      this.orden.total = this.total();
      this.ac.presentCustomAlert("Éxito", response.message);

      // Busca la orden únicamente después de que se procesó correctamente
      await this.buscarOrden(this.detalle.idorden);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      // Restablece el estado de preparación sin importar el resultado
      this.isprep = false;
      console.log(this.orden);
    }
  }

  Opciones(data: any, platillo: boolean) {
    let butons: any[] = []

    if (platillo) {
      butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarPlatillo(data) })
    } else {
      butons.push({ button: this.ac.btnEliminar, handler: () => this.EliminarBebida(data) })
    }
    butons.push({ button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } })
    this.ac.configureAndPresentActionSheet(butons);
  }

  EliminarBebida(bebida: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la bebida " + bebida.bebidas.nombre, () => this.ConfirmarELiminarBebida(bebida));
  }

  EliminarPlatillo(platillo: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar el platillo " + platillo.platillos.nombre, () => this.ConfirmarELiminar(platillo));
  }




  async ConfirmarELiminar(platillo: any): Promise<void> {
    (await this.OrdenesService.EliminarPDetalle(platillo)).subscribe(
      async (response: any) => {
        if (response) {
          this.buscarOrden(platillo.idorden);
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


  async ConfirmarELiminarBebida(bebida: any): Promise<void> {
    (await this.OrdenesService.EliminarBDetalle(bebida)).subscribe(
      async (response: any) => {
        if (response) {
          this.ac.presentCustomAlert("Exito", response.message)
          this.buscarOrden(bebida.idorden);

        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async buscarOrden(idorden: number): Promise<void> {
    (await this.OrdenesService.BuscarOrden(false, idorden)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.orden = response.orden
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async CrearOrden(): Promise<void> {
    try {
      const response = await (await this.OrdenesService.CrearOrden(this.orden, this.TipoVenta)).toPromise();
      this.orden.id = response.id
      this.detalle.idorden = response.id

    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    } finally {
      this.procesarDetalle();
    }
  }


  async Select(event: Event) {
    var isplat = this.selectedCategory === "Bebida" ? false : true
    window.dispatchEvent(new Event('carga'));
    console.log("desactivo carga")
    const modal = await this.pop.create({
      component: SelectComponent,
      backdropDismiss: true,
      componentProps: {
        isPlatillo: isplat,
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
        this.id = dataReturned.data.id
        if (isplat) {
          this.text = dataReturned.data.nombre
        } else {
          if (dataReturned.data.isprep) {
            this.isprep = dataReturned.data.isprep;
            this.text = dataReturned.data.nombre
          } else {
            this.text = dataReturned.data.nombre
          }
        }
      }
      window.dispatchEvent(new Event('carga'));
      console.log("activo carga")

    });
    return await modal.present();
  }

}
