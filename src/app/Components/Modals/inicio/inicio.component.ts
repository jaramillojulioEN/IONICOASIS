import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  constructor(
    private user: UserServiceService,
    private ac: AlertServiceService,
    private CortesService : CortesService,
    private md : ModalController,
    private funciones :  LoaderFunctions
  ) { }

  model = {
    totalcaja: 0,
    idsucursal: 0,
    fechainicio : "",
    estado : 1
  }




  ngOnInit() {

    let user = this.user.getUser()
    let idsucursal = user.idsucursal
    this.model.idsucursal = idsucursal
    this.model.fechainicio = this.funciones.obtenerFechaHoraActual()
  }

  async Iniciar() {
    if (this.model.totalcaja !== 0) {
      (await this.CortesService.CrearInicio(this.model)).subscribe(
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
      this.ac.presentCustomAlert("Error", "Debe ingresar efectivo a la caja")
    }
  }

}
