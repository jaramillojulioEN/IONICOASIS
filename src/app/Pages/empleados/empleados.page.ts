import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MesasComponent } from 'src/app/Components/Modals/Mesas/mesas/mesas.component'
import { EmpleadosService } from 'src/app//services/Empleados/empleados.service'
import { AlertServiceService } from '../../services/Alerts/alert-service.service'
import { PopoverController } from '@ionic/angular';
import { PropiedadesComponent } from 'src/app/Components/Secciones/Empleado/propiedades/propiedades.component'
import { ConsumoComponent } from 'src/app/Components/Modals/consumo/consumo.component'
import { EmpleadosComponent } from 'src/app/Components/Modals/Empleados/empleados/empleados.component'
import { LoaderFunctions } from 'src/functions/utils';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { Calls } from 'src/functions/call';
import { InasistenciasComponent } from 'src/app/Components/Modals/inasistencias/inasistencias.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {
  empleados: any = []
  rol: any;
  sucursales: any = [];

  constructor(
    private EmpleadosService: EmpleadosService,
    private ModalController: ModalController,
    private ac: AlertServiceService,
    private userservie: UserServiceService,
    private call: Calls,
    private fn: LoaderFunctions
  ) {

  }
  idu : any =0 
  async ngOnInit() {
    this.rol = this.userservie.getRol();

    this.sucursales = await this.call.getsucus()

    this.ObtenerEmpleados()
    window.addEventListener('success', () => {
      this.ModalController.dismiss()
      this.ObtenerEmpleados()
    })
  }


  change(){
    this.ObtenerEmpleados(true, this.idu)
  }

  async handleRefresh(event: any) {
    await this.ObtenerEmpleados()
    event.target.complete();
  }

  async AbrirModalConsumo(data: any) {
    const modal = await this.ModalController.create({
      component: ConsumoComponent,
      componentProps: {
        data: data
      },
    });
    return await modal.present();
  }

  async AbrirModalEmpleados(data: any = null) {
    const modal = await this.ModalController.create({
      component: EmpleadosComponent,
      componentProps: {
        data: data,
      },
    });
    return await modal.present();
  }

  async ObtenerEmpleados(load: boolean = true, ids: any = 0): Promise<void> {
    (await this.EmpleadosService.Empleados(load, ids)).subscribe(
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
    this.ac.presentCustomAlert("Eliminar", "Estás seguro de eliminar al empleado: " + empleado.nombrecompleto, () => this.ConfirmarELiminar(empleado));
  }



  diasrestantespago(diapago: string): string {
    const diasDeLaSemana: { [key: string]: number } = {
      "lunes": 1,
      "martes": 2,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sábado": 6,
      "domingo": 7
    };

    const diapagonumero = diasDeLaSemana[diapago.toLowerCase()];
    const diahoynumero = this.obtenerNumeroDiaDeHoy();

    let diasRestantes = diapagonumero - diahoynumero;

    if (diasRestantes < 0) {
      diasRestantes += 7;
    }

    return `${diasRestantes} días.`;
  }



  proximaFechaDePago(diapago: string): string {
    const diasDeLaSemana: { [key: string]: number } = {
      "lunes": 1,
      "martes": 2,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sábado": 6,
      "domingo": 7
    };

    const diapagonumero = diasDeLaSemana[diapago.toLowerCase()];
    const diahoynumero = this.obtenerNumeroDiaDeHoy();

    let diasRestantes = diapagonumero - diahoynumero;

    if (diasRestantes <= 0) {
      diasRestantes += 7;
    }

    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + diasRestantes);

    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    const año = fechaActual.getFullYear();

    return `${dia}/${mes}/${año}`;
  }



  obtenerNumeroDiaDeHoy(): number {
    const fechaActual = new Date(this.fn.obtenerFechaHoraActual());
    let numeroDia = fechaActual.getDay();
    if (numeroDia === 0) {
      numeroDia = 7;
    }
    return numeroDia;
  }

  async ConfirmarELiminar(emp: any): Promise<void> {
    (await this.EmpleadosService.EliminarEmpleado(emp)).subscribe(
      async (response: any) => {
        if (response) {
          this.ObtenerEmpleados(true);
          this.ac.presentCustomAlert("Exito", response.message)
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
  async verConsumo(empleado: any) {
    // const empleadoId = empleado.id;
    // this.detallesVisibles[empleadoId] = !this.detallesVisibles[empleadoId];
    const modal = await this.ModalController.create({
      component: InasistenciasComponent,
      componentProps: {
        data: empleado,
      },
    });
    return await modal.present();

  }


  Opciones(data: any, event: Event) {
    const options = [];

    if (this.rol.id === 1) {
      options.push(
        { button: this.ac.btnEliminar, handler: () => this.EliminarEmpleados(data) },
        { button: this.ac.btnActualizar, handler: () => this.AbrirModalEmpleados(data) },
        { button: this.ac.btnProps, handler: () => this.verPropiedades(data, event) }
      );
    }

    options.push(
      { button: this.ac.btnConsumo, handler: () => this.verConsumo(data) },

      { button: this.ac.btnAgregarconsumo, handler: () => this.AbrirModalConsumo(data) },
      { button: this.ac.btnCancelar, handler: () => { console.log('Cancel clicked'); } }
    );

    this.ac.configureAndPresentActionSheet(options);
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
