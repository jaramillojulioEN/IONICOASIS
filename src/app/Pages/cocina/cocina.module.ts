import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CocinaPageRoutingModule } from './cocina-routing.module';
import {ComponentsModule} from 'src/app/Components/components.module'
import { CocinaPage } from './cocina.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    CocinaPageRoutingModule
  ],
  declarations: [CocinaPage]
})
export class CocinaPageModule {}
