import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss'],
})
export class PropiedadesComponent implements OnInit {
  @Input() empleado: any;
  pass: string = ""
  hide: boolean = true
  constructor() { }

  ngOnInit() {
    this.hidepass()
  }

  hidepass(): void {
    let censured = ""
    for (let index = 0; index < this.empleado.usuarios.contraseña.length; index++) {
      censured += "*"
    }
    this.pass = censured
  }

  show(): void {
    if(this.hide){
      this.pass = this.empleado.usuarios.contraseña
      this.hide = false
    }else{
      this.hidepass()
      this.hide = true
    }
  }

}
