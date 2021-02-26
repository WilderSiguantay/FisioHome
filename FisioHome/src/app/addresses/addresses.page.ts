import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Direccion, User } from '../shared/user.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GooglemapsComponent } from '../googlemaps/googlemaps.component';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit , OnDestroy{

  // VARIABLES
  uId = '';
  direcciones: Direccion [] = []; // producto que es un arreglo de muchos productos
  loading: any;
  alert: any;
  private pathDireccion = 'direcciones/';
  enableNewProducto = false;
  paciente: User;
  pathUser = 'users/';

  // variables para guardar en base de datos
  newDireccion: Direccion;
  DireccionForm: FormGroup;
  userSuscribe: Subscription;
  direccionSuscribe: Subscription;
  clienteSuscribe: Subscription;

  constructor(private authSvc: AuthService,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {

    }

  ngOnDestroy(){
     this.userSuscribe ?  this.userSuscribe.unsubscribe() : console.log('No esta subscrito');
     this.direccionSuscribe ?  this.userSuscribe.unsubscribe() : console.log('No esta subscrito');
     this.clienteSuscribe ?  this.userSuscribe.unsubscribe() : console.log('No esta subscrito');

  }


  ngOnInit() {
    this. userSuscribe = this.authSvc.stateAuth().subscribe(res => {
      console.log(res.uid);
      if (res !== null){
        this.uId = res.uid;
        this.loadCliente();
        this.getDirecciones();
      }
    });

    this.DireccionForm = this.formBuilder.group({
      direccion: new FormControl('', Validators.required),
      referencia : new FormControl(''),
    });

  }


  getDirecciones(){
    this.userSuscribe = this.firestoreService.getDocumento<Direccion>(this.pathDireccion, 'usuario.uid', this.uId).subscribe(res => {
      this.direcciones = res;
      console.log(this.direcciones);
    });
  }

  // Eliminar direccion
  async deleteDireccion(direccion: Direccion	){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message:  'Seguro que desea <strong>eliminar</strong> esta direccion.',
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
            console.log('Confirm Okay');
            this.presentLoading('Eliminando...');
            this.firestoreService.deleteDoc(this.pathDireccion, direccion.id).then( res => {
              this.loading.dismiss();
              this.presentToast('Direccion eliminada exitosamente');
              console.log(res);
            }).catch( error => {
              this.presentToast('Error al eliminar direccion');
              console.log(error);
            });


            // this.guardarCita();
          }
        }
      ]
    });

    await alert.present();
  }

  // Nueva direccion
  NuevoItem(){
    this.enableNewProducto = true;
    this.newDireccion = {
      id: this.firestoreService.getID(),
      usuario: this.paciente,
      direccion: '',
      ubicacion: null,
      referencia: ''
    };
  }


  guardarDireccion(){

    this.presentLoading('Guardando...');
    this.newDireccion.usuario = this.paciente;
    this.firestoreService.createDoc(this.newDireccion, this.pathDireccion, this.newDireccion.id).then( res => {
      this.loading.dismiss();
      this.presentToast('Guadada exitosamente.');

      this.enableNewProducto = false;

    }).catch(error => {
      this.loading.dismiss();
      this.presentToast('Error al guardar dirección.');
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

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg,
      duration: 2000
    });
    toast.present();
  }



  loadCliente(){
    this.clienteSuscribe = this.firestoreService.getDoc<User>(this.pathUser, this.uId).subscribe(res => {
      this.paciente = res;
    });

  }

  async addDireccion(){
    const ubicacion = this.newDireccion.ubicacion;
    const direccion = this.newDireccion.direccion;
    let position = {
      lat: 14.642070,
      lng: -90.514025
    };

    if (ubicacion !== null) {
      position = ubicacion;
    }

    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: {position}
    });
    await modalAdd.present();
    const {data} = await modalAdd.onWillDismiss();

    if (data){
      console.log('data ->', data);
      this.newDireccion.direccion = data.dir;
      this.newDireccion.ubicacion = data.pos;
      console.log('this.direccion->', this.newDireccion);
    }
  }






}
