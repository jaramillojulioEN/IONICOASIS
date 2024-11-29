import { Component, Input, OnInit } from '@angular/core';
import { SelectComponent } from '../../../select/select.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import { ModalController, PopoverController } from '@ionic/angular';
import { LoaderFunctions } from 'src/functions/utils';
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
    fecha: this.funcs.obtenerFechaHoraActual()
  };

  DetalleBebida = {
    id: 0,
    idbebida: 0,
    cantidad: 1,
    idorden: 0,
    estado: 0,
    fecha: this.funcs.obtenerFechaHoraActual()
  };
  ngOnInit() {
    console.log(this.ordenold)
    this.user = this.UserServiceService.getUser()
    this.NewOrden.idmesero = this.user.id
    this.NewOrden.idsucursal = this.user.sucursales.id
    this.NewOrden.fecha = this.funcs.obtenerFechaHoraActual()
    this.NewOrden.idmesa = this.idmesa
    if (this.ordenold.id != null) {
      this.OrdenDetalles = this.ordenold
      if (this.ordenold.estado === 2) {
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
        this.ac.presentCustomAlert("Error", "Debes agregar una cantidad")
      }
      detalle.cantidad = this.DetalleBebida.cantidad
    }
    console.log(detalle);
    if (detalle.cantidad !== 0) {
      if (this.ordenold.id) {
        detalle.idorden = this.ordenold.id;
        console.log(detalle);
        await this.procesarDetalle(detalle); // Procesar el detalle directamente
      } else {
        await this.CrearOrden(); // Esperar a que se cree la orden
        detalle.idorden = this.ordenold.id; // Asignar el ID de la orden creada
        await this.procesarDetalle(detalle); // Procesar el detalle después de crear la orden
      }
    } else {
      this.ac.presentCustomAlert("Error", "Debes agregar una cantidad")
    }

  }

  enviarcocina(estado: number) {
    // if(this.detallePlatillo.cantidad == 0){

    // }
    this.ac.presentCustomAlert("Enviar a cocina", "Estas seguro de querer enviar a cocina", () => this.alterstate(estado))
  }

  async alterstate(estado: number): Promise<void> {
    this.OrdenDetalles.estado = estado;
    (await this.OrdenesService.ActualizarOrden(this.OrdenDetalles)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          await this.buscarOrden(this.OrdenDetalles.id);
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
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
      console.error('Error en la solicitud:', error);
    }
    finally{
      this.isprep =false;
    }
  }


  async cantidadplatillo(suma : boolean, detalleplato:any){
    if(suma){
      detalleplato.cantidad = detalleplato.cantidad + 1;
    }else{
      detalleplato.cantidad = detalleplato.cantidad -1;
    }
    (await this.OrdenesService.ActualizarPlato(detalleplato, true)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
        } else {
          this.ac.presentCustomAlert("Error", response.message)
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }
  async cantidadbebida(suma : boolean, detallebebida:any){
    if(suma){
      detallebebida.cantidad = detallebebida.cantidad + 1;
    }else{
      detallebebida.cantidad = detallebebida.cantidad -1;
    }
    (await this.OrdenesService.ActualizarPlato(detallebebida, false)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
        } else {
          this.ac.presentCustomAlert("Error", response.message)
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async CrearOrden(): Promise<void> {
    this.NewOrden.estado = -1
    try {
      const response = await (await this.OrdenesService.CrearOrden(this.NewOrden)).toPromise();
      this.ordenold.id = response.id;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  }

  async buscarOrden(idorden: number): Promise<void> {
    (await this.OrdenesService.BuscarOrden(false, idorden)).subscribe(
      async (response: any) => {
        if (response && response.orden) {
          this.OrdenDetalles = response.orden
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
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

  EliminarBebida(bebida: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar la bebida " + bebida.bebidas.nombre, () => this.ConfirmarELiminarBebida(bebida));
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



  limpiar(): void {
    this.detallePlatillo.cantidad = 0
    this.detallePlatillo.idplatillo = 0
    this.detallePlatillo.observaciones = ""
    this.DetalleBebida.cantidad = 0
    this.DetalleBebida.idbebida = 0
    this.detalleb = ""
    this.detallep = ""
  }

  total(): number {
    return this.OrdenesService.total(this.OrdenDetalles)
  }

  increaseQuantity(beb = true) {
    if (beb)
      this.DetalleBebida.cantidad = (this.DetalleBebida.cantidad || 0) + 1;
    else
    this.detallePlatillo.cantidad = (this.detallePlatillo.cantidad || 0) + 1;

  }

  decreaseQuantity(beb = true) {
    if(beb){
      if (this.DetalleBebida.cantidad > 1) {
        this.DetalleBebida.cantidad -= 1;
      }
      else{
        if (this.detallePlatillo.cantidad > 1) {
          this.detallePlatillo.cantidad -= 1;
        }
      }
    }

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
      if (dataReturned.data) {
        if (isPlatillo) {
          this.detallep = dataReturned.data.nombre
          this.detallePlatillo.idplatillo = dataReturned.data.id
        } else {
          if (dataReturned.data.isprep) {
            this.isprep = dataReturned.data.isprep;
            this.detalleb = dataReturned.data.nombre
            this.detallePlatillo.idplatillo = dataReturned.data.id
          } else {
            this.detalleb = dataReturned.data.nombre
            this.DetalleBebida.idbebida = dataReturned.data.id
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
