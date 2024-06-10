import { Component, Input, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/Users/user-service.service'
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { OrdenesService } from 'src/app/services/Ordenes/ordenes.service'
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {

  constructor(private os: OrdenesService, private ac: AlertServiceService, private UserServiceService: UserServiceService,
    private md: ModalController
  ) { }
  imprimirTicket : boolean = true;
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
    this.sst = true
  }

  async cobrarl(): Promise<void> {

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

  volver() :void {
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
