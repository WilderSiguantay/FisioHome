import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatingHistoryPageRoutingModule } from './dating-history-routing.module';

import { DatingHistoryPage } from './dating-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatingHistoryPageRoutingModule
  ],
  declarations: [DatingHistoryPage]
})
export class DatingHistoryPageModule {}
