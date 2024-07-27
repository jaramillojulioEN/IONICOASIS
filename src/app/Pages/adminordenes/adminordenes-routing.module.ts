import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminordenesPage } from './adminordenes.page';

const routes: Routes = [
  {
    path: '',
    component: AdminordenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminordenesPageRoutingModule {}
