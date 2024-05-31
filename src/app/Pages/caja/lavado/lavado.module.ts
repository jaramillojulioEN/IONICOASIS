import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{ComponentsModule} from 'src/app/Components/components.module'
import { IonicModule } from '@ionic/angular';

import { LavadoPageRoutingModule } from './lavado-routing.module';

import { LavadoPage } from './lavado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    LavadoPageRoutingModule
  ],
  declarations: [LavadoPage]
})
export class LavadoPageModule {}
