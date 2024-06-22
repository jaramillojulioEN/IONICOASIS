import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  @Input() titulo : string = "";
  @Input() subtitulo : string = "";
  @Input() pagina : string = "";
  @Input() cssclass : string = "";




  constructor(private router: Router) { }

  goto(pagina : string) : void{
    this.router.navigate([pagina]);
  }

  ngOnInit() {}

}
