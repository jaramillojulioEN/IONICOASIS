import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { EmpleadosService } from 'src/app/services/Empleados/empleados.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-inasistencias',
  templateUrl: './inasistencias.component.html',
  styleUrls: ['./inasistencias.component.scss'],
})
export class InasistenciasComponent implements OnInit {
  inasistencias: any = [];
  tickets: any = [];
  consumos: any = [];
  messalario: any = [];

  constructor(
    private fn: LoaderFunctions,
    private empleadoservice: EmpleadosService,
    private ac: AlertServiceService,
    private us: UserServiceService
  ) { }
  @Input() data: any = []
  falta: boolean = false;
  segmento: string = 'inasistencias'

  inasistencia: any = {
    id: 0,
    idempleado: this.data.id,
    fecha: this.fn.obtenerFechaHoraActual(),
    Motivo: ''
  };

  ticket: any = {
    id: 0,
    idempleado: this.data.id,
    fecha: this.fn.obtenerFechaHoraActual(),
    ntickets: 0
  };

  eliminar(item: any) {

    this.ac.presentCustomAlert("Seguro?", "Estas seguro de querer eliminar este registro?", () => this.confirmareliminar(item))

  }

  edit: boolean = false


  ipasado = false
  pasado(){

    this.falta = true;
    this.ipasado = true
  }


  async confirmareliminar(item: any): Promise<void> {
    if (item.cantidad) {
      (await this.us.EliminarConsumos(item)).subscribe(
        async (response: any) => {
          if (response) {
            this.ac.presentCustomAlert("Exito", response.message)

            this.start();

          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      (await this.us.EliminarInasitencias(item)).subscribe(
        async (response: any) => {
          if (response) {
            this.ac.presentCustomAlert("Exito", response.message)
            this.falta = false
            this.inasistencia.Motivo = ""

            this.start();

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

  async editar(item: any) {
    console.log(item)
    this.edit = true;
    this.falta = false
    this.inasistencia = item;
    console.log(this.edit)


  }

  async confedit() {
    (await this.us.ActulizarInasistencia(this.inasistencia)).subscribe(
      (response: any) => {
        this.ac.presentCustomAlert("Exito", response.message)
        this.edit = false;
        this.start()
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  rol: any
  ngOnInit() {
    this.rol = this.us.getRol()
    this.start();
  }


  loaded: boolean = false

  async ObtenerInsasistencias(load: boolean = true): Promise<void> {
    this.loaded = false;
    (await this.empleadoservice.Inassitencias(load, this.data.id)).subscribe(
      async (response: any) => {
        if (response && response.inasistencias) {
          this.inasistencias = response.inasistencias;
          console.log(this.inasistencias)
          this.loaded = true;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  async handleRefresh(event: any) {
    await this.start();
    event.target.complete();
  }

  async start() {
    this.ObtenerInsasistencias(true)
    this.obtenertkts(true)
    this.ObteneConsumos(true)
    this.ObtenerSalarioMes();
    this.ObtenerSalario(true)
  }

  salariorestante: any = 0
  async ObtenerSalario(load: boolean = true): Promise<void> {
    this.loaded = false;
    (await this.empleadoservice.Paga(load, this.data.id)).subscribe(
      async (response: any) => {
        if (response && response.salario) {
          this.salariorestante = response.salario;
          console.log(this.salariorestante)
          this.loaded = true;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  periodoindex: number = -1
  periodo: any = undefined
  change() {

    console.log(this.periodoindex)
    this.periodo = this.messalario[this.periodoindex]
    console.log(this.periodo)
  }



  totaldescuento(inasistencias: any) {
    var pagodia = this.data.salario / 7;
    var desc = pagodia * inasistencias.length;
    var descTruncado = parseFloat(desc.toFixed(2));
    return descTruncado;
  }


  async ObtenerSalarioMes(load: boolean = true): Promise<void> {
    (await this.empleadoservice.SalariosMes(load, this.data.id)).subscribe(
      async (response: any) => {
        if (response && response.salarios) {
          this.messalario = response.salarios;
          console.log(this.messalario)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }



  async ObteneConsumos(load: boolean = true): Promise<void> {
    this.loaded = false;
    (await this.empleadoservice.Consumos(load, this.data.id)).subscribe(
      async (response: any) => {
        if (response && response.consumos) {
          this.consumos = response.consumos;
          this.loaded = true;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async obtenertkts(load: boolean = true): Promise<void> {
    this.loaded = false;
    (await this.empleadoservice.tkts(load, this.data.id)).subscribe(
      async (response: any) => {
        if (response && response.tickets) {
          this.tickets = response.tickets;
          this.loaded = true;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  dias: string[] = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"]
  getday(fecha: string) {
    var date = new Date(fecha)
    return this.dias[date.getDay()];
  }


  editTicket(tkt: any) {
    this.ticket = tkt
  }

  verifi() {
    if (this.inasistencias.length > 0) {
      const hoy = new Date(this.fn.obtenerFechaHoraActual());
      const found = this.inasistencias.some((ina: any) =>
        new Date(ina.Fecha).getDate() === hoy.getDate()
      );
      return !found; // Return false if a match is found
    } else {
      return true;
    }
  }


  async enviartckt(edit = false) {

    var flag = true
    const hoy = new Date(this.fn.obtenerFechaHoraActual())
    this.tickets.forEach((element: any) => {
      var tktdate = new Date(element.Fecha)
      if (hoy.getDate() == tktdate.getDate()) {
        flag = false;
      }
    });


    if (flag || this.ticket.id != 0) {
      this.ticket.idempleado = this.data.id;
      (await this.empleadoservice.Registrartick(this.ticket)).subscribe(
        (response: any) => {
          this.ac.presentCustomAlert("Exito", response.message)
          this.obtenertkts()
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.ac.presentCustomAlert("Error", "Ya has registrado los tickets de hoy, en su lugar, puedes editar la cantidad de tickets")
    }
  }

  async confirmar() {
    this.inasistencia.idempleado = this.data.id
    console.log(this.inasistencia);

    (await this.empleadoservice.RegistrarInasistencia(this.inasistencia)).subscribe(
      (response: any) => {
        this.ac.presentCustomAlert("Exito", response.message)
        this.start()
        this.edit = false
        this.falta = false
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }
}
