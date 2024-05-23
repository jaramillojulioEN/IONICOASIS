import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeseroPageRoutingModule } from './mesero-routing.module';
import {ComponentsModule} from 'src/app/Components/components.module'
import { MeseroPage } from './mesero.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    MeseroPageRoutingModule
  ],
  declarations: [MeseroPage]
})


export class MeseroPageModule {}
