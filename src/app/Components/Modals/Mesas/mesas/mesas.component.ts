import { Component, Input, OnInit } from '@angular/core';
import { MesasService } from 'src/app/services/Mesas/mesas.service'
import { AlertController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
import { Calls } from 'src/functions/call';
@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss'],
})
export class MesasComponent implements OnInit {
  @Input() id: number = 0;
  @Input() titulo: string = "";
  @Input() data: any = null;
  usuario: any = JSON.parse(localStorage["usuario"])


  mesadata = {
    id: this.id,
    descripcion: '',
    capacidad: 0,
    idsucursal: 0,
    estado: 1
  };

  constructor(
    private MesasService: MesasService,
    private ac: AlertServiceService,
    private call: Calls
  ) {

  }
  sucursales: any = []
  async ngOnInit() {
    this.sucursales = await this.call.getsucus()

    if (this.data != null) {
      console.log(this.data)
      this.mesadata.id = this.data.id
      this.mesadata.descripcion = this.data.descripcion
      this.mesadata.capacidad = this.data.capacidad
      this.mesadata.estado = this.data.estado
      this.mesadata.idsucursal = this.data.idsucursal
    }
  }

  async confirmar(): Promise<void> {
    const { valido, mensaje } = this.validarMesa(this.mesadata);
    if (valido) {
      if (this.id == 0) {
        console.log("crear");
        (await this.MesasService.CrearMesa(this.mesadata)).subscribe(
          (response: any) => {
            window.dispatchEvent(new Event('success'));
            this.ac.presentCustomAlert("Exito", response.message)
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        console.log("update");

        (await this.MesasService.ActulizarMesa(this.mesadata)).subscribe(
          (response: any) => {
            this.ac.presentCustomAlert("Exito", response.message)
            window.dispatchEvent(new Event('success'));
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      }
    } else {
      this.ac.presentCustomAlert("Error", mensaje)
    }
  }

  validarMesa(mesa: any): { valido: boolean, mensaje: string } {
    if (!mesa.descripcion || mesa.descripcion.trim().length === 0) {
      return { valido: false, mensaje: 'El campo descripción no puede estar vacío' };
    }
    if (!mesa.capacidad || mesa.capacidad <= 0) {
      return { valido: false, mensaje: 'El campo capacidad debe ser un número mayor que 0' };
    }
    if (!mesa.idsucursal || mesa.idsucursal <= 0) {
      return { valido: false, mensaje: 'El campo sucursal no puede estar vacío' };
    }
    if (mesa.estado === undefined || mesa.estado === null) {
      return { valido: false, mensaje: 'El campo estado no puede estar vacío' };
    }

    return { valido: true, mensaje: 'Todos los campos son válidos' };
  }


}
