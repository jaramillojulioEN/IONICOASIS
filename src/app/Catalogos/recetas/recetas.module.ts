import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecetasPageRoutingModule } from './recetas-routing.module';
import { ComponentsModule } from '../../Components/components.module';

import { RecetasPage } from './recetas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RecetasPageRoutingModule
  ],
  declarations: [RecetasPage]
})
export class RecetasPageModule {}
