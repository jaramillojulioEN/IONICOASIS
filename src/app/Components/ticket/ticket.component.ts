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
  lavadospendientes: any = [];
  lavagregado: any;
  constructor(
    private lav: LavadoService,
    private os: OrdenesService,
    private ac: AlertServiceService,
    private UserServiceService: UserServiceService,
    private md: ModalController,
  ) { }
  imprimirTicket: boolean = true;
  usuario: any = this.UserServiceService.getUser()
  sst: boolean = false

  serecibe: number = 0;
  cambio: number = 0;
  lavadoenorden: boolean = false
  ccambio(): void {
    let total = this.lavado.length != 0 ? this.lavado.total : this.orden.total
    total += this.lavagregado ? this.lavagregado.total : 0
    if (total > this.serecibe) {
      this.ac.presentCustomAlert("Error", "Efectivo recibido insuficiente para pagar, faltan: " + (total - this.serecibe))
    } else {
      this.cambio = this.serecibe - total
    }
  }
  async ticket(): Promise<void> {
    console.log(this.lavagregado)
    if (this.serecibe == 0 || this.serecibe == null) {
      this.ac.presentCustomAlert("Error", "Ingrese la cantidad entregada por el cliente")
      return
    }
    this.sst = true
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



  // async printTicket() {
  //   const printContents = document.getElementById('print-section')!.innerHTML;
  //   const base64PrintContents = btoa(printContents);
  //   var data = {
  //     bs64recipt: base64PrintContents
  //   };
  //   (await this.lav.ImprimirRecibo(data, false)).subscribe(
  //     async (response: any) => {
  //       if (response && response.message) {
  //       } else {
  //         console.error('Error: Respuesta inválida');
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error en la solicitud:', error);
  //     }
  //   );

  //   console.log(base64PrintContents);
  // }

  async cobrarl(print :boolean = true): Promise<void> {

    if(this.imprimirTicket && print){
      this.imprimir("print-section")
    }


    this.lavado.estado = 2;
    if (this.lavagregado) {
      this.lavagregado.estado = 2
    }

    let body: any = {
      tipoEntidad: "lavado",
      entidad: !this.lavagregado ? this.lavado : this.lavagregado
    };
    let load = this.lavagregado ? false : true;
    (await this.lav.CrearLavado(body, load)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          if (!this.lavagregado) {
            window.dispatchEvent(new Event('success'));
            this.ac.presentCustomAlert("Alerta", response.message)
          }

          this.lavado = undefined
          this.lavagregado = undefined
          this.obtenerLavados(1, false)
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  Eliminar() {
    this.ac.presentCustomAlert("Eliminar", "Estas seguro de querer eliminar este coche de esta orden?", () => this.confirmdelte())
  }

  async confirmdelte(): Promise<void> {
    console.log(this.lavagregado)
    this.lavagregado = undefined
  }

  async cobrar(): Promise<void> {

    if (this.imprimirTicket) {
      this.imprimir("print-section")
    }


    if (this.lavagregado) {
      this.cobrarl(false);
    }

    this.orden.estado = 5;
    (await this.os.ActualizarOrden(this.orden)).subscribe(
      async (response: any) => {
        if (response && response.message) {
          this.md.dismiss()
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
    console.log(this.lavagregado)
    this.obtenerLavados()
  }

  async obtenerLavados(estado: number = 1, load: boolean = true): Promise<void> {
    (await this.lav.lavados(estado, load)).subscribe(
      async (response: any) => {
        if (response && response.Lavados) {
          this.lavadospendientes = response.Lavados;
          console.log(this.lavadospendientes)
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
