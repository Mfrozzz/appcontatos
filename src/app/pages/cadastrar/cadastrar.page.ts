import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ContatoFirebaseService } from 'src/app/services/contato-firebase.service';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  /*nome : string;
  telefone : number;
  genero : string;
  dataNascimento : string;*/
  form_cadastrar: FormGroup;
  is_Submitted: boolean = false; //form tempo real
  data : string;
  constructor(private alertController: AlertController,private _router : Router, private _contatoFService : ContatoFirebaseService, private _formBuilder:FormBuilder,private _loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.data=new Date().toISOString();
    this.form_cadastrar = this._formBuilder.group({
      nome:["",[Validators.required]],
      telefone:["",[Validators.required,Validators.minLength(10)]],
      genero:["",[Validators.required]],
      dataNascimento:["",[Validators.required]]
    });
  }

  get errorControl(){
    return this.form_cadastrar.controls;
  }

  submitForm(): boolean{
    this.is_Submitted = true;
    if(!this.form_cadastrar.valid){
      this.presentAlert("Agenda","Erro","Todos os campos são Obrigatórios");
      return false;
    }else{
      this.cadastrar();
    }
  }

  private cadastrar() : void{
    this.showLoading("Aguarde...",1000);
      this._contatoFService.inserirContato(this.form_cadastrar.value).then(()=>{
        this._loadingCtrl.dismiss();
        this.presentAlert("Agenda","Sucesso","Cadastro Realizado.");
        this._router.navigate(["/home"]);
      }).catch((error)=>{
        this._loadingCtrl.dismiss();
        this.presentAlert("Agenda","Erro","Cadastro não Realizado.");
        this._router.navigate(["/home"]); 
        console.log(error);
      })
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

  async showLoading(mensagem:string,duracao:number) {
    const loading = await this._loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });

    loading.present();
  }

}
