import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router'



import{
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  LocalNotificationActionPerformed
} from '@capacitor/core'

const {PushNotifications} = Plugins;
const {LocalNotifications} = Plugins;



@Injectable({
  providedIn: 'root'
})
export class NotificationsService {


  constructor(public platform: Platform,
              public firebaseauthService: AuthService,
              public firestoreService: FirestoreService,
              private router: Router,
              private http: HttpClient) {
                
               }

  inicializar(){
    if(this.platform.is('capacitor')){
      PushNotifications.requestPermission().then( result =>{
        console.log('PushNotifications.requestPermission()');
        if(result.granted){
        //register con apple/google to receibe push via APNS/FCM
        PushNotifications.register();
        this.addListeners();

      }else{
        //show some error
      }
      });
    }else{
      console.log('PushNotifications.requestPermission() -> no es movil  ')
    }
      
  }
  
  addListeners(){
        
  }


}
