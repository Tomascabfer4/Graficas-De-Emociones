import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private firestore: Firestore) { }

  getDatos(): Observable<any>{
    const ref = collection(this.firestore, 'emociones');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

}
