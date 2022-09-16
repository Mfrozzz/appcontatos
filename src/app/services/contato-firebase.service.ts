import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Contato } from '../models/contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoFirebaseService {
  private PATH : string = 'contatos';

  constructor(private _angularFirestore: AngularFirestore) { }

  getContato(id: string){
    return this._angularFirestore.collection(this.PATH).doc(id).valueChanges();//retorna especifico
  }
  getContatos(){
    return this._angularFirestore.collection(this.PATH).snapshotChanges();//retorna a lista toda
  }
  inserirContato(contato:Contato){
    return this._angularFirestore.collection(this.PATH).add({
      nome:contato.nome,
      telefone:contato.telefone,
      genero:contato.genero,
      dataNascimento:contato.dataNascimento
    })
  }
  editarContato(contato:Contato,id:string){
    return this._angularFirestore.collection(this.PATH).doc(id).update({
      nome:contato.nome,
      telefone:contato.telefone,
      genero:contato.genero,
      dataNascimento:contato.dataNascimento
    });
  }
  excluirContato(contato:Contato){
    return this._angularFirestore.collection(this.PATH).doc(contato.id).delete();
  }
}
