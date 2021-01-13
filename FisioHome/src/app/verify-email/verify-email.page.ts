import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  //recuperar usuario
  user$:Observable<User> = this.authSvc.afAuth.user;
  constructor(private authSvc:AuthService) { }


  //metodo que va a nuestro services 
  async onSendEmail(){
    try {
      await this.authSvc.sendVerificationEmail();
    } catch (error) {
      console.log('Error ->', error);
    }
    
  }


  ngOnDestroy():void{
    this.authSvc.logout();
  }
}
