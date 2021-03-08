import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { User } from '../shared/user.interface';
import { element } from 'protractor';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading: any;

  constructor(private authSvc: AuthService, private router: Router,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public formBuilder: FormBuilder,
              private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.email),
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

async  onLogin(){


    try {
      const user = await this.authSvc.login(this.loginForm.value.email, this.loginForm.value.password);
      if (user){
        // todo: CheckEmail
        const isVerified = this.authSvc.isEmailVerified(user);
        // this.presentLoading('Cargando ...');
        this.redirectUser(isVerified);
        // this.loading.dismmis();
      }else{
        this.presentConfirm();

        this.loginForm = this.formBuilder.group({
          email: new FormControl('', Validators.email),
          password : new FormControl('', [Validators.required, Validators.minLength(6)]),
        });


      }
    } catch (error) {
      this.presentConfirm();
      console.log('Error ->' , error.t.message);


    }
  }

  // Login Google

async onLoginGoogle(){
  try {
    const user = await this.authSvc.loginGoogle();

    if (user){
      // todo: Check Email
      const isVerified = this.authSvc.isEmailVerified(user);
      this.redirectUser(isVerified);

      // console.log("User ->",isVerified);
      // console.log("User ->",user );
    }
  } catch (error) {
    console.log('Error ->', error);
    this.presentToast(error.message);

  }
}



async onLoginFacebook(){
  try {
    const user = await this.authSvc.loginFacebook();
    console.log(user);
  } catch (error) {
    console.log('Error ->', error);
    this.presentToast(error.message);
  }
}

private redirectUser(isVerified: boolean): void{
  if (isVerified) {
    // redireccionar a admin
    this.router.navigate(['admin']);
  } else {
    this.router.navigate(['verify-email']);
    // else pagina de verificacion
  }
}

async presentLoading(msg: string) {
  this.loading = await this.loadingController.create({
    cssClass: 'normal',
    message: msg,
  });
  await this.loading.present();
  // await loading.onDidDismiss();
  // console.log('Loading dismissed!');
}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    cssClass: 'normal',
    message: msg,
    duration: 2000
  });
  toast.present();
}

async presentAlert() {
  const alert = await this.alertCtrl.create({
    header: 'Low battery',
    buttons: ['Dismiss']
  });
  alert.present();
}


async presentConfirm() {
  const alert = await this.alertCtrl.create({
    header: 'Error de sesion',
    subHeader: 'Usuario desconocido',
    message: 'Este usuario no existe en la base de datos. ¿Desea crear uno nuevo?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Crear Cuenta',
        handler: () => {
          this.router.navigate(['register']);
        }
      }
    ]
  });
  alert.present();
}


async presentPrompt() {
  const alert = await this.alertCtrl.create({
    header: 'Login',
    inputs: [
      {
        name: 'username',
        placeholder: 'Username'
      },
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Login',
        handler: data => {
          if (true) {
            // logged in!
          } else {
            // invalid login
            return false;
          }
        }
      }
    ]
  });
  alert.present();
}





}
