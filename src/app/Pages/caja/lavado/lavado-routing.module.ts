import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LavadoPage } from './lavado.page';

const routes: Routes = [
  {
    path: '',
    component: LavadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LavadoPageRoutingModule {}
