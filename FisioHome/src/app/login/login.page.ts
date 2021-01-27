import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authSvc: AuthService,private router: Router) { }

  ngOnInit() {
  }

async  onLogin(email, password){
    try {
      const user = await this.authSvc.login(email.value, password.value);
      if (user){
        //todo: CheckEmail
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified)
      }
    } catch (error) {
      console.log("Error ->" , error);
    }
  }

  //Login Google

async onLoginGoogle(){
  try {
    const user = await this.authSvc.loginGoogle();
    
    if(user){
      //todo: Check Email
      const isVerified = this.authSvc.isEmailVerified(user);
      this.redirectUser(isVerified)

      //console.log("User ->",isVerified);
      //console.log("User ->",user );
    }
  } catch (error) {
    console.log("Error ->", error);
  }
}



async onLoginFacebook(){
  try {
    const user = await this.authSvc.loginFacebook();
    if(user){
      //todo: Check Email.
      
      const isVerified = this.authSvc.isEmailVerified(user);
      this.redirectUser(isVerified)

      //console.log("User ->",isVerified);
      //console.log("User ->",user );
    }
  } catch (error) {
    console.log("Error ->", error);
  }
}

private redirectUser(isVerified:boolean): void{
  if (isVerified) {
    //redireccionar a admin
    this.router.navigate(['admin']);
  } else {
    this.router.navigate(['verify-email']);
    //else pagina de verificacion
  }
}


  

  


}
