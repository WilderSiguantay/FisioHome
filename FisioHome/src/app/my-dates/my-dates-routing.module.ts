import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDatesPage } from './my-dates.page';

const routes: Routes = [
  {
    path: '',
    component: MyDatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDatesPageRoutingModule {}
