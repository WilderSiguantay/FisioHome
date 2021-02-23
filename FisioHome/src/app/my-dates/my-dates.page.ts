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

  //VARIABLES
  uId= '';
  citas: Cita []=[];//producto que es un arreglo de muchos productos
  loading:any;
  alert:any;
  userSubscribe : Subscription;
  citasSubscribe: Subscription;
  private path="citas/";
  constructor(private authSvc: AuthService, 
    public firestoreService:FirestoreService, 
    public loadingController:LoadingController,
    public toastController: ToastController, 
    public alertController: AlertController) { }

  ngOnDestroy(){
    this.userSubscribe? this.userSubscribe.unsubscribe():console.log("No está subscrito");
    this.citasSubscribe? this.citasSubscribe.unsubscribe(): console.log("No está subscrito");
  }
  ngOnInit() {
    this.userSubscribe= this.authSvc.stateAuth().subscribe(res => {
      console.log(res.uid);
      if (res!== null){
        this.uId = res.uid;
        this.getCitas(this.uId);
      }
    });
  }

  
  getCitas(id:string){
    this.citasSubscribe=this.firestoreService.getDocumento<Cita>(this.path, 'paciente.uid', id).subscribe(res =>{
      this.citas = res;
      console.log(this.citas);
    })
  }

  cancelarCita(){

  }

  async getCitasNuevas(){
    console.log('get Citas Nuevas');
    
  }

  async getCitasAnteriores(){
    
  }

  changeSegment(event: any){
    console.log('ChangeSegment', event.detail.value);
  }




}
