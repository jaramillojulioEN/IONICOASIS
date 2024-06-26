import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ComponentsModule} from 'src/app/Components/components.module'
import { CajaPageRoutingModule } from './caja-routing.module';

import { CajaPage } from './caja.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    CajaPageRoutingModule
  ],
  declarations: [CajaPage]
})
export class CajaPageModule {}
