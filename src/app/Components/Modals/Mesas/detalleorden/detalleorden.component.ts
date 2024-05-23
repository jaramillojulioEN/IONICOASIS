import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalleorden',
  templateUrl: './detalleorden.component.html',
  styleUrls: ['./detalleorden.component.scss'],
})
export class DetalleordenComponent  implements OnInit {
  @Input() mesa : any = []

  constructor() { }

  ngOnInit() {
    console.log(this.mesa)
  }

}
