import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cantides',
  templateUrl: './cantides.component.html',
  styleUrls: ['./cantides.component.scss'],
})
export class CantidesComponent implements OnInit {

  constructor() { }
  @Input() data: any = []
  ngOnInit() {

    console.log(this.data)

  }

}
