import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { EmpleadosService } from 'src/app//services/Empleados/empleados.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
import { PopoverController } from '@ionic/angular';
import { PropiedadesComponent } from 'src/app/Components/Secciones/Empleado/propiedades/propiedades.component'

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  empleados: any = []

  constructor(
    private EmpleadosService: EmpleadosService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.ObtenerEmpleados()
    window.addEventListener('success', () => {
      this.ModalController.dismiss()
      this.ObtenerEmpleados()
    })
  }

  async AbrirModalEmpleados(id: number, titulo: string, data: any = null) {
    const modal = await this.ModalController.create({
      component: MesasComponent,
      componentProps: {
        id: id,
        titulo: titulo,
        data: data
      },
    });
    return await modal.present();
  }

  async ObtenerEmpleados(load: boolean = true): Promise<void> {
    (await this.EmpleadosService.Empleados(load)).subscribe(
      async (response: any) => {
        if (response && response.empleados) {
          this.empleados = response.empleados;
          console.log(this.empleados)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
    this.ModalController.dismiss()
  }

  async EliminarEmpleados(empleado: any) {
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar al empleado: " + empleado.nombrecompleto, () => this.ConfirmarELiminar(empleado.id));
  }

  async ConfirmarELiminar(id: number): Promise<void> {
    (await this.EmpleadosService.EliminarEmpleado(id)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerEmpleados(false);
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

  verConsumo(empleado: any): void {

  }

  async verPropiedades(empleado: any, event: Event): Promise<void> {
    const popover = await this.popoverController.create({
      component: PropiedadesComponent,
      componentProps: {empleado : empleado},
      event: event,
      size : 'cover',
      translucent: true,
      animated: true, 
      mode: 'ios', 
      showBackdrop: true,
      backdropDismiss: true
    });
    await popover.present();
  }

  total (empleado : any) : number{
    let total : number = 0
    if(empleado.consumoEmpleado != null){
      for (let index = 0; index < empleado.consumoEmpleado.length; index++) {
        if(empleado.consumoEmpleado[index].bebidas != null){
          total += empleado.consumoEmpleado[index].bebidas.precioempleados * empleado.consumoEmpleado[index].cantidad
        }
        if(empleado.consumoEmpleado[index].concepto != null){
          total += empleado.consumoEmpleado[index].cantidad
        }
        if(empleado.consumoEmpleado[index].platillos != null){
          total += empleado.consumoEmpleado[index].platillos.precioempleado * empleado.consumoEmpleado[index].cantidad
        }
      }
    }
    return empleado.salario - total
  }
  
  

}
