import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GooglemapsComponent } from './googlemaps.component';



@NgModule({
  declarations: [
    GooglemapsComponent // agregamos la declaracion
  ],
  imports: [
    CommonModule,
    IonicModule // agregamos modulo de ionic
  ], exports: [
    GooglemapsComponent, // y exportamos el modulo porque este componente se va a utilizar en otros modulos de la app
  ]
})
export class GooglemapsModule { }
