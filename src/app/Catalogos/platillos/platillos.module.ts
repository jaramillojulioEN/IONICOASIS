import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatillosPageRoutingModule } from './platillos-routing.module';

import { PlatillosPage } from './platillos.page';
import { ComponentsModule } from '../../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatillosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlatillosPage]
})
export class PlatillosPageModule {}
