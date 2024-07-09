import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-retirar',
  templateUrl: './retirar.component.html',
  styleUrls: ['./retirar.component.scss'],
})
export class RetirarComponent implements OnInit {
  caja: any = [];
  idcajaactiva: number = 0;



  constructor(
    private cortes: CortesService,
    private functions: LoaderFunctions,
    private ac: AlertServiceService,
    private md: ModalController
  ) { }


  retiro = {
    id: 0,
    monto: 0,
    concepto: "",
    idcaja: 0,
    fecha: this.functions.obtenerFechaHoraActual()
  }

  ngOnInit() {
    this.obtenerCortesActivos()
  }


  async obtenerCortesActivos(load: boolean = true): Promise<void> {
    try {
      (await this.cortes.CortesActivos(1, load)).subscribe(
        async (response: any) => {
          if (response && response.Cortes) {
            this.caja = response.Cortes;
            if (this.caja.length > 0)
              this.retiro.idcaja = this.caja[0].id
          } else {
            console.error('Error: Respuesta inválida');
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }


  async confirmar() {
    console.log(this.retiro);
    if ((this.caja[0].sumatotal - this.caja[0].totalcaja) >= this.retiro.monto) {
      (await this.cortes.Retirar(this.retiro)).subscribe(
        (response: any) => {
          window.dispatchEvent(new Event('success'));
          this.md.dismiss();
          this.ac.presentCustomAlert("Exito", response.message)
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.ac.presentCustomAlert("Saldo Insuficiente", "La caja no cuenta con la canidad solicitada")
    }

  }

}
