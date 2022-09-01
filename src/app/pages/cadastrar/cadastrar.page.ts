import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  nome : string;
  telefone : number;
  genero : string;
  dataNascimento : string;
  data : string;
  constructor(private alertController: AlertController,private _router : Router, private _contatoService : ContatoService) { }

  ngOnInit() {
    this.data=new Date().toISOString();
  }

  cadastrar() : void{
    this.dataNascimento = this.dataNascimento.split('T')[0];
    //console.log(this.genero+" "+this.dataNascimento);
    if((this.validar(this.nome))&&(this.validar(this.telefone))&&(this.validar(this.genero))&&(this.validar(this.dataNascimento))){
      let contato = new Contato(this.nome,this.telefone,this.genero,this.dataNascimento);
      this._contatoService.inserir(contato);
      this.presentAlert("Agenda","Sucesso","Cadastro Realizado");
      this._router.navigate(["/home"]);
    }else{
      this.presentAlert("Agenda","Erro","Todos os campos são Obrigatórios");
    }
  }
  private validar(campo: any): boolean{
    if(!campo){
      return false;
    }else{
      return true;
    }
  }
  async presentAlert(cabecalho : string, subcabecalho : string,msg: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
