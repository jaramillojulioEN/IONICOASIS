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
    fecha: this.fn.obtenerHoraMexicoCentro(),
    Motivo: ''
  };

  ticket: any = {
    id: 0,
    idempleado: this.data.id,
    fecha: this.fn.obtenerHoraMexicoCentro(),
    ntickets: 0
  };

  eliminar(item: any) {

    this.ac.presentCustomAlert("Seguro?", "Estas seguro de querer eliminar este registro?", () => this.confirmareliminar(item))

  }

  edit: boolean = false


  ipasado = false
  pasado() {

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

    this.periodo = this.messalario[this.periodoindex]
    this.tickets = this.periodo.tickets
  }

  meschange(){
    this.ObtenerSalarioMes();
  }



  totaldescuento(inasistencias: any) {
    var pagodia = this.data.salario / 7;
    var desc = pagodia * inasistencias.length;
    var descTruncado = parseFloat(desc.toFixed(2));
    return descTruncado;
  }
  meses = [
    { numero: 1, nombre: 'Enero' },
    { numero: 2, nombre: 'Febrero' },
    { numero: 3, nombre: 'Marzo' },
    { numero: 4, nombre: 'Abril' },
    { numero: 5, nombre: 'Mayo' },
    { numero: 6, nombre: 'Junio' },
    { numero: 7, nombre: 'Julio' },
    { numero: 8, nombre: 'Agosto' },
    { numero: 9, nombre: 'Septiembre' },
    { numero: 10, nombre: 'Octubre' },
    { numero: 11, nombre: 'Noviembre' },
    { numero: 12, nombre: 'Diciembre' }
  ];

  mesSeleccionado: number = new Date().getMonth() + 1; 


  async ObtenerSalarioMes(load: boolean = true): Promise<void> {
    (await this.empleadoservice.SalariosMes(load, this.data.id, this.mesSeleccionado)).subscribe(
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
      const hoy = new Date(this.fn.obtenerHoraMexicoCentro());
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
    const hoy = new Date(this.fn.obtenerHoraMexicoCentro())
    this.tickets.forEach((element: any) => {
      var tktdate = new Date(element.Fecha)
      if (hoy.getDate() == tktdate.getDate()) {
        flag = false;
      }
    });


    var tkdtta = new Date(this.ticket.fecha)

    if (flag || this.ticket.id != 0 || tkdtta.getDate() != hoy.getDate()) {
      this.ticket.idempleado = this.data.id;
      this.ticket.fecha = this.fn.obtenerHoraMexicoCentro();
      (await this.empleadoservice.Registrartick(this.ticket)).subscribe(
        (response: any) => {
          this.ac.presentCustomAlert("Exito", response.message)
          this.obtenertkts()
          this.ticket.ntickets = 0
          this.ticket.fecha = this.fn.obtenerHoraMexicoCentro()
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
    this.inasistencia.fecha = this.fn.obtenerHoraMexicoCentro()
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
