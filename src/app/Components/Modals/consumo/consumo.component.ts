import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.scss'],
})
export class ConsumoComponent  implements OnInit {

  constructor() { }
  @Input() titulo : string = "" 
  @Input() id : number = 0 
  @Input() data : any = []
  ngOnInit() {}
  confirmar() : void{
    
  }
}
