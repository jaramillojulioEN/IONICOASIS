import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignalrPageRoutingModule } from './signalr-routing.module';

import { SignalrPage } from './signalr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignalrPageRoutingModule
  ],
  declarations: [SignalrPage]
})
export class SignalrPageModule {}
