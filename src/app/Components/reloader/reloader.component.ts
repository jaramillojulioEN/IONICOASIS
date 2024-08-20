import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reloader',
  templateUrl: './reloader.component.html',
  styleUrls: ['./reloader.component.scss'],
})
export class ReloaderComponent implements OnInit {

  constructor() { }
  @Input() refreshFunction: ((event: any) => void) | undefined;
  ngOnInit() { }

  async handleRefresh(event : any) {
    if (this.refreshFunction) {
      await this.refreshFunction(event);
    } else {
      console.error('No refresh function provided!');
    }
    event.target.complete(); 
  }
}
