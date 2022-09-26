import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contato } from 'src/app/models/contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from 'src/app/services/contato.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ContatoFirebaseService } from 'src/app/services/contato-firebase.service';

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
  event : any;
  imagem: any;

  constructor(private alertController: AlertController,private _router: Router, private _contatoFService : ContatoFirebaseService,private _formBuilder:FormBuilder,private _loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.data=new Date().toISOString();
    const nav = this._router.getCurrentNavigation();
    this.contato = nav.extras.state.obj;
    //console.log(this.contato);
    this.formdetalhar = this._formBuilder.group({
      nome:[this.contato.nome,[Validators.required]],
      telefone:[this.contato.telefone,[Validators.required,Validators.minLength(10)]],
      genero:[this.contato.genero,[Validators.required]],
      dataNascimento:[this.contato.dataNascimento,[Validators.required]],
      imagem: [this.contato.downloadURL,[Validators.required]]
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
    this.showLoading("Aguarde...",1000);
    this._contatoFService.editarImagem(this.imagem,this.formdetalhar.value,this.contato.id).then(()=>{
      this._loadingCtrl.dismiss();
      this.presentAlert("Agenda","Editar Contato.","Contato editado com sucesso.");
      this._router.navigate(["/home"]);
    }).catch((error)=>{
      this._loadingCtrl.dismiss();
      this.presentAlert("Agenda","Editar Contato","Erro ao editar.");
      this._router.navigate(["/home"]); 
      console.log(error);
    })
  }

  excluir():void{
    this.presentAlertConfirm("Agenda","Excluir contato","Você quer excluir o contato");
  }
  private excluirContato(): void{
    this.showLoading("Aguarde...",1000);
      this._contatoFService.excluirContato(this.contato).then(()=>{
        this._loadingCtrl.dismiss();
        this.presentAlert("Agenda","Sucesso","Contato excluido com sucesso.")
        this._router.navigate(["/home"]);
      }).catch(()=>{
        this._loadingCtrl.dismiss();
        this.presentAlert("Agenda","Erro","Erro ao excluir contato.")
      });
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

  async showLoading(mensagem:string,duracao:number) {
    const loading = await this._loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });

    loading.present();
  }

  uploadFile(imagem:any){
    this.imagem = imagem.files;
  }

}
