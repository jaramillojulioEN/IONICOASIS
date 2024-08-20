import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { LoaderFunctions } from 'src/functions/utils';

@Component({
  selector: 'app-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.scss'],
})
export class ExistenciasComponent implements OnInit {

  @Input() data: any = []
  cantidad: number = 0;
  vendidos: number = 0;
  constructor(
    private bs: BebidaService,
    private pr: ProductoServiceService,
    private ac: AlertServiceService,
    private fn: LoaderFunctions
  ) { }

  ngOnInit() {
    this.cantidad = this.data.cantidad
    console.log(this.data)
    this.vendidos = this.data.vendidos  ? this.data.vendidos : this.data.vedidos 
  }

  async confirmar() {
    this.ac.presentCustomAlert("Seguro", "Estás seguro de querer alterar las existencias de: " + this.data.nombre, () => this.confirmarupdate())
  }

  async confirmarupdate() {
    let bebida;
    this.data.cantidad = this.cantidad
    this.data.fecha = this.fn.obtenerFechaHoraActual()
    bebida = this.data.precioventa ? true : false
    console.log(bebida)
    if (bebida) {
      this.data.vedidos = this.vendidos;
      (await this.bs.ActulizarBebida(this.data)).subscribe(
        (response: any) => {
          console.log(response);
          this.ac.presentCustomAlert("Exito", response.message)
          window.dispatchEvent(new Event('successb'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      this.data.vendidos = this.vendidos;
      (await this.pr.ActulizarProducto(this.data)).subscribe(
        (response: any) => {
          console.log(response);
          this.ac.presentCustomAlert("Exito", response.message)
          window.dispatchEvent(new Event('successp'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }

}
