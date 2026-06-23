import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { CortesService } from 'src/app/services/cortes/cortes.service';
import { DetalleadminComponent } from '../../Modals/detalleadmin/detalleadmin.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit, AfterViewInit {
  info: any = { CortesCaja: [], OrdenesCaja: [], LavadosCaja: [] };
  totales: any = {};

  constructor(private corteservice: CortesService, private md: ModalController) { }
  @Input() colores: string[] = []
  @Input() data: number[] = []
  @Input() caja: any = {}
  @Input() labels: string[] = []

  async ngOnInit() {
    await this.ObtenerInfo();
  }

  ngAfterViewInit() {
    const existing = Chart.getChart('ctx');
    if (existing) existing.destroy();
    const ctx = document.getElementById('ctx') as HTMLCanvasElement;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.colores,
          borderColor: this.colores,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  segmento = 'ordenes'
  estado = 0;
  loaded = false;
  index = 0

  totallab(lav: any[], corte: boolean = false): number {
    if (corte)
      return lav.reduce((acc, x) => acc + x.monto, 0);
    return lav.reduce((acc, x) => acc + x.total, 0);
  }

  get resumenCocina(): number {
    return this.totales?.totalordenes || 0;
  }
  get resumenAutos(): number {
    return this.totales?.totallavados || 0;
  }
  get resumenRetiros(): number {
    return this.totales?.totalretiros || 0;
  }
  get resumenSumatotal(): number {
    return this.totales?.sumatotal || 0;
  }
  get resumenGanancias(): number {
    return this.totales?.ganancias || 0;
  }

  get consumosDinero(): any[] {
    return (this.info.ConsumosCaja || []).filter((c: any) => c.esDinero);
  }
  get consumosItems(): any[] {
    return (this.info.ConsumosCaja || []).filter((c: any) => !c.esDinero);
  }
  get totalConsumosDinero(): number {
    return this.consumosDinero.reduce((acc: number, c: any) => acc + (c.cantidad || 0), 0);
  }
  get totalConsumosItems(): number {
    return this.consumosItems.reduce((acc: number, c: any) => acc + c.precio, 0);
  }

  totalordn(ordenes: any[]): number {
    return ordenes
      .filter(x => this.estado === 0 ? x.estado === 5 : x.estado === this.estado)
      .reduce((acc, x) => acc + x.total, 0);
  }

  async VerOrden(data: any) {
    const modal = await this.md.create({
      component: DetalleadminComponent,
      canDismiss: true,
      componentProps: { ordenes: data },
    });
    return await modal.present();
  }

  tipo() {
    switch (this.estado) {
      case 0: return 'Órdenes'
      case 7: return 'Empleados'
      case 8: return 'Familia'
      default: return 'Desconocido'
    }
  }

  ordenesEstado(): number {
    if (this.estado !== 0)
      return this.info?.OrdenesCaja?.filter((o: any) => o.estado === this.estado).length || 0;
    return this.info?.OrdenesCaja?.filter((o: any) => o.estado === 5).length || 0;
  }

  async ObtenerInfo(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.corteservice.Info(load, this.caja.id, this.estado)).toPromise();
      if (response && response.Info) {
        this.info = response.Info;
        if (response.Totales) {
          this.totales = response.Totales;
        }
      } else {
        console.error('Error: Respuesta inválida');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      this.loaded = true;
    }
  }

  filter(estado: number) {
    this.estado = estado;
    this.ObtenerInfo();
  }
}
