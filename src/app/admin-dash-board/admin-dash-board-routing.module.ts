import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashBoardPage } from './admin-dash-board.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDashBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashBoardPageRoutingModule {}
