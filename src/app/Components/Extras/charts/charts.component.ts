import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { CortesService } from 'src/app/services/cortes/cortes.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  info: any = [];

  constructor(private corteservice: CortesService) { }
  @Input() colores: string[] = []
  @Input() data: number[] = []
  @Input() caja: any = []
  @Input() labels: string[] = []
  ngOnInit() {
    this.ObtenerInfo();
    console.log(this.info.CortesCaja)
    var chartExist = Chart.getChart("ctx");
    console.log(chartExist)

    if (chartExist != undefined) {
      chartExist.destroy();
    }

    const ctx = document.getElementById('ctx') as HTMLCanvasElement


    const data = {
      labels: this.labels,
      datasets: [{
        data: this.data,
        backgroundColor: this.colores,
        borderColor: this.colores,
        borderWidth: 1
      }]
    };

    const options = {

    };

    const chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options
    });
    console.log(Chart.getChart("ctx"))
  }

  segmento = "ordenes"

  totallab(lav: any[], corte: boolean = false): number {
    if (corte)
      return lav.reduce((acc, x) => acc + x.monto, 0);
    return lav.reduce((acc, x) => acc + x.total, 0);
  }

  totalordn(ordenes: any[]): number {
    return ordenes
      .filter(x => this.estado === 0 ? x.estado === 5 : x.estado === this.estado) 
      .reduce((acc, x) => acc + x.total, 0); 
  }
  

  tipo(){
    switch(this.estado){
      case 0: return "Ordenes"
      case 7: return "Empleados"
      case 8: return "Familia"
      default : return"desconocido"
    }
  }


  ordenesEstado(): number {
    if (this.estado != 0)
      return this.info?.OrdenesCaja?.filter((o: any) => o.estado === this.estado).length || 0;
    else
      return this.info?.OrdenesCaja?.filter((o: any) => o.estado === 5).length || 0;
  }


  estado = 0;
  loaded = false;
  async ObtenerInfo(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.corteservice.Info(load, this.caja.id, this.estado)).toPromise();
      if (response && response.Info) {
        this.info = response.Info;
        console.log(this.info)
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
    this.estado = estado
    this.ObtenerInfo();
  }


}
