import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Direccion } from '../shared/user.interface';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  //VARIABLES
  uId= '';
  direcciones: Direccion []=[];//producto que es un arreglo de muchos productos
  loading:any;
  alert:any;
  private pathDireccion="direcciones/";
  enableNewProducto = false;

  //variables para guardar en base de datos
  newDireccion : Direccion;

  constructor(private authSvc: AuthService, 
    public firestoreService:FirestoreService, 
    public loadingController:LoadingController,
    public toastController: ToastController, 
    public alertController: AlertController) { }

  ngOnInit() {
    this.authSvc.stateAuth().subscribe(res => {
      console.log(res.uid);
      if (res!== null){
        this.uId = res.uid;
        this.getDirecciones();
      }
    });
   
  }


  getDirecciones(){
    this.firestoreService.getDocumento<Direccion>(this.pathDireccion, 'usuario', this.uId).subscribe(res =>{
      this.direcciones = res;
      console.log(this.direcciones);
    })
  }

  //Eliminar direccion
  async deleteDireccion(direccion:Direccion	){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: "Advertencia",
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
              this.presentToast("Direccion eliminada exitosamente");
              console.log(res);
            }).catch( error =>{
              this.presentToast("Error al eliminar direccion");
              console.log(error)
            });


            //this.guardarCita();
          }
        }
      ]
    });

    await alert.present();
  }
  
  //Nueva direccion
  NuevoItem(){
    this.enableNewProducto = true;
    this.newDireccion = {
      id: this.firestoreService.getID(),
      usuario: '',
      direccion: '',
      referencia: ''
    }
  }
  guardarDireccion(){

    this.presentLoading('Guardando...');
    this.newDireccion.usuario = this.uId;
    this.firestoreService.createDoc(this.newDireccion,this.pathDireccion,this.newDireccion.id).then( res =>{
      this.loading.dismiss();
      this.presentToast("Guadada exitosamente.");
   
      this.enableNewProducto = false;

    }).catch(error =>{
      this.loading.dismiss();
      this.presentToast("Error al guardar dirección.");
    });
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





}
