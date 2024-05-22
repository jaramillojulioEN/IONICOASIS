import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeseroPage } from './mesero.page';

const routes: Routes = [
  {
    path: '',
    component: MeseroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeseroPageRoutingModule {}
