import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignalrPage } from './signalr.page';

const routes: Routes = [
  {
    path: '',
    component: SignalrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignalrPageRoutingModule {}
