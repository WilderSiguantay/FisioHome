import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { User } from '../shared/user.interface';
import { FirestorageService } from '../services/firestorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  // Variables a utilizar
  // user: User;//producto que es un arreglo de muchos productos
  loading: any;
  alert: any;
  uId = '';
  public currentDate = new Date();
  botonEnable = false;
  newImage: any;
  private path = 'users/';
  userSubscribe: Subscription;
  clienteSubscribe: Subscription;
  usuarioForm: FormGroup;
  // variables para guardar en base de datos
  Usuario: User = {
    uid: '',
    email: '',
    displayName: '',
    emailVerified: false,
    phoneNumber: '',
    photoURL: '',
  };

  constructor(private authSvc: AuthService,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public formBuilder: FormBuilder,
              public firestorageService: FirestorageService)
    {
      this.userSubscribe = this.authSvc.stateAuth().subscribe(res => {
        // console.log(res.uid);
        if (res !== null){
          this.uId = res.uid;
          this.getUserInfo(this.uId);
        }else{
          this.initCliente();
        }
      });
    }

  ngOnDestroy(){
    this.userSubscribe ? this.userSubscribe.unsubscribe() : console.log('No está suscrito');
    this.clienteSubscribe ? this.clienteSubscribe.unsubscribe() : console.log('No está suscrito');
    this.usuarioForm.reset('');
  }
  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      email : new FormControl('', ),
      telefono : new FormControl('', ),
    });
  }

  initCliente(){
    this.Usuario = {
      uid : '',
      email: '',
      displayName: '',
      emailVerified: false,
      phoneNumber: '',
      photoURL: ''
    };
  }


  newImagePerfil(event: any){
    if (event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newImage = image.target.result as string;
        this.Usuario.photoURL = this.newImage;
        const n = this.currentDate.getDate().toString() + '-' +
        this.currentDate.getMonth().toString() + '-'  + this.currentDate.getFullYear().toString() + '-' +
        this.currentDate.getHours().toString() + ':' +
        this.currentDate.getMinutes().toString() + ':' + this.currentDate.getMilliseconds().toString();
        this.newImageUpload(event, n);


      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async newImageUpload(event: any, n: string){
    const path = 'FotoPerfil';
    const name = this.uId + '-' + n;
    const file = event.target.files[0];
    this.presentLoading('Cargando Imagen...');
    await this.firestorageService.uploadImage(file, path, name).then(res => {
      this.Usuario.photoURL = res;
      console.log(res);
      console.log(this.Usuario.photoURL);
      this.botonEnable = true;
      this.loading.dismiss();
      this.presentToast('Imagen Cargada');
    }).catch(error => {
      this.loading.dismiss();
      this.presentToastError('Ocurrió un error.');
    });
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




async guardarUsuario(){
  try {
    this.presentLoading('Actualizando información...');
    this.firestoreService.createDoc(this.Usuario, this.path, this.Usuario.uid).then(res => {
      this.loading.dismiss();
      this.presentToast('Información actualizada con éxito!');
    }).catch(error => {
      this.loading.dismiss();
      this.presentToastError('Ocurrió un error.');
    });

  } catch (error) {
    console.log('Error ->', error);
    this.presentToastError('Error al actualizar datos');
  }
}



async presentToast(msg: string) {
  const toast = await this.toastController.create({
    cssClass: 'normal',
    header: 'Exito!',
    message: msg,
    duration: 2000,
    color: 'success'
  });
  toast.present();
}


async presentToastError(msg: string) {
  const toast = await this.toastController.create({
    cssClass: 'normal',
    header: 'Ocurrió un error!',
    message: msg,
    duration: 2000,
    animated: true,
    color: 'danger',
    keyboardClose: true
  });
  toast.present();
}




  getUserInfo(uid: string){
    const path = 'users';
    this.clienteSubscribe = this.firestoreService.getDoc<User>(path, uid).subscribe( res => {
        this.Usuario = res;
    });
  }



}
