import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpHeaders} from "@angular/common/http";
import {NewListPage} from "../new-list/new-list";
import {environment} from "../../environment";
import {ConnectivityProvider} from "../../providers/connectivity/connectivity";

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage implements OnInit{
  list: any = [];
  headerOptions = new HttpHeaders().set('Authorization', 'teste');
  teste: any;
  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public connectivity: ConnectivityProvider,
              public loading: LoadingController, public alert: AlertController) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(){
    this.presentLoadingText();
    this.getList();
  }

  getList() {
    this.headerOptions = new HttpHeaders().set('Authorization', 'teste');
    this.connectivity.Get(environment.serverPath+'todo_list/my_lists/'+ this.currentUser.id, this.headerOptions).then( response => {
      this.list = response;
      this.list.map( value => {
        value.content = JSON.parse(value.content);
      });
      console.log(this.list)
    })
  }

  newList() {
    this.navCtrl.push(NewListPage);
  }

  delete(item){
    this.presentConfirm('Confirmação de Exclusão', 'Deseja realmente excluir esta lista ?',1, item)
  }

  presentLoadingText() {
    let loading = this.loading.create({
      // spinner: 'hide',
      content: 'Suas listas estão sendo carregadas aguarde por gentileza ...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

  presentConfirm(title, message, type, item){
    const alert = this.alert.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Não',
        role: 'Não',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
        {
          text: 'Sim',
          handler: () => {
            if (type == 1 ) {
              this.connectivity.Delete(environment.serverPath + 'todo_list/' + item.id, this.headerOptions).then( response => {
                console.log(response);
                setTimeout( () => {
                  this.navCtrl.setRoot(ListPage);
                }, 1000)
              })
            }
            else if(type == 2 ){
              item.selected = false;
              item.content = JSON.stringify(item.content);
              this.connectivity.Put(environment.serverPath + 'todo_list', item, this.headerOptions).then( response => {
                console.log(response);
                setTimeout(() => {
                  this.navCtrl.setRoot(ListPage);
                }, 1000)
              })
            }
          }
        }
      ]
    });
    alert.present();
  }

  setColor() {
    return {
      'color': '#2689c7',
    }
  }
}
