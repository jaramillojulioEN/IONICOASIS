import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  constructor() { }
  @Input() colores: string[] = []
  @Input() data: number[] = []
  @Input() labels: string[] = []
  ngOnInit() {
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


}
