import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore"

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database:AngularFirestore) { }

  //Funcion para guardar y crear documento
  createDoc(data: any,  path: string , id: string ){
    const collection = this.database.collection(path);//creamos y obtenemos un objeto coleccion
    return collection.doc(id).set(data) //creamos un documento y le enviamos la data.

  }

  //funcion para obtener documentos
  getDoc(path:string, id:string){
    const collection = this.database.collection(path);//creamos y obtenemos un objeto coleccion
    return collection.doc(id).valueChanges();
  }

  //funcion para eliminar un documento
  deleteDoc(path:string, id:string){
    const collection = this.database.collection(path);//creamos y obtenemos un objeto coleccion
    return collection.doc(id).delete();
  }

  //actualizar documento
  updateDoc(path:string, id:string, data:any){
    const collection = this.database.collection(path);//creamos y obtenemos un objeto coleccion
    return collection.doc(id).update(data);
  }


}
