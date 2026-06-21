import { Component, Input, OnInit } from '@angular/core';
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

  @Input() ids : number = 0

  model = {
    totalcaja: 0,
    idsucursal: 0,
    fechainicio : "",
    estado : 1
  }




  ngOnInit() {

    const user = this.user.getUser();
    const idsucursal = this.ids === 0 ? user.idsucursal : this.ids;
    this.model.idsucursal = idsucursal;
    this.model.fechainicio = this.obtenerFechaLocal();
  }

  private obtenerFechaLocal(): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Mexico_City',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    const parts = new Intl.DateTimeFormat('es-MX', options).formatToParts(new Date());
    const map = new Map(parts.map(p => [p.type, p.value]));
    const yyyy = map.get('year') ?? '0000';
    const mm = map.get('month') ?? '00';
    const dd = map.get('day') ?? '00';
    const hh = map.get('hour') ?? '00';
    const min = map.get('minute') ?? '00';
    const ss = map.get('second') ?? '00';
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
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
