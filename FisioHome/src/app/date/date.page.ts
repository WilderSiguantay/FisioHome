import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Cita, Direccion } from '../shared/user.interface';
//import {AngularFirestoreCollection} from "@angular/fire/firestore"


@Component({
  selector: 'app-date',
  templateUrl: './date.page.html',
  styleUrls: ['./date.page.scss'],
})
export class DatePage implements OnInit {

  //Variables a utilizar
  direcciones: Direccion []=[];//producto que es un arreglo de muchos productos
  loading:any;
  alert:any;
  uId= '';
  private pathDireccion="direcciones/";

  //variables para guardar en base de datos
  newDireccion : Direccion={
    id: this.firestoreService.getID(),
    usuario: '',
    direccion: '',
    referencia: ''
  }

  newCita : Cita={
    id: this.firestoreService.getID(),
    paciente:'',
    profesional:'',
    estado:'',
    fecha:'',
    direccion: '',
    precio:null,
  }

  constructor(private authSvc: AuthService, 
    public firestoreService:FirestoreService, 
    public loadingController:LoadingController,
    public toastController: ToastController, 
    public alertController: AlertController  ) { 
  }


//llama funciones cuando carga pagina
  ngOnInit() {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res.uid);
      if (res!== null){
        this.uId = res.uid;
        this.getDirecciones();
      }
    });
   

  }


  getUserInfo(uid:string){

  }

  guardarCita(){
    this.presentAlertConfirm('Alerta','Seguro que desea ')
  }

  guardarDireccion(){

    this.presentLoading();
    this.newDireccion.usuario = this.uId;
    this.firestoreService.createDoc(this.newDireccion,this.pathDireccion,this.newDireccion.id).then( res =>{
      this.loading.dismiss();
      this.presentToast("Guadada exitosamente.");
    }).catch(error =>{
      this.presentToast("Error al guardar dirección.");
    });
  }

 /* getDirecciones(){
    
    this.firestoreService.getCollection<Direccion>(this.pathDireccion).subscribe( res => {
          
          this.direcciones = res;
      
    
    });
  }*/
  
  getDirecciones(){
    this.firestoreService.getDocumento<Direccion>(this.pathDireccion, 'usuario', this.uId).subscribe(res =>{
      this.direcciones = res;
      console.log(this.direcciones);
      

    })
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
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


  async presentAlertConfirm(header:string, msg:string, ) {
    this.alert = await this.alertController.create({
      cssClass: 'normal',
      header: header,
      message: msg + '<strong>guardar</strong> esta cita.',
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
            this.newCita.paciente = this.uId;
            this.newCita.estado = 'Pendiente';
            this.newCita.precio = 175;
            console.log(this.newCita);
            //this.guardarCita();
          }
        }
      ]
    });

    await this.alert.present();
  }

}
