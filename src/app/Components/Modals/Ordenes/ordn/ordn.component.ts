import { Component, Input, OnInit } from '@angular/core';
import { ignoreElements } from 'rxjs';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { UserServiceService } from 'src/app/services/Users/user-service.service'
@Component({
  selector: 'app-ordn',
  templateUrl: './ordn.component.html',
  styleUrls: ['./ordn.component.scss'],
})
export class OrdnComponent implements OnInit {

  constructor(
    private ac: AlertServiceService,
    private UserServiceService: UserServiceService,
    private OrdenesService: OrdenesService,
  ) { }

  estadoCreacion: number = 0;
  OrdenDetalles : any = []
  @Input() idmesa: number = 0
  @Input() ordenold: any = []

  NewOrden = {
    id: null,
    fecha: '',
    idsucursal: 0,
    total: 0.00,
    orden: '',
    estado: 1,
    idmesa: 0,
    idmesero: 0,
    observaciones: '',
    nombrecliente: '',
    tiempo: 0
  };

  tipo: string = "default"
  user: any = []
  detallePlatillo = {
    id: 0,
    idplatillo: 0,
    cantidad: null,
    idorden: 0,
    observaciones: '',
    estado: 0
  };

  DetalleBebida = {
    id: 0,
    idbebida: 0,
    cantidad: null,
    idorden: 0,
    estado: 0
    // 0 - creado
    // 1- añadido
  };
  ngOnInit() {
    const fechaActual = new Date();
    const hoy = this.convertirFechaHoraParaSQLServer(fechaActual);
    this.user = this.UserServiceService.getUser()
    this.NewOrden.idmesero = this.user.id
    this.NewOrden.idsucursal = this.user.sucursales.id
    this.NewOrden.fecha = hoy
    this.NewOrden.idmesa = this.idmesa

    if(this.ordenold.id != null){
      this.OrdenDetalles = this.ordenold
      this.estadoCreacion = 1
      this.NewOrden.nombrecliente = this.ordenold.nombrecliente
      this.NewOrden.orden = this.ordenold.orden
      this.NewOrden.observaciones = this.ordenold.observaciones
      this.DetalleBebida.estado = 1
      this.detallePlatillo.estado = 1
      this.NewOrden.total = this.total()
    }
    
  }

  async CrearOrden(): Promise<void> {
    let validacionResposnse = this.validaOrden();
    if (validacionResposnse.estado) {
      (await this.OrdenesService.CrearOrden(this.NewOrden)).subscribe(
        (response: any) => {
          window.dispatchEvent(new Event('success'));
          this.ac.presentCustomAlert("Exito", response.message + ", ahora puedes agregar platillos y bebidas")
          this.ordenold.id = response.id
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
      this.estadoCreacion = 1
    } else {
      this.ac.presentCustomAlert('Error', validacionResposnse.mensaje)
    }
  }

  validaOrden(): { estado: boolean, mensaje: string } {
    let estado = true;
    let mensaje = '';
    if (this.NewOrden.observaciones === "") {
      estado = false;
      mensaje = 'El campo de observaciones es obligatorio.';
    }
    if (this.NewOrden.orden === "") {
      estado = false;
      mensaje = 'El campo de nombre de orden es obligatorio.';
    }
    if (this.NewOrden.nombrecliente === "") {
      estado = false;
      mensaje = 'El campo de nombre de cliente es obligatorio.';
    }
    return { estado: estado, mensaje: mensaje };
  }

  convertirFechaHoraParaSQLServer(fecha: Date): string {
    const fechaISO = fecha.toISOString();
    return fechaISO.slice(0, 19);
  }

  async crearDetalle(detalle : any)  : Promise<void>{
    if(this.ordenold.id){
      detalle.idorden = this.ordenold.id;
      console.log(detalle.idorden)
    }
    else{
      this.ac.presentCustomAlert("Error", "Se presentó un problema interno, contacte a soporte")
    }
    (await this.OrdenesService.CrearOrdenDetail(detalle)).subscribe(
      (response: any) => {
        this.limpiar()
        this.buscarOrden(detalle.idorden)
        window.dispatchEvent(new Event('success'));
        this.ac.presentCustomAlert("Exito", response.message)
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async buscarOrden (idorden : number) : Promise<void> {
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


  limpiar () : void {
    this.detallePlatillo.cantidad = null
    this.detallePlatillo.idplatillo = 0
    this.DetalleBebida.cantidad = null
    this.DetalleBebida.idbebida = 0
  }
  
  total() : number{
    return this.OrdenesService.total(this.OrdenDetalles)
  }

}
