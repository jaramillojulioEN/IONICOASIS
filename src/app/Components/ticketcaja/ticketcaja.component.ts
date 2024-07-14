import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-ticketcaja',
  templateUrl: './ticketcaja.component.html',
  styleUrls: ['./ticketcaja.component.scss'],
})
export class TicketcajaComponent  implements OnInit {

  constructor(
    private UserServiceService : UserServiceService,
    private fn : LoaderFunctions,
    private ac : AlertServiceService,
    private cortesService : CortesService,
    private lav : LavadoService
  ) { }
  usuario: any = this.UserServiceService.getUser()
  fecha : string = this.fn.obtenerFechaHoraActual()
  imprimirTicket : boolean = true
  @Input() caja : any = []
  ngOnInit() {
    console.log(this.caja)
  }

  cerracaja(caja: any): void {
    caja.estado = 2
    caja.fechacierre = this.fecha
    this.ac.presentCustomAlert("¿Seguro?", "¿Estas seguro de querer cerrar la caja?", () => this.confirmaratualizar(caja))
  }

  async printTicket() {
    const printContents = document.getElementById('print-section')!.innerHTML;
    const base64PrintContents = btoa(printContents);
    var data = {
      bs64recipt: base64PrintContents
    };
    (await this.lav.ImprimirRecibo(data, false)).subscribe(
      async (response: any) => {
        if (response && response.message) {
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );

    console.log(base64PrintContents);
  }

  async confirmaratualizar(caja: any): Promise<void> {
    if(this.imprimirTicket){
      this.printTicket()
    };
    (await this.cortesService.ActulizarCaja(caja)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          window.dispatchEvent(new Event('success'));
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

}
