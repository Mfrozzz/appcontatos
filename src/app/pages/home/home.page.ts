import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContatoFirebaseService } from 'src/app/services/contato-firebase.service';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contatos: Contato[];

  constructor(private _route : Router, private _contatofirebase : ContatoFirebaseService) {
    this.carregarContatos();
  }

  carregarContatos(){
    this._contatofirebase.getContatos().subscribe(res=>{
      this.contatos = res.map(e => {
        return{
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Contato
        }as Contato;
      });
    });
  }

  gotoCadastrar(){
    this._route.navigate(["/cadastrar"]);
  }
  gotoDetalhar(contato : Contato){
    //console.log(contato);
    this._route.navigateByUrl("/detalhar",{state:{obj: contato}});
  }
}
