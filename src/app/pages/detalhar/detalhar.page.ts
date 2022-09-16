import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contato } from 'src/app/models/contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from 'src/app/services/contato.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  contato : Contato;
  formdetalhar: FormGroup;
  data:string;
  editar: boolean = true;
  is_Submitted: boolean = false; //form tempo real

  constructor(private alertController: AlertController,private _router: Router, private _contatoService : ContatoService,private _formBuilder:FormBuilder) { }

  ngOnInit() {
    this.data=new Date().toISOString();
    const nav = this._router.getCurrentNavigation();
    this.contato = nav.extras.state.obj;
    //console.log(this.contato);
    this.formdetalhar = this._formBuilder.group({
      nome:[this.contato.nome,[Validators.required]],
      telefone:[this.contato.telefone,[Validators.required,Validators.minLength(10)]],
      genero:[this.contato.genero,[Validators.required]],
      dataNascimento:[this.contato.dataNascimento,[Validators.required]]
    });
  }

  alterarEdicao(): void{
    if(!this.editar){
      this.editar = true;
    }else{
      this.editar = false;
    }
  }

  get errorControl(){
    return this.formdetalhar.controls;
  }

  submitForm(): boolean{
    this.is_Submitted = true;
    if(!this.formdetalhar.valid){
      this.presentAlert("Agenda","Erro","Todos os campos são Obrigatórios");
      return false;
    }else{
      this.edicao();
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
    if(this._contatoService.editar(this.contato,this.formdetalhar.value['nome'] ,this.formdetalhar.value['telefone'],this.formdetalhar.value['genero'],this.formdetalhar.value['dataNascimento'])){
      this.presentAlert("Agenda","Sucesso","Cadastro Alterado");
      this._router.navigate(["/home"]);
    }else{
      this.presentAlert("Agenda","Erro","Contato não encontrado");
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
          role: 'confirmar',
          handler: ()=>{this.excluirContato()}
        }
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

}
