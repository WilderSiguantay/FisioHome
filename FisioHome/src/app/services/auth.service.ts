import { Injectable } from '@angular/core';
import { User } from '../shared/user.interface';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;
  provider = new firebase.default.auth.FacebookAuthProvider();
  constructor(public afAuth: AngularFireAuth,
              private afs: AngularFirestore ,
              private firestoreservice: FirestoreService,
              private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);

      })
    );
    this.getUid();
  }

  user;
  async resetPassword(email: string): Promise<void>{
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error -->', error);
    }
  }



  async loginFacebook() {
   try {
    this.afAuth.signInWithRedirect(new firebase.default.auth.FacebookAuthProvider())
    .then(() => {
      return this.afAuth.getRedirectResult().then(result => {
        // let token = result.credential.
        this.user = result.user;
        this.updateUserData(this.user);
        console.log(this.user);
      });
    }).catch((err) => {
      console.error(err);
    });
  }catch (error) {
    console.log('Error -->', error);
  }
}


  async loginGoogle(): Promise<User>{
    try {
      const {user} = await this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
      this.updateUserData(user);

      return user;
    } catch (error) {
      console.log('Error -->', error);
    }

  }



  async register(email: string, password: string): Promise<User>{
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      console.log('Error -->', error);
    }

  }



  async login(email: string, password: string): Promise<User>{
    try{
      const{user} = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    }catch (error){
      console.log('Error -->', error);
    }

  }

  async sendVerificationEmail(): Promise<void>{
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  isEmailVerified(user: User): boolean{
    return user.emailVerified === true ? true : false;
  }


  async logout(): Promise<void>{
    try{
      await this.afAuth.signOut().then(() => {
        this.router.navigate(['/home']);
      });
    }
    catch (error){
      console.log('Error -->', error);
    }

  }

  async  updateUserData(user: User){
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);


      this.firestoreservice.getDocumento<User>('users', 'email', user.email).subscribe(res => {
        if (res.length > 0){
          console.log('Usuario ya existe');
        }else{
          const data: User = {
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName : user.displayName,
          };

          return userRef.set(data, {merge: true});
        }
    });
  }





  async getUid(){
    const user = await this.afAuth.currentUser;
    if (user === null){
      return null;
    }else{
      return user.uid;
    }
  }

  stateAuth(){
    return this.afAuth.authState;
  }

}
