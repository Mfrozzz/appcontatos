import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contato } from 'src/app/models/contato';
import { ContatoService } from 'src/app/services/contato.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  [x: string]: any;
  contato : Contato;
  nome:string;
  genero:string;
  dataNascimento:string;
  telefone:number;
  data:string;
  editar: boolean = true;

  constructor(private alertController: AlertController,private _router: Router, private _contatoService : ContatoService) { }

  ngOnInit() {
    this.data=new Date().toISOString();
    const nav = this._router.getCurrentNavigation();
    this.contato = nav.extras.state.obj;
    //console.log(this.contato);
    this.nome=this.contato.nome;
    this.telefone=this.contato.telefone;
    this.genero=this.contato.genero;
    this.dataNascimento=this.contato.dataNascimento;
  }

  alterarEdicao(): void{
    if(!this.editar){
      this.editar = true;
    }else{
      this.editar = false;
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

  edicao() : void{
    this.dataNascimento = this.dataNascimento.split('T')[0];
    //console.log(this.genero+" "+this.dataNascimento);
    if((this.validar(this.nome))&&(this.validar(this.telefone))&&(this.validar(this.genero))&&(this.validar(this.dataNascimento))){
      
      if(this._contatoService.editar(this.contato,this.nome ,this.telefone,this.genero,this.dataNascimento)){
        this.presentAlert("Agenda","Sucesso","Cadastro Alterado");
        this._router.navigate(["/home"]);
      }else{
        this.presentAlert("Agenda","Erro","Contato não encontrado");
      }
      /*let contato = new Contato(this.nome,this.telefone,this.genero,this.dataNascimento);
      this._contatoService.inserir(contato);
      this.presentAlert("Agenda","Sucesso","Cadastro Realizado");*/
    }else{
      this.presentAlert("Agenda","Erro","Todos os campos são Obrigatórios");
    }
  }

  excluir():void{
    this.presentAlertConfirm("Agenda","Excluir contato","Você quer excluir o contato");
  }
  private excluirContato(): void{
    if(this._contatoService.excluir(this.contato)){
      this.presentAlert("Agenda","Sucesso","Cadastro excluido");
      this._router.navigate(["/home"]);
    }else{
      this.presentAlert("Agenda","Erro","Contato não encontrado");
    }
  }
// no trab outro arquivo.
  async presentAlertConfirm(cabecalho : string, subcabecalho : string,msg: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: msg,
      buttons: [
        {
          text:'Cancelar',
          role:'cancelar',
          cssClass:'secondary',
          handler: ()=>{}
        },{
          text:'Confimar',
          handler: ()=>{this.excluirContato()}
        }
      ],
    });

    await alert.present();
  }

}
