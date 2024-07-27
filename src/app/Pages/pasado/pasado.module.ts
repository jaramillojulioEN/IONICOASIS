import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ComponentsModule} from 'src/app/Components/components.module'
import { PasadoPageRoutingModule } from './pasado-routing.module';

import { PasadoPage } from './pasado.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    PasadoPageRoutingModule
  ],
  declarations: [PasadoPage]
})
export class PasadoPageModule {}
