import { Component, Input, OnInit } from '@angular/core';
import { MesasService } from 'src/app/services/Mesas/mesas.service'
import { AlertController, ModalController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service'
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
  
  sucursal: string = this.usuario.sucursales.sucursal

  mesadata = {
    id: this.id,
    descripcion: '',
    capacidad: 0,
    idsucursal: this.usuario.idsucursal,
    estado: 1
  };

  constructor(
    private MesasService: MesasService,
    private ac: AlertServiceService,
  ) {

  }

  ngOnInit() {
    if (this.data != null) {
      console.log(this.data)
      this.mesadata.id = this.data.id
      this.mesadata.descripcion = this.data.descripcion
      this.mesadata.capacidad = this.data.capacidad
      this.mesadata.estado = this.data.estado
    }
  }




  async confirmar(): Promise<void> {
    const { valido, mensaje } = this.validarMesa(this.mesadata);
    if (valido) {
      if (this.id == 0) {
        (await this.MesasService.CrearMesa(this.mesadata)).subscribe(
          (response: any) => {
            console.log(response);
            window.dispatchEvent(new Event('success'));
            this.ac.presentCustomAlert("Exito", response.message)
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        (await this.MesasService.ActulizarMesa(this.mesadata)).subscribe(
          (response: any) => {
            console.log(response);
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
