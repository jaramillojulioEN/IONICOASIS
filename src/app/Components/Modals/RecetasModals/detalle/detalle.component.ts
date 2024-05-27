import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponentReceta  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() receta : any =[]


}
