import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ComponentsModule} from 'src/app/Components/components.module'
import { IonicModule } from '@ionic/angular';

import { CortePageRoutingModule } from './corte-routing.module';

import { CortePage } from './corte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    CortePageRoutingModule
  ],
  declarations: [CortePage]
})
export class CortePageModule {}
