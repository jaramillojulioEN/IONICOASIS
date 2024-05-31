import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lavado',
  templateUrl: './lavado.page.html',
  styleUrls: ['./lavado.page.scss'],
})
export class LavadoPage implements OnInit {
  segmento : string = "pago"
  fechaActual: string = "";
  constructor() { }

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
