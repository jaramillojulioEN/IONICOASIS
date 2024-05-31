import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CierrePage } from './cierre.page';

const routes: Routes = [
  {
    path: '',
    component: CierrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CierrePageRoutingModule {}
