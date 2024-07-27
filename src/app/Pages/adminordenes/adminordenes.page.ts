import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleadminComponent } from 'src/app/Components/Modals/detalleadmin/detalleadmin.component';
import { EstadoComponent } from 'src/app/Components/Modals/estado/estado.component';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service';

@Component({
  selector: 'app-adminordenes',
  templateUrl: './adminordenes.page.html',
  styleUrls: ['./adminordenes.page.scss'],
})
export class AdminordenesPage implements OnInit {
  loaded: boolean = false;
  ordenes: any = [];
  intervalId: any;

  constructor(
    private OrdenesService : OrdenesService,
    private ac : AlertServiceService,
    private ModalController : ModalController
  ) { }


  @Input() orden : any = []


  ngOnInit() {
    window.addEventListener('success', () => {
      this.ObtenerOrdenes();
    })
    this.intervalId = setInterval(() => {
      this.ObtenerOrdenes(false);
    }, 3000);
    this.ObtenerOrdenes()
  }


  async alterstate(orden : any): Promise<void> {
    orden.estado = 6;
    (await this.OrdenesService.ActualizarOrden(orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.ObtenerOrdenes()
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

  async ObtenerOrdenes(load: boolean = true): Promise<void> {
    try {
      if (load) {
        this.loaded = false;
      }
      const response: any = await (await this.OrdenesService.OrdenesPendientes(load, 0, 1)).toPromise();
      if (response && response.ordenes) {
        this.ordenes = response.ordenes; 
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

  Opciones(data : any){
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.eliminar(data) },
      { button: this.ac.btnVerOrden, handler: () => this.VerOrden(data) },
      { button: this.ac.btnestado, handler: () => this.cambiarEstado(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  eliminar(data : any){
    this.ac.presentCustomAlert("Elimiar", "Estas seguro de querer eliminar esta orden?", ()=>this.confirmar(data))
  }

  async confirmar(data : any) : Promise<void>{
    this.alterstate(data)
  }


  async cambiarEstado(orden : any) : Promise<void>{
    var modal: any = null;
    modal = await this.ModalController.create({
      component: EstadoComponent,
      canDismiss: true,
      componentProps: {
        ordenes: orden,
      },
    });
    return await modal.present();
  }


  async VerOrden(data: any) {
    var modal: any = null;
    modal = await this.ModalController.create({
      component: DetalleadminComponent,
      canDismiss: true,
      componentProps: {
        ordenes: data,
      },
    });
    return await modal.present();
  }


  getEstado(estado: number): string {
    return this.OrdenesService.getEstado(estado)
  }


}
