import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeseroPageRoutingModule } from './mesero-routing.module';

import { MeseroPage } from './mesero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeseroPageRoutingModule
  ],
  declarations: [MeseroPage]
})
export class MeseroPageModule {}
