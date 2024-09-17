import { Component, Input, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/Alerts/alert-service.service';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';
import { UserServiceService } from 'src/app/services/Users/user-service.service';
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
  loaded: boolean = false;
  constructor(
    private bs: BebidaService,
    private pr: ProductoServiceService,
    private ac: AlertServiceService,
    private fn: LoaderFunctions,
    protected userservice: UserServiceService,

  ) { }
  sucursales: any = []
  existencias: any = {
    id: 0,
    idsucursal: 0,
    idproducto: 0,
    cantidad: 0,
    disponibles: 0,
    vendidos: 0
  }
  sucursal: any;
  isbebida: boolean = false;
  ngOnInit() {
    this.getsucus();
    var user = this.userservice.getUser();
    this.idu = user.sucursales.id
    this.isbebida = this.data.precioventa ? true : false
    var detalleexistencia = this.isbebida ? this.data.bebidasexitencias : this.data.productosexitencias

    if (detalleexistencia.length !== 0) {
      const index = detalleexistencia.findIndex((element: any) => element.idsucursal === this.idu);
      if (index !== -1) {

        this.existencias = detalleexistencia[index];

        if (this.isbebida) {
          this.data.bebidasexitencias.splice(index, 1);
        } else {
          this.data.productosexitencias.splice(index, 1);
        }

      }
    } else {
      this.existencias.idsucursal = this.idu
    }
    this.existencias.idproducto = this.data.id
    this.existencias.idbebida = this.data.id
  }

  getsucus(): void {
    this.loaded = false;

    this.userservice.Sucursales().subscribe(
      (response: any) => {
        if (response && response.sucursales) {
          this.sucursales = response.sucursales;
        } else {
          console.error('Error: Respuesta inválida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      },
      () => {
        this.loaded = true;
        console.log("just loaded")
      }
    );
  }

  async confirmar() {
    this.ac.presentCustomAlert("Seguro", "Estás seguro de querer alterar las existencias de: " + this.data.nombre, () => this.confirmarupdate())
  }

  idu: number = 0
  change() {
    var exis = []
    if (this.isbebida) {
      exis = this.data.bebidasexitencias
      exis.push(this.existencias)
      this.data.bebidasexitencias = []
      this.data.bebidasexitencias = exis
    } else {
      exis = this.data.productosexitencias
      exis.push(this.existencias)
      this.data.productosexitencias = []
      this.data.productosexitencias = exis
    }
    var detalleexistencia = exis
    console.log(detalleexistencia)
    if (detalleexistencia.length !== 0) {
      const index = detalleexistencia.findIndex((element: any) => element.idsucursal === this.idu);
      if (index !== -1) {
        this.existencias = detalleexistencia[index];
        this.existencias.disponibles = this.existencias.cantidad - this.existencias.vendidos
        if (this.isbebida) {
          this.data.bebidasexitencias.splice(index, 1);
        } else {
          this.data.productosexitencias.splice(index, 1);
        }
      }
    }
  }

  async confirmarupdate() {
    this.data.fecha = this.fn.obtenerFechaHoraActual()
    this.existencias.disponibles = this.existencias.cantidad - this.existencias.vendidos
    if (this.data.productosexitencias) {
      this.data.productosexitencias.push(this.existencias)
    } else {
      this.data.bebidasexitencias.push(this.existencias)
    }
    let bebida = this.data.precioventa ? true : false

    if (bebida) {
      (await this.bs.ActulizarBebida(this.data)).subscribe(
        (response: any) => {
          this.ac.presentCustomAlert("Exito", response.message)
          window.dispatchEvent(new Event('successb'));
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      (await this.pr.ActulizarProducto(this.data)).subscribe(
        (response: any) => {
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
