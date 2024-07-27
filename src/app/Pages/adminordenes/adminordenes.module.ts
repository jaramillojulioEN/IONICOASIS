import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ComponentsModule} from 'src/app/Components/components.module'
import { AdminordenesPageRoutingModule } from './adminordenes-routing.module';

import { AdminordenesPage } from './adminordenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    AdminordenesPageRoutingModule
  ],
  declarations: [AdminordenesPage]
})
export class AdminordenesPageModule {}
