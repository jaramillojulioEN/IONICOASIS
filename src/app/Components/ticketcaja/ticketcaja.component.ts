import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { LavadoService } from 'src/app/services/Lavado/lavado.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-ticketcaja',
  templateUrl: './ticketcaja.component.html',
  styleUrls: ['./ticketcaja.component.scss'],
})
export class TicketcajaComponent implements OnInit {

  constructor(
    private UserServiceService: UserServiceService,
    private fn: LoaderFunctions,
    private ac: AlertServiceService,
    private cortesService: CortesService,
    private lav: LavadoService
  ) { }
  usuario: any = this.UserServiceService.getUser()
  fecha: string = this.fn.obtenerFechaHoraActual()
  imprimirTicket: boolean = true
  @Input() caja: any = []
  ngOnInit() {
    console.log(this.caja)
  }

  cerracaja(caja: any): void {
    caja.estado = 2
    caja.fechacierre = this.fecha
    this.ac.presentCustomAlert("¿Seguro?", "¿Estas seguro de querer cerrar la caja?", () => this.confirmaratualizar(caja))
  }


  imprimir(divId: string) {
    const contenido = document.getElementById(divId);
    const style = `.header-tt,
          .footer {
            text-align: center;
            margin-bottom: 20px;
          }

          .body-tt {
            font-family: 'Courier New', Courier, monospace;
            max-width: 300px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #000;
            margin-top: 20px;
          }

          .content {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 10px 0;
            margin-bottom: 20px;
          }

          .item {
            display: flex;
            justify-content: space-between;
          }

          .total {
            font-weight: bold;
            margin-top: 10px;
          }

          .total-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }`
    console.log(contenido)
    if (!contenido) {
      console.error(`No se encontró el elemento con id "${divId}".`);
      return;
    }

    const contenidoHTML = contenido.innerHTML;
    let printWindow: any;

    try {
      printWindow = window.open('', 'noneframe'); // Sin parámetros adicionales
      if (!printWindow) {
        console.log('No se pudo abrir la ventana de impresión. Es posible que el navegador esté bloqueando ventanas emergentes.');
        return;
      }

      printWindow.document.open();
      printWindow.document.write('<html><head><title>Imprimir</title>');

      // Agregar estilos específicos si es necesario
      printWindow.document.write(`<style>${style}</style>`);

      printWindow.document.write('</head><body>');
      printWindow.document.write(contenidoHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Esperar a que el contenido esté completamente cargado antes de imprimir
      printWindow.onload = function () {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 50); // Pequeño retraso de 500ms para asegurarse de que el contenido esté renderizado
      };
    } catch (error) {
      console.error('Error al intentar abrir la ventana de impresión:', error);
    }
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
    if (this.imprimirTicket) {
      this.imprimir("print-section")
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
