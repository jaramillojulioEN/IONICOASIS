import { Component, Input, OnInit } from '@angular/core';
import { SelectComponent } from '../../../select/select.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import { ModalController, PopoverController } from '@ionic/angular';
import { LoaderFunctions } from 'src/functions/utils';
import { data } from 'jquery';
@Component({
  selector: 'app-ordn',
  templateUrl: './ordn.component.html',
  styleUrls: ['./ordn.component.scss'],
})
export class OrdnComponent implements OnInit {
  isprep: boolean = false;

  constructor(
    private ac: AlertServiceService,
    private UserServiceService: UserServiceService,
    private OrdenesService: OrdenesService,
    private pop: PopoverController,
    private funcs: LoaderFunctions,
    private md: ModalController
  ) { }

  OrdenDetalles: any = []
  @Input() idmesa: number = 0
  @Input() cargaactiva: boolean = true
  @Input() ordenold: any = []


  detallep: string = ""
  detalleb: string = ""

  NewOrden = {
    id: null,
    fecha: '',
    idsucursal: 0,
    total: 0.00,
    estado: 1,
    idmesa: 0,
    idmesero: 0,
    tiempo: 0
  };

  tipo: string = "default"
  user: any = []
  detallePlatillo = {
    id: 0,
    idplatillo: 0,
    cantidad: 1,
    idorden: 0,
    observaciones: '',
    estado: 0,
    fecha: this.funcs.obtenerHoraMexicoCentro()
  };

  DetalleBebida = {
    id: 0,
    idbebida: 0,
    cantidad: 1,
    idorden: 0,
    estado: 0,
    fecha: this.funcs.obtenerHoraMexicoCentro()
  };
  ngOnInit() {
    console.log(this.ordenold)
    this.user = this.UserServiceService.getUser()
    this.NewOrden.idmesero = this.user.id
    this.NewOrden.idsucursal = this.user.sucursales.id
    this.NewOrden.idmesa = this.idmesa
    if (this.ordenold.id != null) {
      this.OrdenDetalles = this.ordenold
      if (this.ordenold.estado === 2 || this.ordenold.estado === 3) {
        this.DetalleBebida.estado = 1
        this.detallePlatillo.estado = 1
      }
      this.NewOrden.total = this.total()
    }

  }




  presentresume: any = []

  async crearDetalle(detalle: any): Promise<void> {
    if (this.isprep) {
      if (this.DetalleBebida.cantidad == 0) {
        this.ac.presentCustomAlert("Error", "Debes agregar una cantidad");
        return;
      }
      detalle.cantidad = this.DetalleBebida.cantidad;
    }

    if (detalle.cantidad === 0) {
      this.ac.presentCustomAlert("Error", "Debes agregar una cantidad");
      return;
    }

    if (this.quantylimitant !== null && detalle.cantidad > this.quantylimitant) {
      this.ac.presentCustomAlert(
        "Sin disponibilidad",
        `No se puede preparar esa cantidad. Solo se pueden preparar ${this.quantylimitant}.`
      );
      return;
    }

    console.log(detalle);
    detalle.fecha = this.funcs.obtenerHoraMexicoCentro();
    if (this.ordenold.id) {
      detalle.idorden = this.ordenold.id;
      await this.procesarDetalle(detalle);
    } else {
      await this.CrearOrden();
      detalle.idorden = this.ordenold.id;
      await this.procesarDetalle(detalle);
    }
  }

  enviarcocina(estado: number) {
    // if(this.detallePlatillo.cantidad == 0){

    // }
    this.ac.presentCustomAlert("Enviar a cocina", "Estas seguro de querer enviar a cocina", () => this.alterstate(estado))
  }

  async alterstate(estado: number): Promise<void> {
    this.OrdenDetalles.estado = estado;
    if (estado == 2) {
      this.OrdenDetalles.fecha = this.funcs.obtenerHoraMexicoCentro();
      console.log('[ENVIAR COCINA] id:', this.OrdenDetalles.id, '| fecha enviada:', this.OrdenDetalles.fecha);
    }
    (await this.OrdenesService.ActualizarOrden(this.OrdenDetalles)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          await this.buscarOrden(this.OrdenDetalles.id);
        } else {
          this.ac.presentCustomAlert("Error", response?.message || "No se pudo actualizar la orden.");
        }
      },
      (error: any) => {
        this.ac.presentCustomAlert("Error", "No se pudo actualizar la orden.");
      }
    );
  }

  private async procesarDetalle(detalle: any): Promise<void> {
    try {
      const response = await (await this.OrdenesService.CrearOrdenDetail(detalle)).toPromise();
      this.limpiar();
      this.buscarOrden(detalle.idorden);
      window.dispatchEvent(new Event('success'));
      this.NewOrden.total = this.total()
      this.ac.presentCustomAlert("Éxito", response.message);
    } catch (error) {
      this.ac.presentCustomAlert("Error", "No se pudo agregar el detalle a la orden.");
    }
    finally {
      this.isprep = false;
    }
  }


  async cantidadplatillo(suma: boolean, detalleplato: any) {
    // Actualizar la cantidad
    detalleplato.cantidad = suma ? detalleplato.cantidad + 1 : detalleplato.cantidad - 1;

    try {
      const response = await (await this.OrdenesService.ActualizarPlato(detalleplato, true)).toPromise();

      if (response && response.message) {
        window.dispatchEvent(new Event('success'));
      } else {
        this.ac.presentCustomAlert("Error", response?.message || "Error desconocido");
      }
    } catch (error) {
      this.ac.presentCustomAlert("Error", "No se pudo actualizar la cantidad del platillo.");
    } finally {
      this.buscarOrden(detalleplato.idorden);
    }
  }

  async cantidadbebida(suma: boolean, detallebebida: any) {
    detallebebida.cantidad = suma ? detallebebida.cantidad + 1 : detallebebida.cantidad - 1;

    try {
      const response = await (await this.OrdenesService.ActualizarPlato(detallebebida, false)).toPromise();

      if (response && response.message) {
        window.dispatchEvent(new Event('success'));
      } else {
        this.ac.presentCustomAlert("Error", response?.message || "Error desconocido");
      }
    } catch (error) {
      this.ac.presentCustomAlert("Error", "No se pudo actualizar la cantidad de la bebida.");
    } finally {
      this.buscarOrden(detallebebida.idorden);
    }
  }


  async CrearOrden(): Promise<void> {
    this.NewOrden.estado = -1
    this.NewOrden.fecha = this.funcs.obtenerHoraMexicoCentro()
    try {
      const response = await (await this.OrdenesService.CrearOrden(this.NewOrden)).toPromise();
      this.ordenold.id = response.id;
    } catch (error) {
      this.ac.presentCustomAlert("Error", "No se pudo crear la orden.");
      throw error;
    }
  }

  async buscarOrden(idorden: number): Promise<void> {
    (await this.OrdenesService.BuscarOrden(false, idorden)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.OrdenDetalles = response.orden
        } else {
          this.ac.presentCustomAlert("Aviso", response?.message || "No se pudo cargar la orden.");
        }
      },
      (_error: any) => {
        this.ac.presentCustomAlert("Error", "No se pudo cargar la orden.");
      }
    );
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

  EliminarPlatillo(platillo: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar el platillo " + platillo.platillos.nombre, () => this.ConfirmarELiminar(platillo));
  }

  async ConfirmarELiminar(platillo: any): Promise<void> {
    (await this.OrdenesService.EliminarPDetalle(platillo)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.buscarOrden(platillo.idorden);
          this.ac.presentCustomAlert("Exito", response.message)
        } else {
          this.ac.presentCustomAlert("Error", response?.message || "No se pudo eliminar el platillo.");
        }
      },
      (_error: any) => {
        this.ac.presentCustomAlert("Error", "No se pudo eliminar el platillo.");
      }
    );
  }

  EliminarBebida(bebida: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la bebida " + bebida.bebidas.nombre, () => this.ConfirmarELiminarBebida(bebida));
  }

  async ConfirmarELiminarBebida(bebida: any): Promise<void> {
    (await this.OrdenesService.EliminarBDetalle(bebida)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.ac.presentCustomAlert("Exito", response.message)
          this.buscarOrden(bebida.idorden);
        } else {
          this.ac.presentCustomAlert("Error", response?.message || "No se pudo eliminar la bebida.");
        }
      },
      (_error: any) => {
        this.ac.presentCustomAlert("Error", "No se pudo eliminar la bebida.");
      }
    );
  }



  limpiar(): void {
    this.detallePlatillo.cantidad = 1
    this.detallePlatillo.idplatillo = 0
    this.detallePlatillo.observaciones = ""
    this.DetalleBebida.cantidad = 1
    this.DetalleBebida.idbebida = 0
    this.detalleb = ""
    this.detallep = ""
    this.quantylimitant = null;
  }

  total(): number {
    return this.OrdenesService.total(this.OrdenDetalles)
  }

  quantylimitant: null | number = null;

  increaseQuantity(beb = true) {
    const actual = beb ? this.DetalleBebida.cantidad : this.detallePlatillo.cantidad;
    if (this.quantylimitant !== null && actual >= this.quantylimitant) {
      this.ac.presentCustomAlert('Sin disponibilidad', `Solo hay ${this.quantylimitant} unidad(es) disponible(s).`);
      return;
    }
    if (beb)
      this.DetalleBebida.cantidad = (actual || 1) + 1;
    else
      this.detallePlatillo.cantidad = (actual || 1) + 1;
  }

  clampCantidad(beb = true) {
    const actual = beb ? this.DetalleBebida.cantidad : this.detallePlatillo.cantidad;
    if (actual !== null && actual < 1) {
      this.ac.presentCustomAlert('Valor inválido', 'No se admiten valores menores a 1.');
      if (beb)
        this.DetalleBebida.cantidad = 1;
      else
        this.detallePlatillo.cantidad = 1;
    }
  }

  decreaseQuantity(beb = true) {
    const actual = beb ? this.DetalleBebida.cantidad : this.detallePlatillo.cantidad;
    if (actual <= 1) {
      this.ac.presentCustomAlert('Cantidad mínima', 'La cantidad mínima es 1.');
      return;
    }
    if (beb)
      this.DetalleBebida.cantidad = actual - 1;
    else
      this.detallePlatillo.cantidad = actual - 1;
  }

  async Select(isPlatillo: boolean, event: Event) {
    window.dispatchEvent(new Event('carga'));
    console.log("desactivo carga")
    const modal = await this.pop.create({
      component: SelectComponent,
      backdropDismiss: true,
      componentProps: {
        isPlatillo: isPlatillo,
      },
      translucent: true,
      event: event,
      arrow: true,
      side: 'top',
      size: "cover",
      mode: 'ios'
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      const disp = dataReturned.data?.disponibles;
      this.quantylimitant = (typeof disp === 'object' ? disp?.Disponibles : disp) ?? null;
      if (dataReturned.data) {
        if (isPlatillo) {
          // Limpiar selección de bebidas al seleccionar platillo
          this.detalleb = "";
          this.DetalleBebida.idbebida = 0;
          this.DetalleBebida.cantidad = 1;
          this.isprep = false;
          this.detallep = dataReturned.data.nombre;
          this.detallePlatillo.idplatillo = dataReturned.data.id;
        } else {
          // Limpiar selección de platillo al seleccionar bebida
          this.detallep = "";
          if (dataReturned.data.isprep) {
            this.isprep = true;
            this.DetalleBebida.idbebida = 0;
            this.DetalleBebida.cantidad = 1;
            this.detalleb = dataReturned.data.nombre;
            this.detallePlatillo.idplatillo = dataReturned.data.id;
          } else {
            this.isprep = false;
            this.detallePlatillo.idplatillo = 0;
            this.detallePlatillo.cantidad = 1;
            this.detalleb = dataReturned.data.nombre;
            this.DetalleBebida.idbebida = dataReturned.data.id;
          }
        }
      }
      window.dispatchEvent(new Event('carga'));
      console.log("activo carga")

    });
    return await modal.present();
  }


  async dissmiss() {
    let id = "tomaordenmodal"
    const loading = await this.md.getTop();
    loading?.dismiss()

  }


}
