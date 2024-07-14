import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent implements OnInit {

  constructor() {}


  @Input() columns: number = 0
  @Input() type: string = ""

  columnsarr: any[] = []; 

  ngOnInit() {
    this.getColumnsArray();
  }

  getColumnsArray() {
    this.columnsarr = Array.from({ length: this.columns }).map((_, index) => index);
  }
}
