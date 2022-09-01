import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contatos: Contato[];

  constructor(private _route : Router, private _contatoService : ContatoService) {
    this.contatos = this._contatoService.contatos;
  }

  gotoCadastrar(){
    this._route.navigate(["/cadastrar"]);
  }
  gotoDetalhar(contato : Contato){
    //console.log(contato);
    this._route.navigateByUrl("/detalhar",{state:{obj: contato}});
  }
}
