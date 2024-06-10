import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {


  @Input() filterdate: string = ""
  ngOnInit() { }
  constructor(
    protected pop : PopoverController
  ) {
  }

  ret(){
    this.pop.dismiss(this.filterdate);
  }
}
