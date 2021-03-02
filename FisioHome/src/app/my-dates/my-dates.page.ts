import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Cita } from '../shared/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-dates',
  templateUrl: './my-dates.page.html',
  styleUrls: ['./my-dates.page.scss'],
})
export class MyDatesPage implements OnInit, OnDestroy {

  // VARIABLES
  uId = '';
  citas: Cita [] = []; // producto que es un arreglo de muchos productos
  loading: any;
  alert: any;
  userSubscribe: Subscription;
  citasSubscribe: Subscription;
  citasFinalizadasSubscriber: Subscription;
  citasCanceladas: Subscription;
  idCita: string;
  private path = 'citas/';
  constructor(private authSvc: AuthService,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController) { }

  ngOnDestroy(){
    this.userSubscribe ? this.userSubscribe.unsubscribe() : console.log('No está subscrito');
    this.citasSubscribe ? this.citasSubscribe.unsubscribe() : console.log('No está subscrito');
    this.citasFinalizadasSubscriber ? this.citasFinalizadasSubscriber.unsubscribe() : console.log('No está subscrito');
    this.citasCanceladas ? this.citasCanceladas.unsubscribe() : console.log('No está subscrito');

  }
  ngOnInit() {
    this.userSubscribe = this.authSvc.stateAuth().subscribe(res => {
      console.log(res.uid);
      if (res !== null){
        this.uId = res.uid;
        this.getCitasNuevas();
//        this.getCitas(this.uId);
      }
    });
  }

  getCitasNuevas(){
    // tslint:disable-next-line: max-line-length
    this.citasSubscribe = this.firestoreService.
    getCollectionQuery<Cita>(this.path, 'estado', '==', 'Solicitada', 'paciente.uid', this.uId).
    subscribe(res => {
      this.citas = res;
      console.log(this.citas);
    });
  }

  getCitasAnteriores(){
    // tslint:disable-next-line: max-line-length
    this.citasFinalizadasSubscriber = this.firestoreService.getCollectionQuery<Cita>(this.path, 'estado', '==', 'Finalizada', 'paciente.uid', this.uId).subscribe(res => {
      this.citas = res;
      console.log(this.citas);
    });
  }

  getCitasCanceladas(){
    // tslint:disable-next-line: max-line-length
    this.citasCanceladas = this.firestoreService.getCollectionQuery<Cita>(this.path, 'estado', '==', 'Cancelada', 'paciente.uid', this.uId).subscribe(res => {
      this.citas = res;
      console.log(this.citas);
    });
  }

  changeSegment(event: any){
    const opcion = event.detail.value;
    // tslint:disable-next-line: triple-equals
    if (opcion === 'finalizados'){
      this.getCitasAnteriores();
      this.citasSubscribe ? this.citasSubscribe.unsubscribe() : console.log('No está subscrito');
      this.citasCanceladas ? this.citasCanceladas.unsubscribe() : console.log('No está subscrito');

     // this.citasSubscribe.unsubscribe();
    }else if (opcion === 'solicitados'){
      this.getCitasNuevas();
      this.citasFinalizadasSubscriber ? this.citasFinalizadasSubscriber.unsubscribe() : console.log('No está subscrito');
      this.citasCanceladas ? this.citasCanceladas.unsubscribe() : console.log('No está subscrito');

      // this.citasSubscribe.unsubscribe();

    }else if (opcion === 'canceladas'){
      this.getCitasCanceladas();
      this.citasFinalizadasSubscriber ? this.citasFinalizadasSubscriber.unsubscribe() : console.log('No está subscrito');
      this.citasSubscribe ? this.citasSubscribe.unsubscribe() : console.log('No está subscrito');
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

   // Eliminar direccion
   async cancelarCita(cita: Cita	){
    const data = {estado: 'Cancelada'};
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message:  '¿Seguro que desea <strong>CANCELAR</strong> esta cita?',
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
            this.presentLoading('Cancelando Cita...');
            this.firestoreService.updateDoc(this.path, cita.id, data).then( res => {
              this.loading.dismiss();
              this.presentToast('Cita <strong>Cancelada</strong> exitosamente');
              console.log(res);
            }).catch( error => {
              this.presentToast('Error al cancelar cita');
              console.log(error);
            });

            // this.guardarCita();
          }
        }
      ]
    });

    await alert.present();
  }








}
