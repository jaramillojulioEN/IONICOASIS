import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  constructor() { }
  @Input() colores : string[] = []
  @Input() data : number[] = []
  @Input() labels : string[] = []
  ngOnInit() {
    console.log(this.data)
    const ctx = document.getElementById('myChart');
    const myChart = new Chart("ctx", {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          label: '$',
          data: this.data,
          backgroundColor: this.colores,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true, // Make the chart responsive to the container size
        hover: { // Customize hover behavior
          mode: 'nearest', // Show tooltip for the closest data point
          intersect: false // Prevent overlapping tooltips
        },
        plugins: { // Add plugins for additional features
          title: { // Add a title to the chart
            display: true, // Show the title
            text: 'Estado de la caja' // Title text
          }
        }
      }
    });

  }


}
