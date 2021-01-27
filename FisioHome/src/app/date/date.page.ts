import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Cita, Direccion } from '../shared/user.interface';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  private pathCita = "citas/"

  ionicForm: FormGroup;
  defaultDate = "1987-06-30";
  isSubmitted = false;

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
    public alertController: AlertController,public formBuilder: FormBuilder ) { 

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

    this.ionicForm = this.formBuilder.group({
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    })
   

  }



  
  getDirecciones(){
    this.firestoreService.getDocumento<Direccion>(this.pathDireccion, 'usuario', this.uId).subscribe(res =>{
      this.direcciones = res;
      console.log(this.direcciones);
      

    })
  }
  async presentLoading(msg: string) {
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

  
  guardarDireccion(){

    this.presentLoading('Guardando...');
    this.newDireccion.usuario = this.uId;
    this.firestoreService.createDoc(this.newDireccion,this.pathDireccion,this.newDireccion.id).then( res =>{
      this.loading.dismiss();
      this.presentToast("Guadada exitosamente.");
    }).catch(error =>{
      this.presentToast("Error al guardar dirección.");
    });
  }


  async guardarCita() {

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Informacion',
      message: 'Seguro que desea <strong>programar</strong> esta cita.',
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
            this.presentLoading("Programando cita");
            this.newCita.paciente = this.uId;
            this.newCita.estado = 'Pendiente';
            this.newCita.precio = 175;
            this.firestoreService.createDoc(this.newCita, this.pathCita,this.newCita.id).then(res=>{
              this.loading.dismiss();
              this.presentToast("Cita programada");
              this.newCita = {
                id: this.firestoreService.getID(),
                paciente:'',
                profesional:'',
                estado:'',
                fecha:'',
                direccion: '',
                precio:null,
              }
              
              console.log(this.newCita);
            }).catch(error =>{
              this.loading.dismiss();
              this.presentToast("Ocurrió un error.");
            })
            //this.guardarCita();
          }
        }
      ]
    });

    await alert.present();
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('dob').setValue(date, {
      onlyself: true
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.ionicForm.value)
    }
  }

}
