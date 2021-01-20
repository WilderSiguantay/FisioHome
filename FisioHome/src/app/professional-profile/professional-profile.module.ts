import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfessionalProfilePageRoutingModule } from './professional-profile-routing.module';

import { ProfessionalProfilePage } from './professional-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfessionalProfilePageRoutingModule
  ],
  declarations: [ProfessionalProfilePage]
})
export class ProfessionalProfilePageModule {}
