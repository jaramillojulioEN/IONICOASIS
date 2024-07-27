import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasadoPage } from './pasado.page';

const routes: Routes = [
  {
    path: '',
    component: PasadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasadoPageRoutingModule {}
