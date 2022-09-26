import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Contato } from '../models/contato';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ContatoFirebaseService {
  private PATH : string = 'contatos';

  constructor(private _angularFirestore: AngularFirestore, private _angularFireStorage: AngularFireStorage) { }

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
      dataNascimento:contato.dataNascimento,
      downloadURL: contato.downloadURL
    });
  }
  editarContato(contato:Contato,id:string){
    return this._angularFirestore.collection(this.PATH).doc(id).update({
      nome:contato.nome,
      telefone:contato.telefone,
      genero:contato.genero,
      dataNascimento:contato.dataNascimento,
      downloadURL: contato.downloadURL
    });
  }
  excluirContato(contato:Contato){
    return this._angularFirestore.collection(this.PATH).doc(contato.id).delete();
  }

  enviarImagem(imagem:any, contato:Contato){
    const file = imagem.item(0);
    if(file.type.split('/')[0]!='image'){
      console.error("Tipo não suportado");
      return;
    }
    const path = `images/${new Date().getTime()}_${file.name}`;
    const fileRef = this._angularFireStorage.ref(path);
    let task = this._angularFireStorage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadedFile = fileRef.getDownloadURL();
        uploadedFile.subscribe(resp => {
          contato.downloadURL = resp;
          this.inserirContato(contato);
        })
      })
    ).subscribe();
    return task;
  }

  editarImagem(imagem:any, contato:Contato,id:string){
    const file = imagem.item(0);
    if(file.type.split('/')[0]!='image'){
      console.error("Tipo não suportado");
      return;
    }
    const path = `images/${new Date().getTime()}_${file.name}`;
    const fileRef = this._angularFireStorage.ref(path);
    let task = this._angularFireStorage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadedFile = fileRef.getDownloadURL();
        uploadedFile.subscribe(resp => {
          contato.downloadURL = resp;
          this.editarContato(contato,id);
        })
      })
    ).subscribe();
    return task;
  }
}
