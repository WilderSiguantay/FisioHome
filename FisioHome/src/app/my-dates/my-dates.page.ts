import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Cita } from '../shared/user.interface';

@Component({
  selector: 'app-my-dates',
  templateUrl: './my-dates.page.html',
  styleUrls: ['./my-dates.page.scss'],
})
export class MyDatesPage implements OnInit {

  //VARIABLES
  uId= '';
  citas: Cita []=[];//producto que es un arreglo de muchos productos
  loading:any;
  alert:any;
  private path="citas/";
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
        this.getCitas(this.uId);
      }
    });
  }

  
  getCitas(id:string){
    this.firestoreService.getDocumento<Cita>(this.path, 'paciente', id).subscribe(res =>{
      this.citas = res;
      console.log(this.citas);
    })
  }

  cancelarCita(){

  }




}
