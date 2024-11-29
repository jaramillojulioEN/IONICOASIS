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

   totallab(lav: any[],corte : boolean = false): number {
    if(corte)
      return lav.reduce((acc, x) => acc + x.monto, 0);
    return lav.reduce((acc, x) => acc + x.total, 0);
  }
  

  loaded = false;
  async ObtenerInfo(load: boolean = true): Promise<void> {
    this.loaded = false;
    try {
      const response: any = await (await this.corteservice.Info(load, this.caja.id)).toPromise();
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


}
