import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  /*nome : string;
  telefone : number;
  genero : string;
  dataNascimento : string;*/
  form_cadastrar: FormGroup;
  is_Submitted: boolean = false; //form tempo real
  data : string;
  constructor(private alertController: AlertController,private _router : Router, private _contatoService : ContatoService, private _formBuilder:FormBuilder) { }

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
      this._contatoService.inserir(this.form_cadastrar.value);
      this.presentAlert("Agenda","Sucesso","Cadastro Realizado");
      this._router.navigate(["/home"]);
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
