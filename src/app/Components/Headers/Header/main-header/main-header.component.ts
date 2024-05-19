import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  constructor(private menu: MenuController) { }
  @Input() titulo: string = ""

  ngOnInit() {}

  openFirst() {
    this.menu.toggle('second-menu');
  }
}
