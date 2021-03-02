import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/database';
import { User } from '../shared/user.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  constructor(public database: AngularFirestore) { }
  // Funcion para guardar y crear documento
  createDoc(data: any,  path: string , id: string ){
    console.log(data);
    try {
      const collection = this.database.collection(path); // creamos y obtenemos un objeto coleccion
      const res =  collection.doc(id).set(data); // creamos un documento y le enviamos la data.
      console.log(res);
      return res;

    } catch (error) {
      console.log('Error ->', error);
    }
  }

  // funcion para obtener documentos
  getDoc<tipo>(path: string, id: string){
    try {
      const collection = this.database.collection<tipo>(path); // creamos y obtenemos un objeto coleccion
      return collection.doc(id).valueChanges();
    } catch (error) {
      console.log('Error ->', error);
    }

  }



  // funcion para eliminar un documento
  deleteDoc(path: string, id: string){
    try {
      const collection = this.database.collection(path); // creamos y obtenemos un objeto coleccion
      return collection.doc(id).delete();

    } catch (error) {
      console.log('Error -> ', error);
    }

  }

  // actualizar documento
  updateDoc(path: string, id: string, data: any){
    try {
      const collection = this.database.collection(path); // creamos y obtenemos un objeto coleccion
      return collection.doc(id).update(data);
    } catch (error) {
      console.log('Error ->', error);
    }

  }

  getID(){
    return this.database.createId(); // crea un id para guardar en la base de datos
  }


  getCollection<tipo>(path: string){
    try {
      const collection = this.database.collection<tipo>(path);

      return collection.valueChanges(); // devuelve un observable para obtener toda la informacion
    } catch (error) {
      console.log('Error ->', error);
    }

  }

  getDocumento<tipo>(path: string, condicion: string, valor: string){


    try {
      const collection = this.database.collection<tipo>(path,  ref => ref.where(condicion, '==', valor));
      return collection.valueChanges(); // devuelve un observable para obtener toda la informacion
    } catch (error) {
      console.log('Error ->', error);
    }
  }


  // Metodos para hacerconsultas
  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, valor: string, usuario: string, idUsuario: string){
    try {
      const collection = this.database.collection<tipo>(path,
        ref => ref.where(parametro, condicion, valor).where(usuario, condicion, idUsuario));
      return collection.valueChanges(); // devuelve un observable para obtener toda la informacion
    } catch (error) {
      console.log('Error ->', error);
    }
  }

}
