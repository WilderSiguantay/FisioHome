import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatingHistoryPage } from './dating-history.page';

const routes: Routes = [
  {
    path: '',
    component: DatingHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatingHistoryPageRoutingModule {}
