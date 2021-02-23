import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public tipoCita:string;
  constructor(private menu: MenuController, private Authf: AuthService) { }

  ngOnInit() {
  }

  openFirst() {
    //this.menu.enable(true, 'main-menu');
    this.menu.open('main-menu');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  logout(){
    this.Authf.logout();
  }

}
