import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ConnectivityProvider} from "../../providers/connectivity/connectivity";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environment";
import {LoginPage} from "../login/login";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user:any = {username:"", email:"", password:""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public connectivity: ConnectivityProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  record(){
    let headersOprions = new HttpHeaders().set('sign-in', window.btoa(this.user.email + ":" + this.user.password));
    this.connectivity.Post(environment.serverPath+'register', this.user, headersOprions).then( response => {
      console.log(response);
      this.presentLoadingText();
    }, err =>{
      console.log(err);
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Sua Conta Foi Criada',
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.navCtrl.setRoot(LoginPage);
    });
    toast.present();
  }

  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Sua conta está sendo criada, aguarde ...'
    });
    loading.present();
    setTimeout(() => {
      this.presentToast();
    }, 1500);
    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}
