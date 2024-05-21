import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadosPageRoutingModule } from './empleados-routing.module';
import {ComponentsModule} from 'src/app/Components/components.module'
import { EmpleadosPage } from './empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EmpleadosPageRoutingModule
  ],
  declarations: [EmpleadosPage]
})
export class EmpleadosPageModule {}
