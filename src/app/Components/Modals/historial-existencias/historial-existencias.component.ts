import { Component, Input, OnInit } from '@angular/core';
import { BebidaService } from 'src/app/services/Bebidas/bebida.service';
import { ProductoServiceService } from 'src/app/services/Prodcutos/producto-service.service';

@Component({
  selector: 'app-historial-existencias',
  templateUrl: './historial-existencias.component.html',
  styleUrls: ['./historial-existencias.component.scss'],
})
export class HistorialExistenciasComponent implements OnInit {

  @Input() id: number = 0;
  @Input() nombre: string = '';
  @Input() isbebida: boolean = false;

  historial: any[] = [];
  loaded: boolean = false;

  constructor(
    private pr: ProductoServiceService,
    private bs: BebidaService
  ) {}

  async ngOnInit() {
    this.loaded = false;
    const obs = this.isbebida
      ? await this.bs.HistorialBebida(this.id)
      : await this.pr.HistorialProducto(this.id);

    obs.subscribe(
      (response: any) => {
        this.historial = response.historial || [];
        this.loaded = true;
      },
      (error: any) => {
        console.error('Error cargando historial:', error);
        this.loaded = true;
      }
    );
  }
}
