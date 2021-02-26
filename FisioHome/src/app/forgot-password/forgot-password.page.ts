import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage  {

  loading:any;
  alert:any;
  formCorreo: FormGroup;
  

  constructor(private authSvc:AuthService, 
    private router: Router,
    public loadingController:LoadingController,
    public toastController: ToastController, 
    public alertController: AlertController,
    public formBuilder: FormBuilder) { 

      this.formCorreo = this.formBuilder.group({
        email: new FormControl('', Validators.email),
    })
  
  }

  

  async onResetPasword(email){
    try {
      this.presentLoading("Programando cita");
      await this.authSvc.resetPassword(email.value);
      this.loading.dismiss();
      this.presentToast("Correo enviado, revisa tu bandeja de entrada")
      this.router.navigate(['/login'])

    } catch (error) {
      this.loading.dismiss();
      console.log('Error ->', error);
      this.presentToastError(error.message);
    }
  }


   
  async presentToastError(msg:string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      header: "Ocurrió un error!",
      message: msg,
      duration: 2000,
      animated: true,
      color: "danger",
      keyboardClose: true
    });
    toast.present();
  }
  
  async presentLoading(msg:string) {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: msg,
    });
    await this.loading.present();
    //await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async onResetPassword(email){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Informacion',
      message: 'Seguro que este es el correo <strong>'+email.value+' </strong> que desea recuperar',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.onResetPasword(email)
          }
        }
      ]
    });
    
    await alert.present();
  }


}
