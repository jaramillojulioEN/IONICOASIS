import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-platillo-nuevo',
  templateUrl: './platillo-nuevo.component.html',
  styleUrls: ['./platillo-nuevo.component.scss'],
})
export class PlatilloNuevoComponent  implements OnInit {

  platillos = {
    nombre: '',
    idcategoria: '',
    idreceta: '',
    precio: '',
    precioempleado: ''
  };


  constructor() { }

  ngOnInit() {}

  
}
