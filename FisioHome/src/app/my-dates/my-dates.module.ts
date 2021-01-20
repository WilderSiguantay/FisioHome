import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDatesPageRoutingModule } from './my-dates-routing.module';

import { MyDatesPage } from './my-dates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDatesPageRoutingModule
  ],
  declarations: [MyDatesPage]
})
export class MyDatesPageModule {}
