import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginMovilPageRoutingModule } from './login-movil-routing.module';

import { LoginMovilPage } from './login-movil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginMovilPageRoutingModule
  ],
  declarations: [LoginMovilPage]
})
export class LoginMovilPageModule {}
