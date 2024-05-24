import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalleorden',
  templateUrl: './detalleorden.component.html',
  styleUrls: ['./detalleorden.component.scss'],
})
export class DetalleordenComponent  implements OnInit {
  @Input() mesa : any = []
  orden: any = [];
  estimados : any
  constructor() { }
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
  };
  ngOnInit() {
    this.orden = this.mesa.ordenes[0]
    this.Getestimandos()
  }

  Getestimandos () : void {
    let tiempototal = 0;
    var fechaorden = new Date(this.orden.fecha);
    let entrega = "";
    this.orden.ordenesplatillos.forEach((element: any) => {
      tiempototal += (element.platillos.recetas.tiempopreparacion)
    });
    fechaorden.setMinutes(fechaorden.getMinutes() + tiempototal);
    const horaEntrega = fechaorden.getHours() + ':' + (fechaorden.getMinutes() <= 9 ? "0" + fechaorden.getMinutes() : fechaorden.getMinutes());
    console.log(horaEntrega)
    this.estimados = [tiempototal, horaEntrega]
  }

}
