import { Component, Input, OnInit } from '@angular/core';
import { CategoriaServiceService } from '../../../../services/Categorias/categoria-service.service'
import { BebidaService } from '../../../../services/Bebidas/bebida.service'
import { AlertController, ModalController } from '@ionic/angular';
import {AlertServiceService} from 'src/app/services/Alerts/alert-service.service'
@Component({
  selector: 'app-bebida',
  templateUrl: './bebida.component.html',
  styleUrls: ['./bebida.component.scss'],
})
export class BebidaComponent  implements OnInit {
  categorias: any = [];
  constructor(
    private modalController: ModalController,
    private BebidaService: BebidaService,
    private categoservice: CategoriaServiceService,
    private ac : AlertServiceService
  ) { }

  @Input() id: number = 0;
  @Input() titulo: string = "";
  @Input() data: any = null;
  
  ngOnInit() {
    this.ObtenerCategorias()
    if (this.data != null) {
      this.bebidas.id = this.data.id
      this.bebidas.nombre = this.data.nombre
      this.bebidas.precioventa = this.data.precioventa
      this.bebidas.precioempleados = this.data.precioempleados
      this.bebidas.idcategoria = this.data.idcategoria
    }
  }


  bebidas = {
    id: this.id,
    nombre: '',
    idcategoria: 0,
    precioventa: '',
    precioempleados: ''
  };

  ObtenerCategorias(): void {
    this.categoservice.Categorias().subscribe(
      (response: any) => {
        if (response && response.categorias) {
          this.categorias = response.categorias;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }


  async confirmar(): Promise<void> {
    const { valido, mensaje } = this.validarBebida(this.bebidas);
    if (valido) {
      if (this.id == 0) {
        (await this.BebidaService.CrearBebida(this.bebidas)).subscribe(
          (response: any) => {
            window.dispatchEvent(new Event('success'));
            this.dismissModal();
            this.ac.presentCustomAlert("Exito", response.message)
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        (await this.BebidaService.ActulizarBebida(this.bebidas)).subscribe(
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
  
  async dismissModal() {
    await this.modalController.dismiss()
  }


  
  validarBebida(bebida: any): { valido: boolean, mensaje: string } {
    if (!bebida.nombre || bebida.nombre.trim().length === 0) {
      return { valido: false, mensaje: 'El campo nombre no puede estar vacío' };
    }
    if (!bebida.idcategoria || bebida.idcategoria.length === 0) {
      return { valido: false, mensaje: 'El campo categoría no puede estar vacío' };
    }
    if (!bebida.precioventa || bebida.precioventa.length === 0) {
      return { valido: false, mensaje: 'El campo precio no puede estar vacío' };
    }
    if (!bebida.precioempleados || bebida.precioempleados.length === 0) {
      return { valido: false, mensaje: 'El campo precio empleado no puede estar vacío' };
    }

    if (isNaN(Number(bebida.precioventa))) {
      return { valido: false, mensaje: 'El campo precio debe ser un número válido' };
    }
    if (isNaN(Number(bebida.precioempleados))) {
      return { valido: false, mensaje: 'El campo precio empleado debe ser un número válido' };
    }

    return { valido: true, mensaje: 'Todos los campos son válidos' };
  }

}
