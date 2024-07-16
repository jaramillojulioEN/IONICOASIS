import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { EmpleadosService } from 'src/app//services/Empleados/empleados.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
import { PopoverController } from '@ionic/angular';
import { PropiedadesComponent } from 'src/app/Components/Secciones/Empleado/propiedades/propiedades.component'
import { ConsumoComponent } from 'src/app/Components/Modals/consumo/consumo.component'
import { EmpleadosComponent } from 'src/app/Components/Modals/Empleados/empleados/empleados.component'
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
  ) {
    
  }

  ngOnInit() {



    this.ObtenerEmpleados()
    window.addEventListener('success', () => {
      this.ModalController.dismiss()
      this.ObtenerEmpleados()
    })
  }

  async AbrirModalConsumo(id: number, titulo: string, data: any = null) {
    const modal = await this.ModalController.create({
      component: ConsumoComponent,
      componentProps: {
        id: id,
        titulo: titulo,
        data: data
      },
    });
    return await modal.present();
  }

  async AbrirModalEmpleados(data: any = null) {
    const modal = await this.ModalController.create({
      component: EmpleadosComponent,
      componentProps: {
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

  RefactorizarConsumo(consumo: any, isdelete: boolean) {
    console.log(consumo)
    if (isdelete) {
      this.ac.presentCustomAlert("Eliminar", "¿Estás seguro de eliminar este elemento?: ", () => this.CEliminarConsumo(consumo));
    } else {
    }
  }

  async CEliminarConsumo(consumo: any): Promise<void> {
    (await this.EmpleadosService.RefactorizarConsumo(consumo, true)).subscribe(
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
  detallesVisibles: { [key: number]: boolean } = {};
  verConsumo(empleado: any) {
    const empleadoId = empleado.id;
    this.detallesVisibles[empleadoId] = !this.detallesVisibles[empleadoId];
  }


  Opciones(data: any, event: Event) {
    this.ac.configureAndPresentActionSheet([
      { button: this.ac.btnEliminar, handler: () => this.EliminarEmpleados(data) },
      { button: this.ac.btnActualizar, handler: () => { this.AbrirModalEmpleados(data); } },
      { button: this.ac.btnAgregarconsumo, handler: () => { this.AbrirModalConsumo(0, 'Nuevo Consumo'); } },
      { button: this.ac.btnProps, handler: () => { this.verPropiedades(data, event); } },
      { button: this.ac.btnConsumo, handler: () => { this.verConsumo(data); } },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    ]);
  }

  async verPropiedades(empleado: any, event: Event): Promise<void> {
    const popover = await this.ModalController.create({
      component: PropiedadesComponent,
      componentProps: { empleado: empleado },
      animated: true,
      mode: 'ios',
      showBackdrop: true,
      backdropDismiss: false
    });
    await popover.present();
  }

  total(empleado: any): number {
    let total: number = 0
    if (empleado.consumoEmpleado != null) {
      for (let index = 0; index < empleado.consumoEmpleado.length; index++) {
        if (empleado.consumoEmpleado[index].bebidas != null) {
          total += empleado.consumoEmpleado[index].bebidas.precioempleados * empleado.consumoEmpleado[index].cantidad
        }
        if (empleado.consumoEmpleado[index].concepto != null) {
          total += empleado.consumoEmpleado[index].cantidad
        }
        if (empleado.consumoEmpleado[index].platillos != null) {
          total += empleado.consumoEmpleado[index].platillos.precioempleado * empleado.consumoEmpleado[index].cantidad
        }
      }
    }
    return empleado.salario - total
  }



}
