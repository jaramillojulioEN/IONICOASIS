import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDashBoardPageRoutingModule } from './admin-dash-board-routing.module';

import { AdminDashBoardPage } from './admin-dash-board.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDashBoardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdminDashBoardPage]
})
export class AdminDashBoardPageModule {}
