import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {HomePage} from "../home/home";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environment";
import {ConnectivityProvider} from "../../providers/connectivity/connectivity";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: any;
  login: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public connectivity: ConnectivityProvider, public event: Events,
              public toastCtrl: ToastController, public menuCtrl:MenuController) {
    this.menuCtrl.enable(false);
  }

  signIn() {
    let headersOptions = new HttpHeaders().set('sign-in', window.btoa(this.login.user + ':' + this.login.password));
    // let headersOptions = new HttpHeaders().set('sign-in', window.btoa('teste4@teste.com.br:321654'));
    this.connectivity.Post(environment.serverPath+'signin', this.login, headersOptions).then( response => {
      console.log(response);
      localStorage.setItem('currentUser', JSON.stringify(response));
      localStorage.setItem('logedIn', 'true');
      this.createUser( response);
      this.navCtrl.setRoot(HomePage);
    }, err => {
      this.presentToast();
      console.log(err);
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Login e/ou Senha Inválidos, Tente Novamente',
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  createUser(user) {
    console.log('User created!');
    this.event.publish('user:created', user);
  }

}
