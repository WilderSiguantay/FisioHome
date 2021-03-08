import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';



import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  LocalNotificationActionPerformed
} from '@capacitor/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
                 this.inicializar();
               }

  inicializar(){
    if (this.platform.is('capacitor')){
      PushNotifications.requestPermission().then( result => {
        console.log('PushNotifications.requestPermission()');
        if (result.granted){
        // register con apple/google to receibe push via APNS/FCM
        PushNotifications.register();
        this.addListeners();

      }else{
        // show some error
      }
      });
    }else{
      console.log('PushNotifications.requestPermission() -> no es movil  ');
    }
  }
  addListeners(){
    PushNotifications.addListener('registration',
    (token: PushNotificationToken) =>
    {
      this.guardarToken(token.value);
      console.log('The token is:', token);
    }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration', error);
        }
    );

    // primer plano, cuando aplicacion esta activa o despierta.
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received:', notification);
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title,
              body: notification.body,
              id: 1,
              extra:{
                data: notification.data
              }
            }
          ]
        });
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed en segundo plano: ', notification);
        this.router.navigate(['/my-dates']);
      }
    );

    LocalNotifications.addListener('localNotificationActionPerformed',
      (notification: LocalNotificationActionPerformed) => {
        console.log('Push action performed en primer plano: ', notification);
        this.router.navigate(['my-dates']);
      }
    );
  }


  async guardarToken(token: any){

  }


}
