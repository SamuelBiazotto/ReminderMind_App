import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SpeechProvider} from "../../providers/speech/speech";
import {ConnectivityProvider} from "../../providers/connectivity/connectivity";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environment";
import {ListPage} from "../list/list";
import {SpeechRecognition} from "@ionic-native/speech-recognition";

@IonicPage()
@Component({
  selector: 'page-new-list',
  templateUrl: 'new-list.html',
})
export class NewListPage {

  currentUser:any;
  user:any;
  title: any = "Toque e Fale seu Título";
  list:any = [];
  obj:any = {persist:false, selected:false, content:"", title:"", frequency:"42", repeat: false, kind:""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public speechService: SpeechProvider, public connectivity: ConnectivityProvider,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController, public speech: SpeechRecognition) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.speechService.isSpeechSuported();
    this.speechService.getPermission();
    this.speechService.hasPermission();
    this.speechService.getSupportedLanguages();
  }

  listenForSpeech():void {
    this.speech.startListening().subscribe( data => this.list.push({content:data[0]}), error => console.log(error));
  }

  titleSpeech():void {
    this.speech.startListening().subscribe( data => this.title = (data[0]), error => console.log(error));
  }

  removerAcentos(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  }

  save() {
    for(let i in this.list){
      let name = this.list[i].content;
      this.list[i].content = this.removerAcentos(name);
    }
    this.obj.content = (JSON.stringify(this.list));
    this.obj.title = this.title;
    this.obj.creatorId = this.currentUser.id;
    this.obj.selected = true;
    let headersOptions = new HttpHeaders().set('Authorization', 'teste');
    console.log(this.obj);
    this.connectivity.Post(environment.serverPath+'todo_list', this.obj, headersOptions).then(response => {
      console.log(response);
      this.connectivity.Get(environment.serverPath + 'todo_list/python/' + this.currentUser.id, headersOptions).then( response => {
        console.log(response);
      });
      this.presentToast();
      this.presentLoadingText();
    }, err => {
      console.log(err);
    })
  }

  deleteitem($event, item){
    let index = this.list.indexOf(item);
    this.list.splice(index, 1)
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Lista Criada',
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Sua lista está sendo criada, aguarde ...'
    });
    loading.present();
    setTimeout(() => {
      this.navCtrl.push(ListPage);
    }, 1500);
    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}
