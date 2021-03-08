import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Cita, Direccion, User } from '../shared/user.interface';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
// import {AngularFirestoreCollection} from "@angular/fire/firestore"
import { AdminPage } from '../admin/admin.page';
import { GooglemapsComponent } from '../googlemaps/googlemaps.component';


@Component({
  selector: 'app-date',
  templateUrl: './date.page.html',
  styleUrls: ['./date.page.scss'],
})
export class DatePage implements OnInit, OnDestroy {

  // Variables a utilizar
  direcciones: Direccion [] = []; // producto que es un arreglo de muchos productos
  loading: any;
  alert: any;
  uId = '';
  private pathDireccion = 'direcciones/';
  private pathUser = 'users/';
  private pathCita = 'citas/';
  enableForm = false;
  paciente: User;
  profesional: User;
  citaForm: FormGroup;
  idDireccion: string;
  direccionSuscriber: Subscription; // para suscribirse y desuscribirse
  direccionSuscriber2: Subscription; // para suscribirse y desuscribirse
  clienteSuscriber: Subscription;
  UserSuscriber: Subscription;
  DireccionForm: FormGroup;


  // variables para guardar en base de datos
  newDireccion: Direccion;
  newCita: Cita;
  myDate = new Date();
  constructor(private authSvc: AuthService,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public formBuilder: FormBuilder,
              private modalController: ModalController
    ) {
      this.UserSuscriber = this.authSvc.stateAuth().subscribe(res => {
        if (res !== null){
          this.uId = res.uid;
          this.loadCliente();
          this.getDirecciones();
        }
      });


  }


// Evento que se ejecuta al final
  ngOnDestroy(){

    // tslint:disable-next-line: no-unused-expression
    this.direccionSuscriber ? this.direccionSuscriber.unsubscribe : console.log('No está suscrito');
    // tslint:disable-next-line: no-unused-expression
    this.direccionSuscriber2 ? this.direccionSuscriber2.unsubscribe : console.log('No está suscrito');
    // tslint:disable-next-line: no-unused-expression
    this.clienteSuscriber ? this.clienteSuscriber.unsubscribe : console.log('No está suscrito');
    // tslint:disable-next-line: no-unused-expression
    this.UserSuscriber ? this.UserSuscriber.unsubscribe : console.log('No está suscrito');
    this.DireccionForm.reset('');
    this.citaForm.reset('');
  }

// llama funciones cuando carga pagina
  ngOnInit() {
    // formulario direccion
    this.DireccionForm = this.formBuilder.group({
      direccion: new FormControl('', Validators.required),
      referencia : new FormControl('', ),
    });


    // formulario de citas
    this.citaForm = this.formBuilder.group({
      idDireccion: ['', [Validators.required]],
      fecha: ['', [Validators.required]]
    });

    this.newCita = {
      id: this.firestoreService.getID(),
      paciente: this.paciente,
      profesional: this.paciente,
      estado: 'Solicitada',
      fecha: '',
      direccion: this.newDireccion,
      precio: 175.00,
      fechaCreacion: this.myDate,
      valoracion: 0
    };

    this.newDireccion = {
      id: this.firestoreService.getID(),
      usuario: this.paciente,
      direccion: '',
      ubicacion: null,
      referencia: ''
    };


  }





  getDirecciones(){

    this.direccionSuscriber = this.firestoreService.getDocumento<Direccion>(this.pathDireccion, 'usuario.uid', this.uId).subscribe(res => {
      this.direcciones = res;
      console.log(res.length);
      console.log(this.direcciones);


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



  guardarDireccion(){

    this.presentLoading('Guardando...');
    this.newDireccion.usuario = this.paciente;
    this.firestoreService.createDoc(this.newDireccion, this.pathDireccion, this.newDireccion.id).then( res => {
      this.loading.dismiss();
      this.presentToast('Guadada exitosamente.');
    }).catch(error => {
      this.presentToastError('Error al guardar dirección.');
    });
  }


  async guardarCita() {


    this.direccionSuscriber2 = this.firestoreService.getDoc<Direccion>(this.pathDireccion, this.idDireccion).subscribe(res => {
      this.newDireccion = res;
      this.newCita.direccion = this.newDireccion;
      console.log('Direccion de cita->', this.newCita.direccion);

    });

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Informacion',
      message: 'Seguro que desea <strong>programar</strong> esta cita con un precio de Q.' + this.newCita.precio,
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
            this.almacenarCita();
          }
        }
      ]
    });

    await alert.present();
  }

  loadCliente(){
    this.clienteSuscriber = this.firestoreService.getDoc<User>(this.pathUser, this.uId).subscribe(res => {
      this.paciente = res;

    });

  }

  async almacenarCita(){
      // tslint:disable-next-line: triple-equals
      if (this.newCita.direccion != null && this.newCita.fecha != ''){
        console.log('Confirm Okay');
        this.presentLoading('Programando cita');
        this.newCita.paciente = this.paciente;
        this.newCita.profesional = null;
        this.newCita.estado = 'Solicitada';
        this.newCita.precio = 175;
        console.log(this.newCita);
        this.firestoreService.createDoc(this.newCita, this.pathCita, this.newCita.id).then(res => {
        console.log(res);
        this.loading.dismiss();
        this.presentToast('Cita programada');
        this.newCita = {
          id: this.firestoreService.getID(),
          paciente: this.paciente,
          profesional: this.paciente,
          estado: 'Solicitada',
          fecha: '',
          direccion: this.newDireccion,
          precio: 175.00,
          fechaCreacion: this.myDate,
          valoracion: 0
        };


      }).catch(error => {
        this.loading.dismiss();
        this.presentToastError('Ocurrió un error.');
      });
      // this.guardarCita();

      }else{
        this.presentToastError('Direccion o Fecha no seleccionada');
      }
  }


  nuevaDireccion(){
    this.enableForm = true;
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
      component: GooglemapsComponent ,
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
