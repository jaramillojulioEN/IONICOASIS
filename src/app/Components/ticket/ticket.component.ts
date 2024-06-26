import { Component, Input, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {

  constructor(
    private lav: LavadoService,
    private os: OrdenesService,
    private ac: AlertServiceService,
    private UserServiceService: UserServiceService,
    private md: ModalController
  ) { }
  imprimirTicket: boolean = true;
  usuario: any = this.UserServiceService.getUser()
  sst: boolean = false

  serecibe: number = 0;
  cambio: number = 0;

  ccambio(): void {
    let total = this.lavado.length != 0 ? this.lavado.total : this.orden.total
    if (total > this.serecibe) {
      this.ac.presentCustomAlert("Error", "Efectivo recibido insuficiente para pagar, faltan: " + (total - this.serecibe))
    } else {
      this.cambio = this.serecibe - total
    }
  }
  async ticket(): Promise<void> {
    console.log(this.serecibe)
    if(this.serecibe == 0 || this.serecibe == null){
      this.ac.presentCustomAlert("Error", "Ingrese la cantidad entregada por el cliente")
      return
    }
    this.sst = true
  }

  async cobrarl(): Promise<void> {
    this.lavado.estado = 2;
    let body: any = {
      tipoEntidad: "lavado",
      entidad: this.lavado
    };

    (await this.lav.CrearLavado(body)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          this.md.dismiss()
          this.ac.presentCustomAlert("Alerta", response.message)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
    console.log(this.lavado)
  }

  async cobrar(): Promise<void> {
    this.orden.estado = 5;
    (await this.os.ActualizarOrden(this.orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
          this.md.dismiss()
          this.ac.presentCustomAlert("Alerta", response.message)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

  }

  volver(): void {
    if (this.sst) {
      this.sst = false
    } else {
      this.sst = true
    }
    console.log(this.sst)
  }



  @Input() orden: any = []
  @Input() lavado: any = []
  ngOnInit() {
    console.log(this.orden)
  }

}
