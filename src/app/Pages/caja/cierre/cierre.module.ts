import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule} from 'src/app/Components/components.module'
import { IonicModule } from '@ionic/angular';

import { CierrePageRoutingModule } from './cierre-routing.module';

import { CierrePage } from './cierre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    CierrePageRoutingModule
  ],
  declarations: [CierrePage]
})
export class CierrePageModule {}
