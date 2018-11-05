import {Component, ViewChild} from '@angular/core';
import {AlertController, Events, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
// import { TabsPage } from '../pages/tabs/tabs';
import {HomePage} from "../pages/home/home";
import {BackgroundGeolocationProvider} from "../providers/background-geolocation/background-geolocation";
import {LoginPage} from "../pages/login/login";
import {MapPage} from "../pages/map/map";
import {ListPage} from "../pages/list/list";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../environment";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage:any = TabsPage;
  rootPage:any = LoginPage;
  currentUser:any;
  showInfo = false;
  logedIn:any;
  headersOptions = new HttpHeaders()
    .set('Access-Control-Allow-Origin', 'localhost:8080')
    .append('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Content-Type, X-Requested-With')
    .append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    .append('Access-Control-Allow-Credentials', 'true');
  pages: Array<{title: string, icon: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController,
              public event: Events, public backgroundGeolocation: BackgroundGeolocationProvider,public http: HttpClient) {

    this.pages = [
      { title: 'Home',     icon: 'home',  component: HomePage },
      { title: 'Mapa',     icon: 'map',  component: MapPage },
      { title: 'Lista',    icon: 'list-box',  component: ListPage },
      { title: 'Sair',     icon: 'exit',       component: LoginPage}
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    if(localStorage.getItem('logedIn') == 'true'){
      this.rootPage = HomePage;
      // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      setTimeout( () => {
        this.event.publish('user:created', JSON.parse(localStorage.getItem('currentUser')));
      })
    }

    this.event.subscribe('user:created', user => {
      this.currentUser = user;
      this.logedIn = JSON.parse(localStorage.getItem('logedIn'));
      this.showInfo = true;
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title === "Sair"){
      this.presentConfirm();
    }else{
      this.nav.setRoot(page.component);
    }
  }

  presentConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Deseja realmente sair da aplicação?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            localStorage.clear();
            this.backgroundGeolocation.stop();
            this.nav.setRoot(LoginPage);
          }
        }      ]
    });
    alert.present();
  }
}
