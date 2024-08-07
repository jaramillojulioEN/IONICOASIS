import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventarioPageRoutingModule } from './inventario-routing.module';
import {ComponentsModule} from 'src/app/Components/components.module'
import { InventarioPage } from './inventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    InventarioPageRoutingModule
  ],
  declarations: [InventarioPage]
})
export class InventarioPageModule {}
